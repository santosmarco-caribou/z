import type Joi from 'joi'
import { omit } from 'lodash'
import type { Simplify } from 'type-fest'
import util from 'util'

import type {
  _ZOutput,
  Z,
  ZDef,
  ZIssueCode,
  ZManifestObject,
  ZType,
} from '../_internals'
import type { OmitInternals } from '../utils'

/* --------------------------------- ZIssue --------------------------------- */

export type ZIssueContext = {
  label: string
  key?: string
  [x: string]: any
}

export type ZIssue<Def extends ZDef = ZDef> = {
  code: Simplify<ZIssueCode<Def['Schema']>>
  message: string
  path: Array<string | number>
  received: any
  context: ZIssueContext
}

/* -------------------------------------------------------------------------- */
/*                                   ZError                                   */
/* -------------------------------------------------------------------------- */

export class ZError<Def extends ZDef = ZDef> extends Error {
  override readonly name: 'ZError'
  override readonly message: string

  readonly issues: ReadonlyArray<ZIssue<Def>>

  readonly typeName: ZType
  readonly typeHint: string
  readonly typeManifest: ZManifestObject<_ZOutput<Def>>

  private constructor(_z: Z<Def>, readonly _original: Joi.ValidationError) {
    super()

    this.name = 'ZError'
    this.message = _original.message

    this.issues = _original.details.map(({ type, message, path, context }) => ({
      code: type as ZIssueCode<Def['Schema']>,
      message: message,
      path: path,
      received: context?.value,
      context: {
        ...omit(context, 'value'),
        label: context?.label ?? 'value',
      },
    }))

    this.typeName = _z.name
    this.typeHint = _z.hint
    this.typeManifest = _z.manifest
  }

  annotate(): string {
    return this._original.annotate()
  }

  toPlainObject(): OmitInternals<
    Omit<ZError<Def>, 'toPlainObject'> & { toString(): string }
  > {
    return {
      name: this.name,
      message: this.message,
      issues: this.issues,
      typeName: this.typeName,
      typeHint: this.typeHint,
      typeManifest: this.typeManifest,
      annotate: () => this.annotate(),
      toString: () =>
        util.inspect(omit(this.toPlainObject(), 'annotate', 'toString'), {
          colors: true,
          depth: Infinity,
        }),
    }
  }

  /* ------------------------------------------------------------------------ */

  static create = <Def extends ZDef>(
    z: Z<Def>,
    original: Joi.ValidationError
  ): ZError<Def> => new ZError(z, original)

  static isZError = (maybeZError: unknown): maybeZError is ZError =>
    maybeZError instanceof ZError
}
