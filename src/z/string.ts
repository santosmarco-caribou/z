import { type ZDef, Z, ZType, ZValidator, ZValidatorSchema } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZString                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZStringDef = ZDef<{ Output: string; Validator: ZValidatorSchema<'string'> }>

export class ZString extends Z<ZStringDef> {
  readonly name = ZType.String
  readonly hint = 'string'

  alphanumeric(): this {
    this._addCheck('string.alphanum', v => v.alphanum())
    return this
  }

  static create = (): ZString => new ZString({ validator: ZValidator.string() }, {})
}
