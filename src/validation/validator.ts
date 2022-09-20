import Joi from 'joi'
import { omit } from 'lodash'
import type { HasRequiredKeys, Merge, SetOptional } from 'type-fest'

import type { ZDef, ZIssueCode, ZIssueContext } from '../_internals'

/* -------------------------------------------------------------------------- */
/*                                    ZJoi                                    */
/* -------------------------------------------------------------------------- */

// Make all Joi schemas required by default
export const ZJoi = Joi.defaults(schema => schema.required())

/* -------------------------------------------------------------------------- */
/*                                   ZCheck                                   */
/* -------------------------------------------------------------------------- */

export const CHECK_OK = Symbol('CHECK_OK')
export const CHECK_FAIL = Symbol('CHECK_FAIL')
export const CHECK_WARN = Symbol('CHECK_WARN')

/* ----------------------------- Result helpers ----------------------------- */

export type ZCheckOkResultHelperFn<Def extends ZDef> = (
  value: Def['Output']
) => [typeof CHECK_OK, Def['Output']]

type _ZCheckNotOkResultCtx<I extends ZIssueCode> = SetOptional<
  ZIssueContext<I, { Extras: true }>,
  'label' | 'value'
>
type _ZCheckNotOkResultArgs<I extends ZIssueCode> = HasRequiredKeys<
  _ZCheckNotOkResultCtx<I>
> extends true
  ? [context: _ZCheckNotOkResultCtx<I>]
  : [context?: _ZCheckNotOkResultCtx<I>]

export type ZCheckNotOkResultHelperFn<
  Def extends ZDef,
  ValidationStatus extends typeof CHECK_FAIL | typeof CHECK_WARN =
    | typeof CHECK_FAIL
    | typeof CHECK_WARN
> = <I extends ZIssueCode<Def['TypeName']>>(
  issue: I,
  ...args: _ZCheckNotOkResultArgs<I>
) => [ValidationStatus, I, ZIssueContext<I, { Extras: true }>]

export type ZCheckResultHelperFns<Def extends ZDef> = {
  OK: ZCheckOkResultHelperFn<Def>
  FAIL: ZCheckNotOkResultHelperFn<Def, typeof CHECK_FAIL>
  WARN: ZCheckNotOkResultHelperFn<Def, typeof CHECK_WARN>
}

export type ZCheckResult<Def extends ZDef> = ReturnType<
  ZCheckOkResultHelperFn<Def> | ZCheckNotOkResultHelperFn<Def>
>

/* -------------------------------------------------------------------------- */

export type ZCheckHelpers<Def extends ZDef> = Merge<
  Omit<Joi.CustomHelpers, 'error' | 'warn'>,
  ZCheckResultHelperFns<Def>
>

export type ZCheckFn<Def extends ZDef> = (
  value: unknown,
  helpers: ZCheckHelpers<Def>
) => ZCheckResult<Def>

export type ZCheck<Def extends ZDef> = {
  name?: string
  description?: string
  validate: ZCheckFn<Def>
}

/* -------------------------------------------------------------------------- */

export const createZCheckHelpers = <Def extends ZDef>(
  originalHelpers: Omit<Joi.CustomHelpers, 'error' | 'warn'>
): ZCheckHelpers<Def> => ({
  ...originalHelpers,
  OK: value => [CHECK_OK, value],
  FAIL: (issue, context) => [CHECK_FAIL, issue, context],
  WARN: (issue, context) => [CHECK_WARN, issue, context],
})

/* -------------------------------------------------------------------------- */
/*                                 ZValidator                                 */
/* -------------------------------------------------------------------------- */

export type ZValidatorInternals<Def extends ZDef> = {
  readonly checks: readonly ZCheck<Def>[]
}

export class ZValidator<
  Def extends ZDef,
  _Internals extends ZValidatorInternals<Def>
> {
  private constructor(
    private readonly _schema: Joi.Schema,
    private readonly _internals: _Internals
  ) {}

  addChecks<Checks extends readonly [ZCheck<Def>, ...ZCheck<Def>[]]>(
    ...checks: Checks
  ): ZValidator<
    Def,
    Omit<_Internals, 'checks'> & {
      checks: [..._Internals['checks'], ...Checks]
    }
  > {
    const _checks = checks

    const newSchema = _checks.reduce(
      (schemaAcc, check) =>
        schemaAcc.custom(
          (_value, _helpers) => {
            const zHelpers = createZCheckHelpers<Def>(
              omit(_helpers, 'error', 'warn')
            )

            const [status, valueOrIssueCode, issueCtx] = check.validate(
              _value,
              zHelpers
            )

            switch (status) {
              case CHECK_OK:
                return valueOrIssueCode
              case CHECK_FAIL:
                return _helpers.error(valueOrIssueCode, issueCtx)
              case CHECK_WARN:
                return _helpers.warn(valueOrIssueCode, issueCtx)
            }
          },
          check.description
            ? `${check.name ? `${check.name}: ` : ''}${check.description}`
            : check.name
            ? check.name
            : undefined
        ),

      this._schema
    )

    const newChecks = [...this._internals.checks, ..._checks] as [
      ..._Internals['checks'],
      ...Checks
    ]

    return new ZValidator(newSchema, { ...this._internals, checks: newChecks })
  }

  /* ------------------------------------------------------------------------ */

  static create = <Def extends ZDef>(
    schema: Joi.Schema
  ): ZValidator<Def, { checks: [] }> => new ZValidator(schema, { checks: [] })
}
