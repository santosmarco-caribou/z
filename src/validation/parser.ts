import type Joi from 'joi'

import { ZUtils } from '../utils'
import type { _ZOutput, _ZValidator, AnyZ } from '../z/z'
import { ZError } from './error'
import { Z_ISSUE_MAP } from './issue-map'

/* --------------------------------------------------- ParseResult -------------------------------------------------- */

export type ParseResultOk<Z extends AnyZ> = {
  value: _ZOutput<Z>
  error: null
}

export type ParseResultFail<Z extends AnyZ> = {
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

  /* ---------------------------------------------------- Checks ---------------------------------------------------- */

  addCheck(fn: (validator: _ZValidator<Z>) => _ZValidator<Z>): Z {
    this._z._validator = fn(this._z._validator)
    return this._z
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private _validate(input: unknown, options: ParseOptions | undefined): Joi.ValidationResult<_ZOutput<Z>> {
    return this._z._validator.validate(input, ZUtils.merge(DEFAULT_PARSE_OPTIONS, options))
  }

  private _OK(value: _ZOutput<Z>): ParseResultOk<Z> {
    return { value, error: null }
  }

  private _FAIL(joiError: Joi.ValidationError): ParseResultFail<Z> {
    return { error: ZError.create(this._z, joiError).toPlainObject(), value: null }
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <Z extends AnyZ>(z: Z): ZParser<Z> => {
    return new ZParser(z)
  }
}
