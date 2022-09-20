import Joi from 'joi'
import { omit } from 'lodash'

import {
  type ZCheck,
  type ZDef,
  CHECK_FAIL,
  CHECK_OK,
  CHECK_WARN,
  createZCheckHelpers,
} from '../_internals'

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
        schemaAcc.custom((_value, _helpers) => {
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
        }, `${check.name ? `${check.name}: ` : ''}${check.description}`),

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
