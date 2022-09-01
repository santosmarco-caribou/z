import Joi from 'joi'

import type { ZDef } from '../def'
import { ZType } from '../type'
import { Z } from './z'

export const __NOW__ = Symbol('__NOW__')

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZDate                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

type ZDateCheckInput = Date | typeof __NOW__

export type ZDateDef = ZDef<{ type: ZType.Date; validator: Joi.DateSchema }>

export class ZDate extends Z<Date, ZDateDef, Date | number | string> {
  readonly name = 'Date'

  before(date: ZDateCheckInput): ZDate {
    return this._parser.addCheck(v => v.max(this._parseCheckInput(date)))
  }

  after(date: ZDateCheckInput): ZDate {
    return this._parser.addCheck(v => v.min(this._parseCheckInput(date)))
  }

  between(dateA: ZDateCheckInput, dateB: ZDateCheckInput): ZDate {
    return this.after(dateA).before(dateB)
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private _parseCheckInput(input: ZDateCheckInput): Date {
    if (input === __NOW__) return new Date()
    else return input
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = Object.assign(
    (): ZDate => {
      return new ZDate({
        type: ZType.Date,
        validator: Joi.date().required(),
      })
    },
    { now: __NOW__ } as const
  )
}
