import type Joi from 'joi'

import { Z, ZJoi, ZType, ZValidator } from '../_internals'

/* -------------------------------------------------------------------------- */
/*                                   ZBigInt                                  */
/* -------------------------------------------------------------------------- */

export class ZBigInt extends Z<{
  Output: bigint
  Input: bigint
  Schema: Joi.AnySchema
}> {
  readonly name = ZType.BigInt
  protected readonly _hint = 'bigint'

  /* ------------------------------------------------------------------------ */

  static create = (): ZBigInt =>
    new ZBigInt(
      {
        schema: ZValidator.custom(ZJoi.any(), (value, { OK, FAIL }) =>
          typeof value === 'bigint' ? OK(value) : FAIL('bigint.base')
        ),
        manifest: {
          type: 'number',
          format: 'bigint',
        },
        hooks: {},
      },
      {}
    )
}
