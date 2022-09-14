import Joi from 'joi'

import {
  AnyZ,
  Z,
  ZDef,
  ZInput,
  ZOutput,
  ZReadonly,
  ZReadonlyDeep,
  ZSchema,
  ZTuple,
  ZType,
  ZValidator,
} from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZMap                                                        */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZMap<K extends AnyZ, V extends AnyZ> extends Z<
  ZDef<
    { Output: Map<ZOutput<K>, ZOutput<V>>; Input: Map<ZInput<K>, ZInput<V>>; Validator: ZSchema<Joi.AnySchema> },
    { KeyType: K; ValueType: V }
  >
> {
  readonly name = ZType.Map
  protected readonly _hint = `Map<${this._props.keyType.hint}, ${this._props.valueType.hint}>`

  get keyType(): K {
    return this._props.keyType
  }
  get valueType(): V {
    return this._props.valueType
  }

  entries(): ZTuple<[K, V]> {
    return ZTuple.create([this._props.keyType, this._props.valueType])
  }

  readonly(): ZReadonly<this> {
    return ZReadonly.create(this)
  }
  readonlyDeep(): ZReadonlyDeep<this> {
    return ZReadonlyDeep.create(this)
  }

  static create = <K extends AnyZ, V extends AnyZ>(keyType: K, valueType: V): ZMap<K, V> =>
    new ZMap(
      { validator: ZValidator.object().pattern(keyType._validator, valueType._validator).cast('map'), hooks: {} },
      { keyType, valueType }
    )
}

export type AnyZMap = ZMap<Z<ZDef<{ Output: PropertyKey; Validator: ZSchema<Joi.Schema> }>>, AnyZ>
