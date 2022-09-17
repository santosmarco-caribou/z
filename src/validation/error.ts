import type Joi from 'joi'
import { omit } from 'lodash'
import type { Simplify } from 'type-fest'
import util from 'util'

import type { _ZOutput, _ZSchema, Z, ZDef, ZIssueCode, ZManifestObject, ZType } from '../_internals'
import type { OmitInternals } from '../utils'

/* ----------------------------------------------------- ZIssue ----------------------------------------------------- */

export type ZIssue<Def extends ZDef> = {
  code: Simplify<ZIssueCode<_ZSchema<Def>>>
  message: string
  path: Array<string | number>
  received: any
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZError                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZError<Def extends ZDef> extends Error {
  override readonly name: 'ZError'
  override readonly message: string

  readonly issues: ReadonlyArray<ZIssue<Def>>

  readonly typeName: ZType
  readonly typeHint: string
  readonly typeManifest: ZManifestObject<_ZOutput<Def>>

  private constructor(_z: Z<Def>, private readonly _original: Joi.ValidationError) {
    super()

    this.name = 'ZError'
    this.message = _original.message

    this.issues = _original.details.map(({ type, message, path, context }) => ({
      code: type as ZIssueCode<_ZSchema<Def>>,
      message: message,
      path: path,
      received: context?.value,
    }))

    this.typeName = _z.name
    this.typeHint = _z.hint
    this.typeManifest = _z.manifest
  }

  annotate(): string {
    return this._original.annotate()
  }

  toPlainObject(): OmitInternals<Omit<ZError<Def>, 'toPlainObject'> & { toString(): string }> {
    return {
      name: this.name,
      message: this.message,
      issues: this.issues,
      typeName: this.typeName,
      typeHint: this.typeHint,
      typeManifest: this.typeManifest,
      annotate: () => this.annotate(),
      toString: () =>
        util.inspect(omit(this.toPlainObject(), 'toString'), {
          colors: true,
          depth: Infinity,
        }),
    }
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <Def extends ZDef>(z: Z<Def>, original: Joi.ValidationError): ZError<Def> => new ZError(z, original)
}
