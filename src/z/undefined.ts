import type Joi from 'joi'

import { Z, ZJoi, ZType, ZValidator } from '../_internals'

/* -------------------------------------------------------------------------- */
/*                                 ZUndefined                                 */
/* -------------------------------------------------------------------------- */

export class ZUndefined extends Z<{
  Output: undefined
  Input: undefined
  Schema: Joi.AnySchema
}> {
  readonly name = ZType.Undefined
  protected readonly _hint = 'undefined'

  /* ------------------------------------------------------------------------ */

  static create = (): ZUndefined =>
    new ZUndefined(
      {
        schema: ZValidator.custom(
          ZJoi.any().optional(),
          (value, { OK, FAIL }) =>
            value === undefined
              ? OK(undefined)
              : FAIL('any.only', { valids: ['undefined'] })
        ),
        manifest: {},
        hooks: {},
      },
      {}
    )
}
