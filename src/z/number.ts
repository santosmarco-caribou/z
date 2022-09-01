import Joi from 'joi'

import type { ZDef } from '../def'
import { ZType } from '../type'
import { Z } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZNumber                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZNumberDef = ZDef<{ validator: Joi.NumberSchema }>

export class ZNumber extends Z<number, ZNumberDef> {
  readonly name = ZType.Number
  readonly hint = 'number'

  /**
   * Requires the number to be an integer (no floating point).
   */
  integer(): this {
    return this._parser.addCheck(v => v.integer())
  }
  /**
   * {@inheritDoc ZNumber#integer}
   */
  int(): this {
    return this.integer()
  }

  /**
   * Requires the number to have a maximum precision, i.e., a maximum number of decimal places.
   *
   * @param {number} precision The maximum number of decimal places allowed.
   */
  precision(precision: number): this {
    return this._parser.addCheck(v => v.precision(precision))
  }

  /**
   * Requires the number to be positive.
   */
  positive(): this {
    return this._parser.addCheck(v => v.positive())
  }

  /**
   * Requires the number to be less than or equal to 0.
   */
  nonpositive(): this {
    return this.max(0)
  }

  /**
   * Requires the number to be negative.
   */
  negative(): this {
    return this._parser.addCheck(v => v.negative())
  }

  /**
   * Requires the number to be greater than or equal to 0.
   */
  nonnegative(): this {
    return this.min(0)
  }

  /**
   * Requires the number to be greater than or equal to a certain value.
   *
   * @param {number} value The minimum value allowed.
   */
  min(value: number): this {
    return this._parser.addCheck(v => v.min(value))
  }
  /**
   * {@inheritDoc ZNumber#min}
   */
  gte(value: number): this {
    return this.min(value)
  }

  /**
   * Requires the number to be greater than (but not equal to) a certain value.
   *
   * @param {number} value The minimum value allowed (exclusive).
   */
  greater(value: number): this {
    return this._parser.addCheck(v => v.greater(value))
  }
  /**
   * {@inheritDoc ZNumber#greater}
   */
  gt(value: number): this {
    return this.greater(value)
  }

  /**
   * Requires the number to be less than or equal to a certain value.
   *
   * @param {number} value The maximum value allowed.
   */
  max(value: number): this {
    return this._parser.addCheck(v => v.max(value))
  }
  /**
   * {@inheritDoc ZNumber#max}
   */
  lte(value: number): this {
    return this.max(value)
  }

  /**
   * Requires the number to be less than (but not equal to) a certain value.
   *
   * @param {number} value The maximum value allowed (exclusive).
   */
  less(value: number): this {
    return this._parser.addCheck(v => v.less(value))
  }
  /**
   * {@inheritDoc ZNumber#less}
   */
  lt(value: number): this {
    return this.less(value)
  }

  /**
   * Requires the number to be a multiple of a certain value.
   *
   * @param {number} value The value of which the number must be a multiple.
   */
  multiple(value: number): this {
    return this._parser.addCheck(v => v.multiple(value))
  }

  /**
   * Requires the number to be a TCP port, i.e., between `0` and `65535`.
   */
  port(): this {
    return this._parser.addCheck(v => v.port())
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = (): ZNumber => {
    return new ZNumber({
      validator: Joi.number().required(),
    })
  }
}
