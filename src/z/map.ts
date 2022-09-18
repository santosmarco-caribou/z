import Joi from 'joi'

import { _ZInput, _ZOutput, AnyZ, Z, ZJoi, ZTuple, ZType } from '../_internals'

/* -------------------------------------------------------------------------- */
/*                                    ZMap                                    */
/* -------------------------------------------------------------------------- */

export class ZMap<K extends AnyZ, V extends AnyZ> extends Z<{
  Output: Map<_ZOutput<K>, _ZOutput<V>>
  Input: Map<_ZInput<K>, _ZInput<V>>
  Schema: Joi.AnySchema
  KeyType: K
  ValueType: V
}> {
  readonly name = ZType.Map
  protected readonly _hint = `Map<${this._props.getOne('keyType').hint}, ${
    this._props.getOne('valueType').hint
  }>`

  get keyType(): K {
    return this._props.getOne('keyType')
  }
  get valueType(): V {
    return this._props.getOne('valueType')
  }

  entries(): ZTuple<[K, V]> {
    return ZTuple.create([
      this._props.getOne('keyType'),
      this._props.getOne('valueType'),
    ])
  }

  /* ------------------------------------------------------------------------ */

  static create = <K extends AnyZ, V extends AnyZ>(
    keyType: K,
    valueType: V
  ): ZMap<K, V> =>
    new ZMap(
      {
        schema: ZJoi.object()
          .pattern(keyType._schema.get(), valueType._schema.get())
          .cast('map'),
        manifest: {
          keys: keyType._manifest.get(),
          values: valueType._manifest.get(),
        },
        hooks: {
          beforeParse: [
            ...keyType._hooks.get().beforeParse,
            ...valueType._hooks.get().beforeParse,
          ],
          afterParse: [
            ...keyType._hooks.get().afterParse,
            ...valueType._hooks.get().afterParse,
          ],
        },
      },
      { keyType, valueType }
    )
}

/* -------------------------------------------------------------------------- */

export type AnyZMap = ZMap<AnyZ, AnyZ>
