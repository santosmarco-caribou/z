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
  protected readonly _hint = `Readonly<${this._getProp('innerType').hint}>`

  writable(): T {
    this._removeHook('afterParse', this._getProp('hookName'))
    return this._getProp('innerType')
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <T extends AnyZ>(innerType: T): ZReadonly<T> => {
    const hookName = `readonly-${nanoid()}`
    return new ZReadonly(
      {
        schema: innerType.$_schema,
        manifest: innerType.$_manifest,
        hooks: {
          beforeParse: innerType['_getHooks']().beforeParse,
          afterParse: [...innerType['_getHooks']().afterParse, { name: hookName, handler: Object.freeze }],
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
  protected readonly _hint = `ReadonlyDeep<${this._getProp('innerType').hint}>`

  writableDeep(): T {
    this._removeHook('afterParse', this._getProp('hookName'))
    return this._getProp('innerType')
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <T extends AnyZ>(innerType: T): ZReadonlyDeep<T> => {
    const hookName = `readonly-deep-${nanoid()}`
    return new ZReadonlyDeep(
      {
        schema: innerType.$_schema,
        manifest: innerType.$_manifest,
        hooks: {
          beforeParse: innerType['_getHooks']().beforeParse,
          afterParse: [...innerType['_getHooks']().afterParse, { name: hookName, handler: input => freezeDeep(input) }],
        },
      },
      { innerType, hookName }
    )
  }
}
