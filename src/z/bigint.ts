import Joi from 'joi'

import type { ZDef } from '../def'
import { ZType } from '../type'
import { ZValidator } from '../validation/validator'
import { Z } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZBigInt                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZBigIntDef = ZDef<{ validator: Joi.AnySchema<bigint> }>

export class ZBigInt extends Z<bigint, ZBigIntDef> {
  readonly name = ZType.BigInt
  readonly hint = 'bigint'

  static create = (): ZBigInt => {
    return new ZBigInt({
      validator: ZValidator.custom(Joi.any(), (value, { OK, FAIL }) =>
        typeof value === 'bigint' ? OK() : FAIL('bigint.base')
      ).required(),
    })
  }
}
