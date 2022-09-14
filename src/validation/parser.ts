import type Joi from 'joi'

import { AnyZDef, BaseZ, Z, ZError, ZHooks, ZOutput, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZParser                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

/* --------------------------------------------------- ParseResult -------------------------------------------------- */

export type ParseResultOk<V> = {
  ok: true
  value: V
  error: undefined
}

export type ParseResultFail<Def extends AnyZDef> = {
  ok: false
  value: undefined
  error: ReturnType<ZError<Def>['toPlainObject']>
}

export type ParseResult<V, Def extends AnyZDef> = ParseResultOk<V> | ParseResultFail<Def>

/* -------------------------------------------------- ParseOptions -------------------------------------------------- */

export type ParseOptions = {
  abortEarly?: boolean
}

/* ------------------------------------------------------------------------------------------------------------------ */

export interface ZParser<Def extends AnyZDef> extends BaseZ<Def>, ZValidator<Def>, ZHooks<Def> {}

export class ZParser<Def extends AnyZDef> {
  safeParse(input: unknown, options?: ParseOptions): ParseResult<ZOutput<this>, Def> {
    const { error, value } = this._validate(input, options)
    if (error) return this._FAIL(error)
    else return this._OK(value)
  }

  parse(input: unknown, options?: ParseOptions): ZOutput<this> {
    const { error, value } = this.safeParse(input, options)
    if (error) throw error
    else return value
  }

  safeParseAsync(input: unknown, options?: ParseOptions): Promise<ParseResult<ZOutput<this>, Def>> {
    return new Promise(resolve => resolve(this.safeParse(input, options)))
  }

  parseAsync(input: unknown, options?: ParseOptions): Promise<ZOutput<this>> {
    return new Promise((resolve, reject) => {
      const { error, value } = this.safeParse(input, options)
      if (error) reject(error)
      else resolve(value)
    })
  }

  isValid(input: unknown, options?: ParseOptions): input is ZOutput<this> {
    return this.safeParse(input, options).ok
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private _OK(value: ZOutput<this>): ParseResultOk<ZOutput<this>> {
    return { ok: true, value, error: undefined }
  }

  private _FAIL(error: Joi.ValidationError): ParseResultFail<Def> {
    return { ok: false, error: ZError.create(this as unknown as Z<Def>, error).toPlainObject(), value: undefined }
  }
}
