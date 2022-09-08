import type Joi from 'joi'

import { ZUtils } from '../utils'
import type { _ZOutput, _ZValidator, AnyZ } from '../z/z'
import { ZError } from './error'
import { Z_ISSUE_MAP, ZIssueCode, ZIssueLocalContext } from './issue-map'

/* --------------------------------------------------- ParseResult -------------------------------------------------- */

export type ParseResultOk<Z extends AnyZ> = {
  ok: true
  value: _ZOutput<Z>
  error: null
}

export type ParseResultFail<Z extends AnyZ> = {
  ok: false
  error: ReturnType<ZError<Z>['toPlainObject']>
  value: null
}

export type ParseResult<Z extends AnyZ> = ParseResultOk<Z> | ParseResultFail<Z>

/* -------------------------------------------------- ParseOptions -------------------------------------------------- */

export type ParseOptions = {
  abortEarly?: boolean
}

const DEFAULT_PARSE_OPTIONS: Joi.ValidationOptions & ZUtils.RequiredDeep<ParseOptions> = {
  abortEarly: false,
  messages: Z_ISSUE_MAP,
}

/* -------------------------------------------------- Check options ------------------------------------------------- */

export type ZCheckOptions<IssueCode extends ZIssueCode> = {
  message?:
    | string
    | (ZIssueLocalContext<IssueCode, { Extras: true }> extends Record<PropertyKey, never>
        ? never
        : (availableCtxTags: ZIssueLocalContext<IssueCode, { Extras: true }>) => string)
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZParser                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZParser<Z extends AnyZ> {
  private constructor(private readonly _z: Z) {}

  /* ---------------------------------------------------- Parsing --------------------------------------------------- */

  safeParse(input: unknown, options: ParseOptions | undefined): ParseResult<Z> {
    const { error, value } = this._validate(input, options)
    if (error) return this._FAIL(error)
    else return this._OK(value)
  }

  parse(input: unknown, options: ParseOptions | undefined): _ZOutput<Z> {
    const { error, value } = this._validate(input, options)
    if (error) throw ZError.create(this._z, error)
    else return value
  }

  parseAsync(input: unknown, options: ParseOptions | undefined): Promise<_ZOutput<Z>> {
    return new Promise((resolve, reject) => {
      const { error, value } = this._validate(input, options)
      if (error) reject(ZError.create(this._z, error))
      else resolve(value)
    })
  }

  isValid(input: unknown, options: ParseOptions | undefined): input is _ZOutput<Z> {
    return !this._validate(input, options).error
  }

  /* ---------------------------------------------------- Checks ---------------------------------------------------- */

  addCheck<IssueCode extends ZIssueCode<Z> = ZIssueCode<Z>>(
    issue: IssueCode,
    fn: (validator: _ZValidator<Z>) => _ZValidator<Z>,
    options: ZCheckOptions<IssueCode> | undefined
  ): Z {
    console.log({ issue, fn, options })

    this._z._validator = fn(this._z._validator)

    if (options?.message) {
      const ctxTags = [
        ...[...Z_ISSUE_MAP[issue].matchAll(/{{#[^}]*}}/g)].map(m => m[0].slice(3, -2)),
        'key',
        'value',
      ] as ZIssueLocalContext<IssueCode, { Extras: true }>[keyof ZIssueLocalContext<IssueCode, { Extras: true }>][]

      const msgStr =
        typeof options.message === 'string'
          ? options.message
          : options.message(Object.fromEntries(ctxTags.map(tag => [tag, `{{#${tag}}}`])))
      this._z._validator = this._z._validator.message(msgStr)
    }

    return this._z
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private _validate(input: unknown, options: ParseOptions | undefined): Joi.ValidationResult<_ZOutput<Z>> {
    return this._z._validator.validate(input, ZUtils.merge(DEFAULT_PARSE_OPTIONS, options))
  }

  private _OK(value: _ZOutput<Z>): ParseResultOk<Z> {
    return { ok: true, value, error: null }
  }

  private _FAIL(joiError: Joi.ValidationError): ParseResultFail<Z> {
    return { ok: false, error: ZError.create(this._z, joiError).toPlainObject(), value: null }
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <Z extends AnyZ>(z: Z): ZParser<Z> => new ZParser(z)
}
