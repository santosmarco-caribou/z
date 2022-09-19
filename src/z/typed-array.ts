import Joi from 'joi'
import { TypedArray } from 'type-fest'

import { Z, ZInstanceOf, ZType } from '../_internals'

/* -------------------------------------------------------------------------- */
/*                                 ZTypedArray                                */
/* -------------------------------------------------------------------------- */

export class ZTypedArray<T extends TypedArray> extends Z<{
  Output: T
  Input: T
  Schema: Joi.AnySchema
  TypeConstructor: new (...args: any[]) => TypedArray
}> {
  readonly name = ZType.TypedArray
  protected readonly _hint = this._props.getOne('typeConstructor').name

  /* ------------------------------------------------------------------------ */

  static create = <T extends new (...args: any[]) => TypedArray>(
    type: T
  ): ZTypedArray<InstanceType<T>> =>
    new ZTypedArray(
      {
        schema: ZInstanceOf.create(type)._schema.get(),
        manifest: {},
        hooks: {},
      },
      { typeConstructor: type }
    )
}
