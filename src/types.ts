import type Joi from 'joi'
import type { O } from 'ts-toolbelt'

import type { ZError } from './validation/error'
import { type ZIssueLocalContext, AnyZIssueCode, Z_ISSUE_MAP } from './validation/issue-map'
import type { _ZOutput, _ZValidator, AnyZ } from './z/z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZParser                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

/* --------------------------------------------------- ParseResult -------------------------------------------------- */

export type ParseResultOk<Z extends AnyZ> = {
  ok: true
  value: _ZOutput<Z>
  error: null
}

export type ParseResultFail<Z extends AnyZ> = {
  ok: false
  value: null
  error: ReturnType<ZError<Z>['toPlainObject']>
}

export type ParseResult<Z extends AnyZ> = ParseResultOk<Z> | ParseResultFail<Z>

/* -------------------------------------------------- ParseOptions -------------------------------------------------- */

export type ParseOptions = {
  abortEarly?: boolean
}

export const DEFAULT_PARSE_OPTIONS: Joi.ValidationOptions & O.Required<ParseOptions, PropertyKey, 'deep'> = {
  abortEarly: false,
  messages: Z_ISSUE_MAP,
}

/* -------------------------------------------------- CheckOptions -------------------------------------------------- */

export type ZCheckOptions<IssueCode extends AnyZIssueCode> = {
  message?:
    | string
    | (ZIssueLocalContext<IssueCode, { Extras: true }> extends Record<PropertyKey, never>
        ? never
        : (availableCtxTags: ZIssueLocalContext<IssueCode, { Extras: true }>) => string)
}

/* ------------------------------------------------------------------------------------------------------------------ */

export interface ZParserParsingMethods<Z extends AnyZ> {
  safeParse(input: unknown, options: ParseOptions | undefined): ParseResult<Z>
  parse(input: unknown, options: ParseOptions | undefined): _ZOutput<Z>
  parseAsync(input: unknown, options: ParseOptions | undefined): Promise<_ZOutput<Z>>
  isValid(input: unknown, options: ParseOptions | undefined): input is _ZOutput<Z>
}

export interface ZParserChecksAndValidationMethods<Z extends AnyZ> {
  addCheck(fn: (validator: _ZValidator<Z>) => _ZValidator<Z>): Z
  addCheck<IssueCode extends AnyZIssueCode>(
    issue: IssueCode,
    fn: (validator: _ZValidator<Z>) => _ZValidator<Z>,
    options: ZCheckOptions<IssueCode> | undefined
  ): Z
}
