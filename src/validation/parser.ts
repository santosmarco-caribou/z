import type Joi from 'joi'

import { _ZOutput, BaseZ, Z, ZDef, ZError, ZHooks, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZParser                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

/* --------------------------------------------------- ParseResult -------------------------------------------------- */

export type ParseResultOk<V> = {
  ok: true
  value: V
  error: undefined
}

export type ParseResultFail<Def extends ZDef> = {
  ok: false
  value: undefined
  error: ReturnType<ZError<Def>['toPlainObject']>
}

export type ParseResult<V, Def extends ZDef> = ParseResultOk<V> | ParseResultFail<Def>

/* -------------------------------------------------- ParseOptions -------------------------------------------------- */

export type ParseOptions = {
  abortEarly?: boolean
}

/* ------------------------------------------------------------------------------------------------------------------ */

export interface ZParser<Def extends ZDef> extends BaseZ<Def>, ZValidator<Def>, ZHooks<Def> {}

export class ZParser<Def extends ZDef> {
  safeParse(input: unknown, options?: ParseOptions): ParseResult<_ZOutput<Def>, Def> {
    const { error, value } = this._validate(input, options)
    if (error) return this._FAIL(error)
    else return this._OK(value)
  }

  parse(input: unknown, options?: ParseOptions): _ZOutput<Def> {
    const { error, value } = this.safeParse(input, options)
    if (error) throw error
    else return value
  }

  safeParseAsync(input: unknown, options?: ParseOptions): Promise<ParseResult<_ZOutput<Def>, Def>> {
    return new Promise(resolve => resolve(this.safeParse(input, options)))
  }

  parseAsync(input: unknown, options?: ParseOptions): Promise<_ZOutput<Def>> {
    return new Promise((resolve, reject) => {
      const { error, value } = this.safeParse(input, options)
      if (error) reject(error)
      else resolve(value)
    })
  }

  isValid(input: unknown, options?: ParseOptions): input is _ZOutput<Def> {
    return this.safeParse(input, options).ok
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private _OK(value: _ZOutput<Def>): ParseResultOk<_ZOutput<Def>> {
    return { ok: true, value, error: undefined }
  }

  private _FAIL(error: Joi.ValidationError): ParseResultFail<Def> {
    return {
      ok: false,
      error: ZError.create(this as unknown as Z<Def>, error).toPlainObject(),
      value: undefined,
    }
  }
}
