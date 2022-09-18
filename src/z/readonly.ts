import Joi from 'joi'
import { nanoid } from 'nanoid'
import { ReadonlyDeep } from 'type-fest'

import { _ZInput, _ZOutput, AnyZ, Z, ZType } from '../_internals'
import { freezeDeep } from '../utils'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZReadonly                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZReadonly<T extends AnyZ> extends Z<{
  Output: Readonly<_ZOutput<T>>
  Input: Readonly<_ZInput<T>>
  Schema: Joi.AnySchema
  InnerType: T
  HookName: string
}> {
  readonly name = ZType.Readonly
  protected readonly _hint = `Readonly<${this._props.getOne('innerType').hint}>`

  writable(): T {
    this._hooks.remove('afterParse', this._props.getOne('hookName'))
    return this._props.getOne('innerType')
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <T extends AnyZ>(innerType: T): ZReadonly<T> => {
    const hookName = `readonly-${nanoid()}`
    return new ZReadonly(
      {
        schema: innerType._schema.get(),
        manifest: innerType._manifest.get(),
        hooks: {
          beforeParse: innerType._hooks.get().beforeParse,
          afterParse: [...innerType._hooks.get().afterParse, { name: hookName, handler: Object.freeze }],
        },
      },
      { innerType, hookName }
    )
  }
}

/* -------------------------------------------------- ZReadonlyDeep ------------------------------------------------- */

export class ZReadonlyDeep<T extends AnyZ> extends Z<{
  Output: ReadonlyDeep<_ZOutput<T>>
  Input: ReadonlyDeep<_ZInput<T>>
  Schema: Joi.AnySchema
  InnerType: T
  HookName: string
}> {
  readonly name = ZType.ReadonlyDeep
  protected readonly _hint = `ReadonlyDeep<${this._props.getOne('innerType').hint}>`

  writableDeep(): T {
    this._hooks.remove('afterParse', this._props.getOne('hookName'))
    return this._props.getOne('innerType')
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <T extends AnyZ>(innerType: T): ZReadonlyDeep<T> => {
    const hookName = `readonly-deep-${nanoid()}`
    return new ZReadonlyDeep(
      {
        schema: innerType._schema.get(),
        manifest: innerType._manifest.get(),
        hooks: {
          beforeParse: innerType._hooks.get().beforeParse,
          afterParse: [...innerType._hooks.get().afterParse, { name: hookName, handler: input => freezeDeep(input) }],
        },
      },
      { innerType, hookName }
    )
  }
}
