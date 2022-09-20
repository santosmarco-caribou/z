import Joi from 'joi'
import type { Merge } from 'type-fest'

import type { ZDef, ZIssueCode, ZIssueContext, ZIssueMap } from '../_internals'
import { GlobalZIssueMap } from './issue-map'

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

export type ZCheckNotOkResultHelperFn<
  Def extends ZDef,
  ValidationStatus extends typeof CHECK_FAIL | typeof CHECK_WARN =
    | typeof CHECK_FAIL
    | typeof CHECK_WARN
> = <I extends Extract<keyof GlobalZIssueMap, `${Def['TypeName']}.${string}`>>(
  issue: I,
  context: ZIssueContext<Extract<GlobalZIssueMap[I], string>, { Extras: true }>
) => [
  ValidationStatus,
  I,
  ZIssueContext<Extract<GlobalZIssueMap[I], string>, { Extras: true }>
]

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
