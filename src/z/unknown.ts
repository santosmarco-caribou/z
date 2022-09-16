import type Joi from 'joi'

import { type ZDef, Z, ZSchema, ZType, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZUnknown                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZUnknown extends Z<ZDef<{ Output: unknown; Validator: ZSchema<Joi.AnySchema> }>> {
  readonly name = ZType.Unknown
  protected readonly _hint = 'unknown'

  static create = (): ZUnknown => new ZUnknown({ validator: ZValidator.any().optional(), hooks: {} }, {})
}
