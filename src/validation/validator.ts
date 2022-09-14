import Joi from 'joi'
import { cloneDeep } from 'lodash'
import type { O } from 'ts-toolbelt'

import {
  AnyZDef,
  AnyZIssueCode,
  BaseZ,
  ParseOptions,
  Z_ISSUE_MAP,
  ZDependencies,
  ZHooks,
  ZIssueLocalContext,
  ZOutput,
} from '../_internals'
import { EmptyObject, mergeSafe } from '../utils'

const ZJoi = Joi.defaults(schema => schema.required())

const VALIDATION_OK = Symbol('VALIDATION_OK')
const VALIDATION_FAIL = Symbol('VALIDATION_FAIL')

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZSchema                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZSchema<JoiSchema extends Joi.Schema> = JoiSchema & {
  validate<Res>(input: unknown, options: Joi.ValidationOptions): Joi.ValidationResult<Res>
}

export type AnyZSchema = ZSchema<Joi.Schema>

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                     ZValidator                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export const DEFAULT_VALIDATION_OPTIONS: Joi.ValidationOptions & Required<ParseOptions> = {
  abortEarly: false,
}

/* ----------------------------------------------------- Checks ----------------------------------------------------- */

export type ZCheckOptions<IssueCode extends AnyZIssueCode, Extras extends O.Object = EmptyObject> = {
  message?: string | ((context: ZIssueLocalContext<IssueCode>) => string)
} & Extras

/* ------------------------------------------------ Custom validation ----------------------------------------------- */

export type CustomValidationHelpers<Output> = {
  OK<V extends Output = Output>(value: V): [typeof VALIDATION_OK, V]
  FAIL<IssueCode extends AnyZIssueCode>(
    issue: IssueCode,
    context: Omit<ZIssueLocalContext<IssueCode>, 'label'>
  ): [typeof VALIDATION_FAIL, IssueCode, Omit<ZIssueLocalContext<IssueCode>, 'label'>]
}

export type CustomValidationResult<Output> = ReturnType<
  CustomValidationHelpers<Output>[keyof CustomValidationHelpers<Output>]
>

/* ------------------------------------------------------------------------------------------------------------------ */

export interface ZValidator<Def extends AnyZDef> extends BaseZ<Def>, ZHooks<Def> {}

export class ZValidator<Def extends AnyZDef> {
  private $_validator: Def['Validator']

  constructor({ validator }: ZDependencies<Def>) {
    this.$_validator = validator
  }

  get _validator() {
    return this.$_validator
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  protected _validate(input: unknown, options: ParseOptions | undefined): Joi.ValidationResult<ZOutput<this>> {
    const _opts = mergeSafe(DEFAULT_VALIDATION_OPTIONS, options ?? {})
    const _input = this.hooks.beforeParse.reduce((acc, hook) => hook.handler(acc), cloneDeep(input))
    const result = this._validator.validate<ZOutput<this>>(_input, _opts)
    return this.hooks.afterParse.reduce((acc, hook) => ({ ...acc, result: hook.handler(acc.value) }), cloneDeep(result))
  }

  protected _addCheck(fn: (validator: Def['Validator']) => Def['Validator']): this
  protected _addCheck<IssueCode extends AnyZIssueCode>(
    issue: IssueCode,
    fn: (validator: Def['Validator']) => Def['Validator'],
    options: ZCheckOptions<IssueCode> | undefined
  ): this
  protected _addCheck<IssueCode extends AnyZIssueCode>(
    fnOrIssue: ((validator: Def['Validator']) => Def['Validator']) | IssueCode,
    fn?: (validator: Def['Validator']) => Def['Validator'],
    options?: ZCheckOptions<IssueCode> | undefined
  ): this {
    if (typeof fnOrIssue === 'function') {
      this._updateValidator(fnOrIssue)
      return this
    }

    fn && this._updateValidator(fn)

    if (options?.message) {
      const ctxTags = [
        ...[...Z_ISSUE_MAP[fnOrIssue].matchAll(/{{#[^}]*}}/g)].map(m => m[0]?.slice(3, -2)),
        'key',
        'value',
      ] as ZIssueLocalContext<IssueCode, { Extras: true }>[keyof ZIssueLocalContext<IssueCode, { Extras: true }>][]

      const msgStr =
        typeof options.message === 'string'
          ? options.message
          : options.message(
              Object.fromEntries(ctxTags.map(tag => [tag, `{{#${tag as string}}}`])) as ZIssueLocalContext<
                IssueCode,
                { Extras: true }
              >
            )

      this._updateValidator(v => v.message(msgStr))
    }
    return this
  }

  protected _updateValidatorPreferences(prefs: Joi.ValidationOptions): this {
    this.$_validator = this._validator.preferences(prefs)
    return this
  }

  protected _updateValidator(fn: (v: Def['Validator']) => Def['Validator']): this {
    this.$_validator = fn(this._validator)
    return this
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static any = (): ZSchema<Joi.AnySchema> => ZJoi.any()
  static alternatives = (...alts: Joi.Schema[]): ZSchema<Joi.AlternativesSchema> => ZJoi.alternatives(...alts)
  static array = (element: Joi.Schema): ZSchema<Joi.ArraySchema> => ZJoi.array().items(element)
  static binary = () => ZJoi.binary()
  static boolean = (): ZSchema<Joi.BooleanSchema> => ZJoi.boolean()
  static date = (): ZSchema<Joi.DateSchema> => ZJoi.date()
  static number = (): ZSchema<Joi.NumberSchema> => ZJoi.number()
  static string = (): ZSchema<Joi.StringSchema> => ZJoi.string()
  static symbol = (): ZSchema<Joi.SymbolSchema> => ZJoi.symbol()
  static tuple = (...elements: Joi.Schema[]): ZSchema<Joi.ArraySchema> => ZJoi.array().ordered(...elements)
  static object = (schema: Joi.SchemaMap): ZSchema<Joi.ObjectSchema> => ZJoi.object(schema)

  static custom = <Output>(
    fn: (value: unknown, helpers: CustomValidationHelpers<Output>) => CustomValidationResult<Output>
  ): ZSchema<Joi.Schema<Output>> => {
    const helpers: CustomValidationHelpers<Output> = {
      OK: <V extends Output = Output>(value: V) => [VALIDATION_OK, value],
      FAIL: (issue, ctx) => [VALIDATION_FAIL, issue, ctx],
    }

    const validator: Joi.CustomValidator<Output> = (_value, _helpers) => {
      const [result, valueOrIssue] = fn(_value, helpers)
      if (result === VALIDATION_OK) return valueOrIssue
      else return _helpers.error(valueOrIssue)
    }

    return ZJoi.custom(validator)
  }
}
