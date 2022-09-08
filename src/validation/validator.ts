import Joi from 'joi'
import type { A } from 'ts-toolbelt'

import type { AnyZDef } from '../def'
import type { ZObjectUtils, ZUtils } from '../utils'
import { type AnyZ, type Z, ZArray } from '../z/z'
import type { ZIssueCode, ZIssueLocalContext } from './issue-map'

const VALIDATION_OK = Symbol('VALIDATION_OK')
const VALIDATION_FAIL = Symbol('VALIDATION_FAIL')

/* ----------------------------------------------------- Schemas ---------------------------------------------------- */

export type ZAnySchema = A.Type<Joi.AnySchema, 'ZAnySchema'>
export type ZAlternativesSchema = A.Type<Joi.AlternativesSchema, 'ZAlternativesSchema'>
export type ZArraySchema = A.Type<Joi.ArraySchema, 'ZArraySchema'>
export type ZBooleanSchema = A.Type<Joi.BooleanSchema, 'ZBooleanSchema'>
export type ZDateSchema = A.Type<Joi.DateSchema, 'ZDateSchema'>
export type ZEntriesSchema = A.Type<Joi.AnySchema, 'ZEntriesSchema'>
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
  | ZEntriesSchema
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

export type CustomValidationOkFn<T = any> = (value: T) => [typeof VALIDATION_OK, T]
export type CustomValidationFailFn<Z extends AnyZ = AnyZ> = <
  T extends ZIssueCode<Z>,
  Ctx extends Partial<ZIssueLocalContext<T>>
>(
  issue: T,
  context?: Ctx
) => [typeof VALIDATION_FAIL, T, Ctx | undefined]

export type CustomValidationHelpers<T, Z extends AnyZ> = {
  OK: CustomValidationOkFn<T>
  FAIL: CustomValidationFailFn<Z>
}

export type CustomValidationResult<T, Z extends AnyZ> = ReturnType<
  CustomValidationHelpers<T, Z>[keyof CustomValidationHelpers<T, Z>]
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

  static entries = <K extends Z<PropertyKey, AnyZDef>, V extends AnyZ>(
    keyType: K,
    valueType: V,
    onGetEntries: (
      value: any,
      FAIL: CustomValidationFailFn
    ) => { entries: [any, any][]; error?: null } | { entries?: null; error: ReturnType<CustomValidationFailFn> },
    onKeyFail: (FAIL: CustomValidationFailFn) => ReturnType<CustomValidationFailFn>,
    onValueFail: (FAIL: CustomValidationFailFn) => ReturnType<CustomValidationFailFn>
  ) =>
    this.custom<unknown, ZEntriesSchema, AnyZ>(this.any() as unknown as ZEntriesSchema, (value, { OK, FAIL }) => {
      const { entries, error } = onGetEntries(value, FAIL)

      if (error) return error

      const keyValidator = ZArray.create(keyType)
      const valueValidator = ZArray.create(valueType)

      const [{ error: keyError }, { error: valueError }] = [
        keyValidator.safeParse(entries.map(([k]) => k)),
        valueValidator.safeParse(entries.map(([, v]) => v)),
      ]

      if (keyError) return onKeyFail(FAIL)
      if (valueError) return onValueFail(FAIL)

      return OK(value)
    })

  /* ---------------------------------------------------------------------------------------------------------------- */

  static custom = <T, V extends AnyZSchema, Z extends AnyZ>(
    baseValidator: V,
    handler: (value: JoiSchemaToHandlerValue<V>, helpers: CustomValidationHelpers<T, Z>) => CustomValidationResult<T, Z>
  ): V => {
    const helpers: CustomValidationHelpers<T, Z> = {
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
