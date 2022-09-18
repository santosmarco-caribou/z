import Joi from 'joi'

import { type _ZInput, type _ZOutput, type AnyZ, Z, ZJoi, ZPropertyKey, ZTuple, ZType } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZRecord                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZRecord<K extends AnyZ<PropertyKey>, V extends AnyZ> extends Z<{
  Output: Record<_ZOutput<K>, _ZOutput<V>>
  Input: Record<_ZInput<K>, _ZInput<V>>
  Schema: Joi.AnySchema
  KeyType: K
  ValueType: V
}> {
  readonly name = ZType.Record
  protected readonly _hint = `Record<${this._props.getOne('keyType').hint}, ${this._props.getOne('valueType').hint}>`

  get keyType(): K {
    return this._props.getOne('keyType')
  }
  get valueType(): V {
    return this._props.getOne('valueType')
  }

  entries(): ZTuple<[K, V]> {
    return ZTuple.create([this._props.getOne('keyType'), this._props.getOne('valueType')])
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create: {
    <V extends AnyZ>(valueType: V): ZRecord<ZPropertyKey, V>
    <K extends AnyZ<PropertyKey>, V extends AnyZ>(keyType: K, valueType: V): ZRecord<K, V>
  } = <T extends AnyZ<PropertyKey> | AnyZ, U extends AnyZ = never>(
    keyOrValueType: T,
    valueType?: U
  ): ZRecord<ZPropertyKey, T> | ZRecord<T, U> => {
    if (valueType) {
      return new ZRecord(
        {
          schema: ZJoi.object().pattern(keyOrValueType._schema.get(), valueType._schema.get()),
          manifest: {
            keys: keyOrValueType._manifest.get(),
            values: valueType._manifest.get(),
          },
          hooks: {},
        },
        { keyType: keyOrValueType, valueType }
      )
    } else {
      return new ZRecord(
        {
          schema: ZJoi.object().pattern(/./, keyOrValueType._schema.get()),
          manifest: {
            keys: {},
            values: keyOrValueType._manifest.get(),
          },
          hooks: {},
        },
        { keyType: ZPropertyKey.create(), valueType: keyOrValueType }
      )
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------ */

export type AnyZRecord = ZRecord<AnyZ<PropertyKey>, AnyZ>
