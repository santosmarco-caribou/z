import Joi from 'joi'
import type { A } from 'ts-toolbelt'

import type { ZObjectUtils, ZUtils } from '../utils'
import type { ZIssueCode, ZIssueLocalContext } from './issue-map'

const VALIDATION_OK = Symbol('VALIDATION_OK')
const VALIDATION_FAIL = Symbol('VALIDATION_FAIL')

/* ----------------------------------------------------- Schemas ---------------------------------------------------- */

export type ZAnySchema = A.Type<Joi.AnySchema, 'ZAnySchema'>
export type ZAlternativesSchema = A.Type<Joi.AlternativesSchema, 'ZAlternativesSchema'>
export type ZArraySchema = A.Type<Joi.ArraySchema, 'ZArraySchema'>
export type ZBooleanSchema = A.Type<Joi.BooleanSchema, 'ZBooleanSchema'>
export type ZDateSchema = A.Type<Joi.DateSchema, 'ZDateSchema'>
export type ZEverythingSchema = A.Type<Joi.AnySchema, 'ZEverythingSchema'>
export type ZFunctionSchema = A.Type<Joi.FunctionSchema, 'ZFunctionSchema'>
export type ZNothingSchema = A.Type<Joi.AnySchema, 'ZNothingSchema'>
export type ZNumberSchema = A.Type<Joi.NumberSchema, 'ZNumberSchema'>
export type ZObjectSchema<S extends ZObjectUtils.AnyStringRecord = ZObjectUtils.AnyStringRecord> = A.Type<
  Joi.ObjectSchema<Joi.StrictSchemaMap<S>>,
  'ZObjectSchema'
>
export type ZOnlySchema<V = any> = A.Type<Joi.Schema<V>, 'ZOnlySchema'>
export type ZStringOnlySchema = A.Type<Joi.StringSchema, 'ZStringOnlySchema'>
export type ZStringSchema = A.Type<Joi.StringSchema, 'ZStringSchema'>
export type ZSymbolSchema = A.Type<Joi.SymbolSchema, 'ZSymbolSchema'>
export type ZUndefinedSchema = A.Type<Joi.AnySchema, 'ZUndefinedSchema'>

export type AnyZSchema =
  | ZAnySchema
  | ZAlternativesSchema
  | ZArraySchema
  | ZBooleanSchema
  | ZDateSchema
  | ZEverythingSchema
  | ZFunctionSchema
  | ZNothingSchema
  | ZNumberSchema
  | ZObjectSchema
  | ZOnlySchema
  | ZStringOnlySchema
  | ZStringSchema
  | ZSymbolSchema
  | ZUndefinedSchema

export type ToJoiSchema<T> = T extends null | undefined
  ? ToJoiSchema<NonNullable<T>>
  : T extends any[]
  ? Joi.ArraySchema
  : T extends boolean
  ? Joi.BooleanSchema
  : T extends Date
  ? Joi.DateSchema
  : T extends (...args: any[]) => any
  ? Joi.FunctionSchema
  : T extends number
  ? Joi.NumberSchema
  : T extends string
  ? Joi.StringSchema
  : T extends symbol
  ? Joi.SymbolSchema
  : T extends ZObjectUtils.AnyStringRecord
  ? Joi.ObjectSchema<{
      [K in keyof T]: ToJoiSchema<T[K]>
    }>
  : Joi.AnySchema

/* ------------------------------------------------ Custom validation ----------------------------------------------- */

export type CustomValidationHelpers<T, V extends Joi.Schema> = {
  OK(value: T): [typeof VALIDATION_OK, T]
  FAIL<_T extends ZIssueCode<V>, Ctx extends Partial<ZIssueLocalContext<_T>>>(
    issue: _T,
    context?: Ctx
  ): [typeof VALIDATION_FAIL, _T, Ctx | undefined]
}

export type CustomValidationResult<T, V extends Joi.Schema> = ReturnType<
  CustomValidationHelpers<T, V>[keyof CustomValidationHelpers<T, V>]
>

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                     ZValidator                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZValidator {
  static ZJoi = Joi.defaults(schema => schema.required())

  /**
   * Everything except `undefined`.
   */
  static any = () => this.ZJoi.any() as ZAnySchema
  /**
   * Alternatives schema.
   */
  static alternatives = (...alternatives: Joi.SchemaLike[]) =>
    this.ZJoi.alternatives(alternatives) as ZAlternativesSchema
  /**
   * Array. No `undefined`.
   */
  static array = (...items: Joi.SchemaLikeWithoutArray[]) => this.ZJoi.array().items(...items) as ZArraySchema
  /**
   * Boolean. No `undefined`.
   */
  static boolean = () => this.ZJoi.boolean() as ZBooleanSchema
  /**
   * Date. No `undefined`.
   */
  static date = () => this.ZJoi.date() as ZDateSchema
  /**
   * Everything (including `undefined`).
   */
  static everything = () => this.ZJoi.any() as ZEverythingSchema
  /**
   * Function. No `undefined`.
   */
  static function = () => this.ZJoi.function() as ZFunctionSchema
  /**
   * Nothing (not even `undefined`).
   */
  static nothing = () => this.ZJoi.any().forbidden() as ZNothingSchema
  /**
   * Number. No `undefined`.
   */
  static number = () => this.ZJoi.number() as ZNumberSchema
  /**
   * Object. No `undefined`.
   */
  static object = <S extends ZObjectUtils.AnyStringRecord>(shape: Joi.StrictSchemaMap<S>) =>
    this.ZJoi.object<S, true>(shape) as ZObjectSchema<S>
  /**
   * Only certain values. No `undefined`.
   */
  static only = <V>(value: V) => this.ZJoi.valid(value) as ZOnlySchema<V>
  /**
   * String. No `undefined`.
   */
  static string = Object.assign(() => this.ZJoi.string() as ZStringSchema, {
    /**
     * String with only certain values. No `undefined`.
     */
    only: (...values: string[]) => this.ZJoi.string().valid(...values) as ZStringOnlySchema,
  })
  /**
   * Symbol. No `undefined`.
   */
  static symbol = () => this.ZJoi.symbol() as ZSymbolSchema
  /**
   * Only `undefined`.
   */
  static undefined = () => this.ZJoi.any().forbidden() as ZUndefinedSchema

  /* ---------------------------------------------------------------------------------------------------------------- */

  static custom = <T, V extends AnyZSchema>(
    baseValidator: V,
    handler: (value: JoiSchemaToHandlerValue<V>, helpers: CustomValidationHelpers<T, V>) => CustomValidationResult<T, V>
  ): V => {
    const helpers: CustomValidationHelpers<T, V> = {
      OK: value => [VALIDATION_OK, value],
      FAIL: (issue, ctx) => [VALIDATION_FAIL, issue, ctx],
    }

    return baseValidator.custom((_value: JoiSchemaToHandlerValue<V>, _helpers) => {
      const [result, valueOrIssue, issueCtx] = handler(_value, helpers)
      if (result === VALIDATION_OK) return valueOrIssue
      else return _helpers.error(valueOrIssue, issueCtx)
    }) as V
  }
}

/* ------------------------------------------------------------------------------------------------------------------ */

type JoiSchemaToHandlerValue<V extends Joi.Schema> = V extends Joi.ArraySchema
  ? any[]
  : V extends Joi.BooleanSchema
  ? boolean
  : V extends Joi.DateSchema
  ? Date
  : V extends Joi.FunctionSchema
  ? ZUtils.Function
  : any
