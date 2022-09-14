import type Joi from 'joi'

import { Z, ZCheckOptions, ZDef, ZSchema, ZType, ZValidator } from '../_internals'

export class ZBinary extends Z<ZDef<{ Output: Buffer; Validator: ZSchema<Joi.BinarySchema> }>> {
  readonly name = ZType.Binary
  protected readonly _hint = 'Buffer'

  /**
   * Sets the string encoding format if a string input is converted to a buffer.
   *
   * @param encoding - The encoding format.
   */
  encoding(encoding: string): this {
    return this._addCheck(v => v.encoding(encoding))
  }

  /**
   * Specifies the minimum length of the buffer.
   *
   * @param min - The minimum length of the buffer.
   */
  min(min: number, options?: ZCheckOptions<'binary.min'>): this {
    return this._addCheck('binary.min', v => v.min(min), options)
  }
  /**
   * Specifies the maximum length of the buffer.
   *
   * @param max - The maximum length of the buffer.
   */
  max(max: number, options?: ZCheckOptions<'binary.max'>): this {
    return this._addCheck('binary.max', v => v.max(max), options)
  }
  /**
   * Specifies the exact length of the buffer.
   *
   * @param length - The length of the buffer.
   */
  length(length: number, options?: ZCheckOptions<'binary.length'>): this {
    return this._addCheck('binary.length', v => v.length(length), options)
  }

  static create = () => new ZBinary({ validator: ZValidator.binary(), hooks: {} }, {})
}
