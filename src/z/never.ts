import type Joi from 'joi'

import { type ZDef, Z, ZSchema, ZType, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZNever                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZNever extends Z<ZDef<{ Output: never; Validator: ZSchema<Joi.AnySchema> }>> {
  readonly name = ZType.Never
  readonly hint = 'never'

  static create = (): ZNever =>
    new ZNever({ validator: ZValidator.custom((_, { FAIL }) => FAIL('any.unknown', {})) }, {})
}
