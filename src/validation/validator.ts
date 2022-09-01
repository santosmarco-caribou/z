import type Joi from 'joi'

import type { ZIssueCode, ZIssueLocalContext } from './issue-map'

const VALIDATION_OK = Symbol('VALIDATION_OK')
const VALIDATION_FAIL = Symbol('VALIDATION_FAIL')

/* ------------------------------------------------ Custom validation ----------------------------------------------- */

export type CustomValidationHelpers<V extends Joi.Schema> = {
  OK(): [typeof VALIDATION_OK]
  FAIL<T extends ZIssueCode<V>, Ctx extends Partial<ZIssueLocalContext<T>>>(
    issue: T,
    context?: Ctx
  ): [typeof VALIDATION_FAIL, T, Ctx | undefined]
}

export type CustomValidationResult<V extends Joi.Schema> = ReturnType<
  CustomValidationHelpers<V>[keyof CustomValidationHelpers<V>]
>

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                     ZValidator                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZValidator {
  static custom = <V extends Joi.Schema>(
    baseValidator: V,
    handler: (value: any, helpers: CustomValidationHelpers<V>) => CustomValidationResult<V>
  ): V => {
    const helpers: CustomValidationHelpers<V> = {
      OK: () => [VALIDATION_OK],
      FAIL: (issue, ctx) => [VALIDATION_FAIL, issue, ctx],
    }

    return baseValidator.custom((_value, _helpers) => {
      const [result, issue, issueCtx] = handler(_value, helpers)
      if (result === VALIDATION_OK) return _value
      else return _helpers.error(issue, issueCtx)
    }) as V
  }
}
