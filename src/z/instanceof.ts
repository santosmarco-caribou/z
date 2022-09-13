import type Joi from 'joi'

import { type ZDef, Z, ZSchema, ZType, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                     ZInstanceOf                                                    */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZInstanceOf<T extends new (...args: any[]) => any> extends Z<
  ZDef<{ Output: InstanceType<T>; Validator: ZSchema<Joi.AnySchema> }, { type: T }>
> {
  readonly name = ZType.InstanceOf
  readonly hint = `instanceof ${this._props.type.name}`

  static create = <T extends new (...args: any[]) => any>(type: T): ZInstanceOf<T> =>
    new ZInstanceOf(
      {
        validator: ZValidator.custom((value, { OK, FAIL }) =>
          value instanceof type ? OK(value) : FAIL('instanceof.base', { type: type.name })
        ),
      },
      { type }
    )
}

/* ------------------------------------------------------------------------------------------------------------------ */

export type AnyZInstanceOf = ZInstanceOf<new (...args: any[]) => any>
