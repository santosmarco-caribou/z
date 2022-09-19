import type Joi from 'joi'

import { Z, ZJoi, ZType } from '../_internals'

/* -------------------------------------------------------------------------- */
/*                                    ZAny                                    */
/* -------------------------------------------------------------------------- */

export class ZAny extends Z<{
  Output: any
  Input: any
  Schema: Joi.AnySchema
}> {
  readonly name = ZType.Any
  protected readonly _hint = 'any'

  /* ------------------------------------------------------------------------ */

  static create = (): ZAny =>
    new ZAny({ schema: ZJoi.any(), manifest: {}, hooks: {} }, {})
}
