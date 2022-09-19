import type Joi from 'joi'

import { Z, ZJoi, ZType } from '../_internals'

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
    new ZUndefined({ schema: ZJoi.undefined(), manifest: {}, hooks: {} }, {})
}
