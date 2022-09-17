import Joi from 'joi'
import { cloneDeep } from 'lodash'
import type { O } from 'ts-toolbelt'
import type { Simplify } from 'type-fest'

import {
  _ZOutput,
  _ZSchema,
  AnyZIssueCode,
  BaseZ,
  ParseOptions,
  Z_ISSUE_MAP,
  ZDef,
  ZHooks,
  ZIssueLocalContext,
} from '../_internals'
import { EmptyObject, mergeSafe } from '../utils'

export const ZJoi = Joi.defaults(schema => schema.required())

/* ------------------------------------------------------------------------------------------------------------------ */

const VALIDATION_OK = Symbol('VALIDATION_OK')
const VALIDATION_FAIL = Symbol('VALIDATION_FAIL')

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                     ZValidator                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export const DEFAULT_VALIDATION_OPTIONS: Joi.ValidationOptions & Required<ParseOptions> = {
  abortEarly: false,
  messages: Z_ISSUE_MAP,
}

/* ----------------------------------------------------- Checks ----------------------------------------------------- */

export type ZCheckOptions<IssueCode extends AnyZIssueCode, Extras extends O.Object = EmptyObject> = Simplify<
  {
    message?: string | ((context: ZIssueLocalContext<IssueCode>) => string)
  } & Extras,
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

/* ------------------------------------------------------------------------------------------------------------------ */

export interface ZValidator<Def extends ZDef> extends BaseZ<Def>, ZHooks<Def> {}

export class ZValidator<Def extends ZDef> {
  protected _validate(input: unknown, options: ParseOptions | undefined): Joi.ValidationResult<_ZOutput<Def>> {
    const _opts = mergeSafe(DEFAULT_VALIDATION_OPTIONS, options ?? {})
    const _input = this.$_hooks.beforeParse.reduce((acc, hook) => hook.handler(acc), cloneDeep(input))
    const result = this.$_schema.validate(_input, _opts) as Joi.ValidationResult<_ZOutput<Def>>
    return this.$_hooks.afterParse.reduce(
      (acc, hook) => ({
        ...acc,
        value: acc.value ? hook.handler(acc.value) : undefined,
      }),
      cloneDeep(result)
    )
  }

  protected _addCheck(fn: (validator: _ZSchema<Def>) => _ZSchema<Def>): this
  protected _addCheck<IssueCode extends AnyZIssueCode>(
    issue: IssueCode,
    fn: (validator: _ZSchema<Def>) => _ZSchema<Def>,
    options: ZCheckOptions<IssueCode> | undefined
  ): this
  protected _addCheck<IssueCode extends AnyZIssueCode>(
    fnOrIssue: ((validator: _ZSchema<Def>) => _ZSchema<Def>) | IssueCode,
    fn?: (validator: _ZSchema<Def>) => _ZSchema<Def>,
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
    this.$_schema = this.$_schema.preferences(prefs) as _ZSchema<Def>
    return this
  }

  protected _updateValidator(fn: (v: _ZSchema<Def>) => Joi.Schema): this {
    this.$_schema = fn(this.$_schema) as _ZSchema<Def>
    return this
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static custom = <Output, BaseSchema extends Joi.Schema<Output>>(
    baseSchema: BaseSchema,
    fn: (value: unknown, helpers: CustomValidationHelpers<Output>) => CustomValidationResult
  ): BaseSchema => {
    const helpers: CustomValidationHelpers<Output> = {
      OK: <V extends Output = Output>(value: V) => [VALIDATION_OK, value],
      FAIL: (issue, ...args) => [VALIDATION_FAIL, issue, args[0]],
    }

    const validator: Joi.CustomValidator<Output> = (_value, _helpers) => {
      const [result, valueOrIssue, ctx] = fn(_value, helpers)
      if (result === VALIDATION_OK) return valueOrIssue
      else return _helpers.error(valueOrIssue, ctx)
    }

    return baseSchema.custom(validator) as BaseSchema
  }
}
