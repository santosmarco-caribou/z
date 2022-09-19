import Joi from 'joi'
import { merge } from 'lodash'
import type { O } from 'ts-toolbelt'
import type { Simplify } from 'type-fest'

import {
  AnyZIssueCode,
  BaseZ,
  Z_ISSUE_MAP,
  ZDef,
  ZIssueLocalContext,
} from '../_internals'
import { EmptyObject, IsEmptyObject } from '../utils'

/* ---------------------------------- ZJoi ---------------------------------- */

export const ZJoi = merge(
  Joi.defaults(schema => schema.required()),
  {
    undefined: () =>
      Joi.custom((value, helpers) =>
        value === undefined
          ? value
          : helpers.error('any.only', { valids: ['undefined'] })
      ),
  }
)

/* -------------------------------------------------------------------------- */

const VALIDATION_OK = Symbol('VALIDATION_OK')
const VALIDATION_FAIL = Symbol('VALIDATION_FAIL')

/* -------------------------------------------------------------------------- */
/*                                 ZValidator                                 */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Checks --------------------------------- */

export type ZCheckOptions<
  IssueCode extends AnyZIssueCode,
  Extras extends O.Object = EmptyObject
> = Simplify<
  {
    message?:
      | string
      | ((context: ZIssueLocalContext<IssueCode, { Extras: true }>) => string)
  } & Extras,
  { deep: true }
>

/* ---------------------------- Custom validation --------------------------- */

type CustomValidationHelpers<Output, Schema extends Joi.Schema> = {
  schema: Schema
  OK<V extends Output = Output>(value: V): [typeof VALIDATION_OK, V]
  FAIL<IssueCode extends AnyZIssueCode>(
    issue: IssueCode,
    ...args: IsEmptyObject<
      Omit<ZIssueLocalContext<IssueCode>, 'label'>
    > extends true
      ? never[]
      : [Omit<ZIssueLocalContext<IssueCode>, 'label'>]
  ): [
    typeof VALIDATION_FAIL,
    IssueCode,
    Omit<ZIssueLocalContext<IssueCode>, 'label'>
  ]
}

type CustomValidationResult =
  | [typeof VALIDATION_OK, any]
  | [typeof VALIDATION_FAIL, AnyZIssueCode, Record<string, any>]

/* -------------------------------------------------------------------------- */

export interface ZValidator<Def extends ZDef> extends BaseZ<Def> {}

export class ZValidator<Def extends ZDef> {
  protected _addCheck(fn: (validator: Def['Schema']) => Def['Schema']): this
  protected _addCheck<IssueCode extends AnyZIssueCode>(
    issue: IssueCode,
    fn: (validator: Def['Schema']) => Def['Schema'],
    options: ZCheckOptions<IssueCode> | undefined
  ): this
  protected _addCheck<IssueCode extends AnyZIssueCode>(
    fnOrIssue: ((validator: Def['Schema']) => Def['Schema']) | IssueCode,
    fn?: (validator: Def['Schema']) => Def['Schema'],
    options?: ZCheckOptions<IssueCode> | undefined
  ): this {
    if (typeof fnOrIssue === 'function') {
      this._schema.update(fnOrIssue)
      return this
    }

    fn && this._schema.update(fn)

    if (options?.message) {
      const ctxTags = [
        ...[...Z_ISSUE_MAP[fnOrIssue].matchAll(/{{#[^}]*}}/g)].map(m =>
          m[0]?.slice(3, -2)
        ),
        'key',
        'value',
      ] as ZIssueLocalContext<
        IssueCode,
        { Extras: true }
      >[keyof ZIssueLocalContext<IssueCode, { Extras: true }>][]

      const msgStr =
        typeof options.message === 'string'
          ? options.message
          : options.message(
              Object.fromEntries(
                ctxTags.map(tag => [tag, `{{#${tag as string}}}`])
              ) as ZIssueLocalContext<IssueCode, { Extras: true }>
            )

      this._schema.update(v => v.message(msgStr))
    }
    return this
  }

  /* ------------------------------------------------------------------------ */

  static custom = <Output, BaseSchema extends Joi.Schema<Output>>(
    baseSchema: BaseSchema,
    fn: (
      value: unknown,
      helpers: CustomValidationHelpers<Output, BaseSchema>
    ) => CustomValidationResult
  ): BaseSchema => {
    const validator: Joi.CustomValidator<Output> = (_value, _helpers) => {
      const helpers: CustomValidationHelpers<Output, BaseSchema> = {
        schema: _helpers.schema as BaseSchema,
        OK: <V extends Output = Output>(value: V) => [VALIDATION_OK, value],
        FAIL: (issue, ...args) => [VALIDATION_FAIL, issue, args[0]],
      }

      const [result, valueOrIssue, ctx] = fn(_value, helpers)
      if (result === VALIDATION_OK) return valueOrIssue
      else return _helpers.error(valueOrIssue, ctx)
    }

    return baseSchema.custom(validator) as BaseSchema
  }
}
