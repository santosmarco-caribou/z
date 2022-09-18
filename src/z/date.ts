import type Joi from 'joi'

import { Z, ZCheckOptions, ZJoi, ZType } from '../_internals'

/* -------------------------------------------------------------------------- */
/*                                    ZDate                                   */
/* -------------------------------------------------------------------------- */

const __NOW__ = Symbol('__NOW__')

type ZDateCheckInput = Date | typeof __NOW__

export class ZDate<
  Opts extends { strict: boolean } = { strict: false }
> extends Z<{
  Output: Date
  Input: Opts['strict'] extends true ? Date : Date | number | string
  Schema: Joi.DateSchema
  Options: Opts
}> {
  readonly name = ZType.Date
  protected readonly _hint = 'Date'

  /**
   * Requires the date to be before a certain date.
   *
   * @param date - The date to compare to.
   */
  before(date: ZDateCheckInput, options?: ZCheckOptions<'date.less'>): this {
    this._addCheck(
      'date.less',
      v => v.less(this._parseCheckInput(date)),
      options
    )
    return this
  }
  /**
   * Requires the date to be after a certain date.
   *
   * @param date - The date to compare to.
   */
  after(date: ZDateCheckInput, options?: ZCheckOptions<'date.greater'>): this {
    this._addCheck(
      'date.greater',
      v => v.greater(this._parseCheckInput(date)),
      options
    )
    return this
  }
  /**
   * Requires the date to be between two dates.
   *
   * @param dateA - The `min` date to compare to.
   * @param dateB - The `max` date to compare to.
   */
  between(dateA: ZDateCheckInput, dateB: ZDateCheckInput): this {
    return this.after(dateA).before(dateB)
  }

  /**
   * Requires the input to be strictly a `Date` object.
   */
  strict(): ZDate<{ strict: true }> {
    this._schema.updatePreferences({ convert: false })
    return new ZDate<{ strict: true }>(
      {
        schema: this._schema.get(),
        manifest: this._manifest.get(),
        hooks: this._hooks.get(),
      },
      { options: { strict: true } }
    )
  }

  /* ------------------------------------------------------------------------ */

  private _parseCheckInput(input: ZDateCheckInput): Date {
    if (input === __NOW__) return new Date()
    else return input
  }

  /* ------------------------------------------------------------------------ */

  static create = Object.assign(
    (): ZDate =>
      new ZDate(
        {
          schema: ZJoi.date(),
          manifest: {},
          hooks: {},
        },
        { options: { strict: false } }
      ),
    { now: __NOW__ }
  )
}
