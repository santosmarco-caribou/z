import type Joi from 'joi'

import { type ZDef, Z, ZCheckOptions, ZSchema, ZType, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZDate                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

const __NOW__ = Symbol('__NOW__')

type ZDateCheckInput = Date | typeof __NOW__

export type ZDateOptions = { strict: boolean }

export class ZDate<Opts extends ZDateOptions = { strict: false }> extends Z<
  ZDef<
    {
      Output: Date
      Input: Opts['strict'] extends true ? Date : Date | number | string
      Validator: ZSchema<Joi.DateSchema>
    },
    { options: Opts }
  >
> {
  readonly name = ZType.Date
  readonly hint = 'Date'

  /**
   * Requires the date to be before a certain date.
   *
   * @param date - The date to compare to.
   */
  before(date: ZDateCheckInput, options?: ZCheckOptions<'date.greater'>): this {
    this._addCheck('date.greater', v => v.greater(this._parseCheckInput(date)), options)
    return this
  }
  /**
   * Requires the date to be after a certain date.
   *
   * @param date - The date to compare to.
   */
  after(date: ZDateCheckInput, options?: ZCheckOptions<'date.less'>): this {
    this._addCheck('date.less', v => v.less(this._parseCheckInput(date)), options)
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
    this._updateValidatorPreferences({ convert: false })
    return ZDate.$_create(this._validator, { strict: true })
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private _parseCheckInput(input: ZDateCheckInput): Date {
    if (input === __NOW__) return new Date()
    else return input
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static $_create = <_Opts extends ZDateOptions>(validator: ZSchema<Joi.DateSchema>, options: _Opts): ZDate<_Opts> =>
    new ZDate({ validator }, { options })

  static create = Object.assign((): ZDate => this.$_create(ZValidator.date(), { strict: false }), { now: __NOW__ })
}
