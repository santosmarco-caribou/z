import Joi from 'joi'

import { AnyZ, Z, ZDef, ZOutput, ZReadonly, ZReadonlyDeep, ZSchema, ZTuple, ZType, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZRecord                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZRecord<
  K extends Z<ZDef<{ Output: PropertyKey; Validator: ZSchema<Joi.Schema> }>>,
  V extends AnyZ
> extends Z<
  ZDef<{ Output: Record<ZOutput<K>, ZOutput<V>>; Validator: ZSchema<Joi.AnySchema> }, { KeyType: K; ValueType: V }>
> {
  readonly name = ZType.Record
  protected readonly _hint = `Record<${this._props.keyType.hint}, ${this._props.valueType.hint}>`

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

  static create = <K extends Z<ZDef<{ Output: PropertyKey; Validator: ZSchema<Joi.Schema> }>>, V extends AnyZ>(
    keyType: K,
    valueType: V
  ): ZRecord<K, V> => {
    return new ZRecord<K, V>(
      { validator: ZValidator.object().pattern(keyType._validator, valueType._validator), hooks: {} },
      { keyType, valueType }
    )
  }
}

export type AnyZRecord = ZRecord<Z<ZDef<{ Output: PropertyKey; Validator: ZSchema<Joi.Schema> }>>, AnyZ>
