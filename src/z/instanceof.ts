import type Joi from 'joi'

import { Z, ZJoi, ZType, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                     ZInstanceOf                                                    */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZInstanceOf<T extends new (...args: any[]) => any> extends Z<{
  Output: InstanceType<T>
  Input: InstanceType<T>
  Schema: Joi.AnySchema
  Type: T
}> {
  readonly name = ZType.InstanceOf
  protected readonly _hint = `instanceof ${this._props.getOne('type').name}`

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <T extends new (...args: any[]) => any>(type: T): ZInstanceOf<T> =>
    new ZInstanceOf(
      {
        schema: ZValidator.custom(ZJoi.any(), (value, { OK, FAIL }) =>
          value instanceof type ? OK(value) : FAIL('instanceof.base', { type: type.name })
        ),
        manifest: {},
        hooks: {},
      },
      { type }
    )
}

/* ------------------------------------------------------------------------------------------------------------------ */

export type AnyZInstanceOf = ZInstanceOf<new (...args: any[]) => any>
