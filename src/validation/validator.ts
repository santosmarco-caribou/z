import Joi from 'joi'
import { cloneDeep } from 'lodash'
import type { O } from 'ts-toolbelt'
import type { Simplify } from 'type-fest'

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
  messages: Z_ISSUE_MAP,
}

/* ----------------------------------------------------- Checks ----------------------------------------------------- */

export type ZCheckOptions<IssueCode extends AnyZIssueCode, Extras extends O.Object = EmptyObject> = Simplify<
  { message?: string | ((context: ZIssueLocalContext<IssueCode>) => string) } & Extras,
  { deep: true }
>

/* ------------------------------------------------ Custom validation ----------------------------------------------- */

export type CustomValidationHelpers<Output> = {
  OK<V extends Output = Output>(value: V): [typeof VALIDATION_OK, V]
  FAIL<IssueCode extends AnyZIssueCode>(
    issue: IssueCode,
    ...args: Omit<ZIssueLocalContext<IssueCode>, 'label'> extends EmptyObject
      ? never[]
      : [Omit<ZIssueLocalContext<IssueCode>, 'label'>]
  ): [typeof VALIDATION_FAIL, IssueCode, Omit<ZIssueLocalContext<IssueCode>, 'label'>]
}

export type CustomValidationResult =
  | [typeof VALIDATION_OK, any]
  | [typeof VALIDATION_FAIL, AnyZIssueCode, Record<string, any>]

export type CustomValidationOptions = {
  baseValidator?: Joi.Schema
}

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
    return this.hooks.afterParse.reduce(
      (acc, hook) => ({ ...acc, value: acc.value ? hook.handler(acc.value) : undefined }),
      cloneDeep(result)
    )
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
  static array = (element?: Joi.Schema): ZSchema<Joi.ArraySchema> =>
    element ? ZJoi.array().items(element) : ZJoi.array()
  static binary = () => ZJoi.binary()
  static boolean = (): ZSchema<Joi.BooleanSchema> => ZJoi.boolean()
  static date = (): ZSchema<Joi.DateSchema> => ZJoi.date()
  static function = (): ZSchema<Joi.FunctionSchema> => ZJoi.function()
  static number = (): ZSchema<Joi.NumberSchema> => ZJoi.number()
  static string = (): ZSchema<Joi.StringSchema> => ZJoi.string()
  static symbol = (): ZSchema<Joi.SymbolSchema> => ZJoi.symbol()
  static tuple = (...elements: Joi.Schema[]): ZSchema<Joi.ArraySchema> => ZJoi.array().ordered(...elements)
  static object = (schema?: Joi.SchemaMap): ZSchema<Joi.ObjectSchema> => (schema ? ZJoi.object(schema) : ZJoi.object())

  static custom = <Output, Opts extends CustomValidationOptions>(
    fn: (value: unknown, helpers: CustomValidationHelpers<Output>) => CustomValidationResult,
    options?: Opts
  ): ZSchema<Opts['baseValidator'] extends Joi.Schema ? Opts['baseValidator'] : Joi.Schema<Output>> => {
    const helpers: CustomValidationHelpers<Output> = {
      OK: <V extends Output = Output>(value: V) => [VALIDATION_OK, value],
      FAIL: (issue, ...args) => [VALIDATION_FAIL, issue, args[0]],
    }

    const validator: Joi.CustomValidator<Output> = (_value, _helpers) => {
      const [result, valueOrIssue, ctx] = fn(_value, helpers)
      if (result === VALIDATION_OK) return valueOrIssue
      else return _helpers.error(valueOrIssue, ctx)
    }

    return (options?.baseValidator ? options.baseValidator : ZJoi).custom(validator)
  }
}
