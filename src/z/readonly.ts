import { nanoid } from 'nanoid'
import { ReadonlyDeep } from 'type-fest'

import { AnyZ, Z, ZDef, ZInput, ZOutput, ZType } from '../_internals'
import { freezeDeep } from '../utils'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZReadonly                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZReadonly<T extends AnyZ> extends Z<
  ZDef<
    { Output: Readonly<ZOutput<T>>; Input: Readonly<ZInput<T>>; Validator: T['_validator'] },
    { InnerType: T; HookName: string }
  >
> {
  readonly name = ZType.Readonly
  protected readonly _hint = `Readonly<${this._props.innerType.hint}>`

  writable(): T {
    this._removeHook('afterParse', this._props.hookName)
    return this._props.innerType
  }

  static create = <T extends AnyZ>(innerType: T): ZReadonly<T> => {
    const hookName = `readonly-${nanoid()}`
    return new ZReadonly(
      {
        validator: innerType._validator,
        hooks: {
          afterParse: [{ name: hookName, handler: Object.freeze }],
        },
      },
      { innerType, hookName }
    )
  }
}

/* -------------------------------------------------- ZReadonlyDeep ------------------------------------------------- */

export class ZReadonlyDeep<T extends AnyZ> extends Z<
  ZDef<
    { Output: ReadonlyDeep<ZOutput<T>>; Input: ReadonlyDeep<ZInput<T>>; Validator: T['_validator'] },
    { InnerType: T; HookName: string }
  >
> {
  readonly name = ZType.ReadonlyDeep
  protected readonly _hint = `ReadonlyDeep<${this._props.innerType.hint}>`

  writableDeep(): T {
    this._removeHook('afterParse', this._props.hookName)
    return this._props.innerType
  }

  static create = <T extends AnyZ>(innerType: T): ZReadonlyDeep<T> => {
    const hookName = `readonly-deep-${nanoid()}`
    return new ZReadonlyDeep(
      {
        validator: innerType._validator,
        hooks: {
          afterParse: [{ name: hookName, handler: input => freezeDeep(input) as any }],
        },
      },
      { innerType, hookName }
    )
  }
}
