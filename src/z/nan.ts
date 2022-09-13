import type Joi from 'joi'
import type { A } from 'ts-toolbelt'

import { type ZDef, Z, ZSchema, ZType, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZNaN                                                        */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZNaN extends Z<ZDef<{ Output: A.Type<number, 'NaN'>; Validator: ZSchema<Joi.AnySchema> }>> {
  readonly name = ZType.NaN
  protected readonly _hint = 'NaN'

  static create = (): ZNaN =>
    new ZNaN(
      {
        validator: ZValidator.custom((value, { OK, FAIL }) => (Number.isNaN(value) ? OK(value) : FAIL('nan.base', {}))),
        hooks: {},
      },
      {}
    )
}
