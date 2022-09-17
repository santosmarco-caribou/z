import Joi from 'joi'

import { _ZInput, _ZOutput, AnyZ, Z, ZJoi, ZTuple, ZType } from '../_internals'

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

  static create = <K extends AnyZ<PropertyKey>, V extends AnyZ>(keyType: K, valueType: V): ZRecord<K, V> =>
    new ZRecord<K, V>(
      {
        schema: ZJoi.object().pattern(keyType.$_schema, valueType.$_schema),
        manifest: {
          keys: keyType.$_manifest,
          values: valueType.$_manifest,
        },
        hooks: {
          beforeParse: [...keyType.$_hooks.beforeParse, ...valueType.$_hooks.beforeParse],
          afterParse: [...keyType.$_hooks.afterParse, ...valueType.$_hooks.afterParse],
        },
      },
      { keyType, valueType }
    )
}

/* ------------------------------------------------------------------------------------------------------------------ */

export type AnyZRecord = ZRecord<AnyZ<PropertyKey>, AnyZ>
