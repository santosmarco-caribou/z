import type Joi from 'joi'

import { Z, ZCheckOptions, ZJoi, ZType } from '../_internals'

/* -------------------------------------------------------------------------- */
/*                                   ZNumber                                  */
/* -------------------------------------------------------------------------- */

export type ZNumberPrecisionOptions = ZCheckOptions<
  'number.precision',
  { strict?: boolean }
>

/* -------------------------------------------------------------------------- */

export class ZNumber extends Z<{
  Output: number
  Input: number
  Schema: Joi.NumberSchema
}> {
  readonly name = ZType.Number
  protected readonly _hint = 'number'

  /**
   * Requires the number to be an integer (no floating point).
   */
  integer(options?: ZCheckOptions<'number.integer'>): this {
    this._addCheck('number.integer', v => v.integer(), {
      message: options?.message,
    })
    this._manifest.update('format', 'integer')
    return this
  }
  /**
   * {@inheritDoc ZNumber#integer}
   */
  int(options?: ZCheckOptions<'number.integer'>): this {
    return this.integer({ message: options?.message })
  }

  /**
   * Requires the number to have a maximum precision, i.e., a maximum number of decimal places.
   *
   * @remarks
   * By default, this check will round the number to the specified precision.
   * If you want to strictly parse the value, though, and throw an error instead, set the `strict` option to `true`.
   *
   * @example Default behavior
   * ```ts
   * z.number().precision(2).parse(1.234) // => 1.23
   * ```
   *
   * @example Strict behavior
   * ```ts
   * z.number().precision(2, { strict: true }).parse(1.234) // => throws
   * ```
   *
   * @param precision - The maximum number of decimal places allowed.
   */
  precision(precision: number, options?: ZNumberPrecisionOptions): this {
    return this._addCheck(
      'number.precision',
      v => {
        const baseCheck = v.precision(precision)
        if (options?.strict) return baseCheck.strict()
        return baseCheck
      },
      { message: options?.message }
    )
  }

  /**
   * Requires the number to be positive.
   */
  positive(options?: ZCheckOptions<'number.positive'>): this {
    return this._addCheck('number.positive', v => v.positive(), {
      message: options?.message,
    })
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
  negative(options?: ZCheckOptions<'number.negative'>): this {
    return this._addCheck('number.negative', v => v.negative(), {
      message: options?.message,
    })
  }
  /**
   * Requires the number to be greater than or equal to 0.
   */
  nonnegative(options?: ZCheckOptions<'number.min'>): this {
    return this.min(0, { message: options?.message })
  }

  /**
   * Requires the number to be greater than or equal to a certain value.
   *
   * @param value - The minimum value allowed.
   */
  min(value: number, options?: ZCheckOptions<'number.min'>): this {
    this._addCheck('number.min', v => v.min(value), {
      message: options?.message,
    })
    this._manifest.update('minimum', value)
    return this
  }
  /**
   * {@inheritDoc ZNumber#min}
   */
  gte(value: number, options?: ZCheckOptions<'number.min'>): this {
    return this.min(value, { message: options?.message })
  }

  /**
   * Requires the number to be greater than (but not equal to) a certain value.
   *
   * @param value - The minimum value allowed (exclusive).
   */
  greater(value: number, options?: ZCheckOptions<'number.greater'>): this {
    return this._addCheck('number.greater', v => v.greater(value), {
      message: options?.message,
    })
  }
  /**
   * {@inheritDoc ZNumber#greater}
   */
  gt(value: number, options?: ZCheckOptions<'number.greater'>): this {
    return this.greater(value, { message: options?.message })
  }

  /**
   * Requires the number to be less than or equal to a certain value.
   *
   * @param value - The maximum value allowed.
   */
  max(value: number, options?: ZCheckOptions<'number.max'>): this {
    this._addCheck('number.max', v => v.max(value), {
      message: options?.message,
    })
    this._manifest.update('maximum', value)
    return this
  }
  /**
   * {@inheritDoc ZNumber#max}
   */
  lte(value: number, options?: ZCheckOptions<'number.max'>): this {
    return this.max(value, { message: options?.message })
  }

  /**
   * Requires the number to be less than (but not equal to) a certain value.
   *
   * @param value - The maximum value allowed (exclusive).
   */
  less(value: number, options?: ZCheckOptions<'number.less'>): this {
    return this._addCheck('number.less', v => v.less(value), {
      message: options?.message,
    })
  }
  /**
   * {@inheritDoc ZNumber#less}
   */
  lt(value: number, options?: ZCheckOptions<'number.less'>): this {
    return this.less(value, { message: options?.message })
  }

  /**
   * Requires the number to be within a certain range.
   *
   * @param min - The minimum value allowed (inclusive).
   * @param max - The maximum value allowed (inclusive).
   */
  between(min: number, max: number): this {
    return this.min(min).max(max)
  }

  /**
   * Requires the number to be a multiple of a certain value.
   *
   * @param value - The value of which the number must be a multiple.
   */
  multiple(value: number, options?: ZCheckOptions<'number.multiple'>): this {
    return this._addCheck('number.multiple', v => v.multiple(value), {
      message: options?.message,
    })
  }

  /**
   * Requires the number to be a TCP port, i.e., between `0` and `65535`.
   */
  port(options?: ZCheckOptions<'number.port'>): this {
    this._addCheck('number.port', v => v.port(), { message: options?.message })
    this._manifest.update('format', 'port')
    return this
  }

  /**
   * Allows the number to be outside of JavaScript's safety range
   * (`Number.MIN_SAFE_INTEGER` & `Number.MAX_SAFE_INTEGER`).
   */
  unsafe() {
    this._addCheck(v => v.unsafe(true))
  }
  /**
   * Requires the number to be inside of JavaScript's safety range
   * (`Number.MIN_SAFE_INTEGER` & `Number.MAX_SAFE_INTEGER`).
   *
   * This is on by default.
   */
  safe(options?: ZCheckOptions<'number.unsafe'>) {
    this._addCheck('number.unsafe', v => v.unsafe(false), {
      message: options?.message,
    })
  }

  /* ------------------------------------------------------------------------ */

  static create = (): ZNumber =>
    new ZNumber(
      {
        schema: ZJoi.number(),
        manifest: {
          type: 'number',
        },
        hooks: {},
      },
      {}
    )
}
