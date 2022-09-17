import type Joi from 'joi'

import { Z, ZJoi, ZType } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZUnknown                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZUnknown extends Z<{
  Output: unknown
  Input: unknown
  Schema: Joi.AnySchema
}> {
  readonly name = ZType.Unknown
  protected readonly _hint = 'unknown'

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = (): ZUnknown =>
    new ZUnknown(
      {
        schema: ZJoi.any().optional(),
        manifest: {},
        hooks: {},
      },
      {}
    )
}
