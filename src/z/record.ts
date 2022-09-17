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
  protected readonly _hint = `Record<${this._getProp('keyType').hint}, ${this._getProp('valueType').hint}>`

  get keyType(): K {
    return this._getProp('keyType')
  }
  get valueType(): V {
    return this._getProp('valueType')
  }

  entries(): ZTuple<[K, V]> {
    return ZTuple.create([this._getProp('keyType'), this._getProp('valueType')])
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
          schema: ZJoi.object().pattern(keyOrValueType.$_schema, valueType.$_schema),
          manifest: {
            keys: keyOrValueType.$_manifest,
            values: valueType.$_manifest,
          },
          hooks: {},
        },
        { keyType: keyOrValueType, valueType }
      )
    } else {
      return new ZRecord(
        {
          schema: ZJoi.object().pattern(/./, keyOrValueType.$_schema),
          manifest: {
            keys: {},
            values: keyOrValueType.$_manifest,
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
