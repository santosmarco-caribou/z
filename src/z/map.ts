import Joi from 'joi'

import { _ZInput, _ZOutput, AnyZ, Z, ZJoi, ZTuple, ZType } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZMap                                                        */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZMap<K extends AnyZ, V extends AnyZ> extends Z<{
  Output: Map<_ZOutput<K>, _ZOutput<V>>
  Input: Map<_ZInput<K>, _ZInput<V>>
  Schema: Joi.AnySchema
  KeyType: K
  ValueType: V
}> {
  readonly name = ZType.Map
  protected readonly _hint = `Map<${this._getProp('keyType').hint}, ${this._getProp('valueType').hint}>`

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

  static create = <K extends AnyZ, V extends AnyZ>(keyType: K, valueType: V): ZMap<K, V> =>
    new ZMap(
      {
        schema: ZJoi.object().pattern(keyType.$_schema, valueType.$_schema).cast('map'),
        manifest: {
          keys: keyType.$_manifest,
          values: valueType.$_manifest,
        },
        hooks: {
          beforeParse: [...keyType['_getHooks']().beforeParse, ...valueType['_getHooks']().beforeParse],
          afterParse: [...keyType['_getHooks']().afterParse, ...valueType['_getHooks']().afterParse],
        },
      },
      { keyType, valueType }
    )
}

/* ------------------------------------------------------------------------------------------------------------------ */

export type AnyZMap = ZMap<AnyZ, AnyZ>
