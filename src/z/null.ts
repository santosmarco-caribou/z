import type Joi from 'joi'

import { Z, ZJoi, ZType } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZNull                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZNull extends Z<{
  Output: null
  Input: null
  Schema: Joi.AnySchema
}> {
  readonly name = ZType.Null
  protected readonly _hint = 'null'

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = (): ZNull =>
    new ZNull(
      {
        schema: ZJoi.any().valid(null),
        manifest: {},
        hooks: {},
      },
      {}
    )
}
