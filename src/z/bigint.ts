import type Joi from 'joi'

import { type ZDef, Z, ZSchema, ZType, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZBigInt                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZBigInt extends Z<ZDef<{ Output: bigint; Validator: ZSchema<Joi.AnySchema> }>> {
  readonly name = ZType.BigInt
  protected readonly _hint = 'bigint'

  static create = (): ZBigInt =>
    new ZBigInt(
      {
        validator: ZValidator.custom((value, { OK, FAIL }) =>
          typeof value === 'bigint' ? OK(value) : FAIL('bigint.base', {})
        ),
        hooks: {},
      },
      {}
    )
}
