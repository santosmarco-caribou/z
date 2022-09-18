import Joi from 'joi'
import { isArray } from 'lodash'

import { type AnyZIssueCode, type ZIssueLocalContext, ZError, ZJoi } from '../_internals'
import { ZType } from '../types'
import type { IsEmptyObject } from '../utils'
import { Z } from './base'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZCustom                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

const CUSTOM_VALIDATION_OK = Symbol('CUSTOM_VALIDATION_OK')
const CUSTOM_VALIDATION_FAIL = Symbol('CUSTOM_VALIDATION_FAIL')

/* ------------------------------------------------------------------------------------------------------------------ */

export type CustomValidationOk<Out> = Out | [typeof CUSTOM_VALIDATION_OK, Out]
export type CustomValidationFail =
  | undefined
  | ZError
  | [typeof CUSTOM_VALIDATION_FAIL, AnyZIssueCode, Omit<ZIssueLocalContext<AnyZIssueCode>, 'label'>]
export type CustomValidationResult<Out> = CustomValidationOk<Out> | CustomValidationFail

export type CustomValidationHelpers<Out> = {
  OK(value: Out): [typeof CUSTOM_VALIDATION_OK, Out]
  FAIL<IssueCode extends AnyZIssueCode>(
    issue: IssueCode,
    ...args: IsEmptyObject<Omit<ZIssueLocalContext<IssueCode>, 'label'>> extends true
      ? never[]
      : [Omit<ZIssueLocalContext<IssueCode>, 'label'>]
  ): [typeof CUSTOM_VALIDATION_FAIL, IssueCode, Omit<ZIssueLocalContext<IssueCode>, 'label'>]
}

/* ------------------------------------------------------------------------------------------------------------------ */

export class ZCustom<Output, Input = unknown> extends Z<{
  Output: Output
  Input: Input
  Schema: Joi.AnySchema
}> {
  readonly name = ZType.Custom
  protected readonly _hint = 'Custom'

  /* ------------------------------------------------------------------------------------------------------------------ */

  static create = <Output, Input = unknown>(
    validate: (value: Input, helpers: CustomValidationHelpers<Output>) => CustomValidationResult<Output>
  ): ZCustom<Output, Input> => {
    const validationHelpers: CustomValidationHelpers<Output> = {
      OK: value => [CUSTOM_VALIDATION_OK, value],
      FAIL: (issue, ...args) => [CUSTOM_VALIDATION_FAIL, issue, args[0]],
    }

    return new ZCustom(
      {
        schema: ZJoi.any().custom((value, _helpers) => {
          const result = validate(value as Input, validationHelpers)

          if (result === undefined) {
            return undefined
          }
          if (ZError.isZError(result)) {
            return result._original
          }
          if (isArray(result) && result[0] === CUSTOM_VALIDATION_FAIL) {
            return _helpers.error(result[1], result[2])
          }

          if (isArray(result) && result[0] === CUSTOM_VALIDATION_OK) {
            return result[1]
          }
          return result
        }),
        manifest: {},
        hooks: {},
      },
      {}
    )
  }
}
