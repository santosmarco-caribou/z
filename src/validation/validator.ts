import type Joi from 'joi'

import type { ZUtils } from '../utils'
import type { ZIssueCode, ZIssueLocalContext } from './issue-map'

const VALIDATION_OK = Symbol('VALIDATION_OK')
const VALIDATION_FAIL = Symbol('VALIDATION_FAIL')

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
  static custom = <T, V extends Joi.Schema>(
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
