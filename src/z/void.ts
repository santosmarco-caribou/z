import type Joi from 'joi'

import { Z, ZJoi, ZType } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZVoid                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZVoid extends Z<{
  Output: void
  Input: void
  Schema: Joi.AnySchema
}> {
  readonly name = ZType.Void
  protected readonly _hint = 'void'

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = (): ZVoid =>
    new ZVoid(
      {
        schema: ZJoi.any().optional(),
        manifest: {},
        hooks: {},
      },
      {}
    )
}
