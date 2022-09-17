import type Joi from 'joi'

import { Z, ZJoi, ZType, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZNaN                                                        */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZNaN extends Z<{
  Output: number
  Input: number
  Schema: Joi.AnySchema
}> {
  readonly name = ZType.NaN
  protected readonly _hint = 'NaN'

  static create = (): ZNaN =>
    new ZNaN(
      {
        schema: ZValidator.custom(ZJoi.any(), (value, { OK, FAIL }) =>
          Number.isNaN(value) ? OK(value) : FAIL('nan.base')
        ),
        manifest: {},
        hooks: {},
      },
      {}
    )
}
