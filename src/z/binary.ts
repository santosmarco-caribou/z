import type Joi from 'joi'
import { Finite, NonNegativeInteger } from 'type-fest'

import { Z, ZCheckOptions, ZJoi, ZType } from '../_internals'

/* -------------------------------------------------------------------------- */
/*                                   ZBinary                                  */
/* -------------------------------------------------------------------------- */

export class ZBinary extends Z<{
  Output: Buffer
  Input: Buffer
  Schema: Joi.BinarySchema
}> {
  readonly name = ZType.Binary
  protected readonly _hint = 'Buffer'

  /**
   * Sets the string encoding format if a string input is converted to a Buffer.
   *
   * @param encoding - The encoding format.
   */
  encoding(encoding: string): this {
    return this._addCheck(v => v.encoding(encoding))
  }

  /**
   * Specifies the minimum length of the Buffer.
   *
   * @param min - The minimum length of the Buffer.
   * @param {ZCheckOptions<'binary.min'>} [options] - Options for this rule.
   */
  min<T extends number>(
    min: Finite<NonNegativeInteger<T>>,
    options?: ZCheckOptions<'binary.min'>
  ): this {
    return this._addCheck('binary.min', v => v.min(min), options)
  }
  /**
   * Specifies the maximum length of the Buffer.
   *
   * @param max - The maximum length of the Buffer.
   * @param {ZCheckOptions<'binary.max'>} [options] - Options for this rule.
   */
  max<T extends number>(
    max: Finite<NonNegativeInteger<T>>,
    options?: ZCheckOptions<'binary.max'>
  ): this {
    return this._addCheck('binary.max', v => v.max(max), options)
  }
  /**
   * Specifies the exact length of the Buffer.
   *
   * @param length - The length of the Buffer.
   * @param {ZCheckOptions<'binary.length'>} [options] - Options for this rule.
   */
  length<T extends number>(
    length: Finite<NonNegativeInteger<T>>,
    options?: ZCheckOptions<'binary.length'>
  ): this {
    return this._addCheck('binary.length', v => v.length(length), options)
  }

  /* ------------------------------------------------------------------------ */

  static create = () =>
    new ZBinary(
      {
        schema: ZJoi.binary(),
        manifest: {},
        hooks: {},
      },
      {}
    )
}
