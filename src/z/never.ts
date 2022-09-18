import type Joi from 'joi'

import { Z, ZJoi, ZType, ZValidator } from '../_internals'

/* -------------------------------------------------------------------------- */
/*                                   ZNever                                   */
/* -------------------------------------------------------------------------- */

export class ZNever extends Z<{
  Output: never
  Input: never
  Schema: Joi.AnySchema
}> {
  readonly name = ZType.Never
  protected readonly _hint = 'never'

  /* ------------------------------------------------------------------------ */

  static create = (): ZNever =>
    new ZNever(
      {
        schema: ZValidator.custom(ZJoi.any(), (_, { FAIL }) =>
          FAIL('any.unknown')
        ),
        manifest: {},
        hooks: {},
      },
      {}
    )
}
