import type Joi from 'joi'

import type { ZUtils } from '../utils'
import type { AnyZ } from '../z/z'
import type { ZIssueCode } from './issue-map'

/* ----------------------------------------------------- ZIssue ----------------------------------------------------- */

export type ZIssue<Z extends AnyZ> = {
  code: ZIssueCode<Z>
  message: string
  path: Array<string | number>
  received: any
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZError                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZError<Z extends AnyZ> extends Error {
  override readonly name: 'ZError'
  override readonly message: string

  readonly typeDef: string
  readonly issues: ReadonlyArray<ZIssue<Z>>

  private constructor(_z: Z, private readonly _original: Joi.ValidationError) {
    super()
    this.name = 'ZError'
    this.message = _original.message
    this.typeDef = _z.name
    this.issues = _original.details.map(({ type, message, path, context }) => ({
      code: type as ZIssueCode<Z>,
      message: message,
      path: path,
      received: context?.value,
    }))
  }

  annotate(): string {
    return this._original.annotate()
  }

  toPlainObject(): ZUtils.OmitInternals<Omit<ZError<Z>, 'toPlainObject'>> {
    return {
      name: this.name,
      message: this.message,
      typeDef: this.typeDef,
      issues: this.issues,
      annotate: () => this.annotate(),
    }
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create<Z extends AnyZ>(z: Z, original: Joi.ValidationError): ZError<Z> {
    return new ZError(z, original)
  }
}
