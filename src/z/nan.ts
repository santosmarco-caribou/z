import Joi from 'joi'

import type { ZDef } from '../def'
import { ZType } from '../type'
import { ZValidator } from '../validation/validator'
import { Z } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZNaN                                                        */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZNaNDef = ZDef<{ validator: Joi.AnySchema<number> }>

export class ZNaN extends Z<number, ZNaNDef> {
  readonly name = ZType.NaN
  readonly hint = 'NaN'

  static create = (): ZNaN => {
    return new ZNaN({
      validator: ZValidator.custom(Joi.any(), (value, { OK, FAIL }) =>
        Number.isNaN(value) ? OK() : FAIL('nan.base')
      ).required(),
    })
  }
}
