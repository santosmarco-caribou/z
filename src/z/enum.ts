import type Joi from 'joi'
import type { F } from 'ts-toolbelt'

import { Z, ZJoi, ZManifestObject, ZType } from '../_internals'
import { toUpperCase, unionizeHints } from '../utils'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZEnum                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZEnum<T extends readonly [string, ...string[]]> extends Z<{
  Output: T[number]
  Input: T[number]
  Schema: Joi.AnySchema
  Values: T
}> {
  readonly name = ZType.Enum
  protected readonly _hint = unionizeHints(
    ...this._getProp('values')
      .map(value => `'${value}'`)
      .sort()
  )

  get values(): T {
    return this._getProp('values')
  }

  get enum(): {
    [K in keyof T]: T[K]
  } {
    return this._getProp('values').reduce(
      (acc, value) => ({ ...acc, [value]: value }),
      {} as {
        [K in keyof T]: T[K]
      }
    )
  }

  uppercase(): ZEnum<{ [K in keyof T]: Uppercase<T[K]> }> {
    return new ZEnum<{ [K in keyof T]: Uppercase<T[K]> }>(
      {
        schema: ZJoi.any().valid(ZJoi.override, ...this._getProp('values').map(toUpperCase)),
        manifest: this.$_manifest as ZManifestObject<{ [K in keyof T]: Uppercase<T[K]> }[number]>,
        hooks: this._getHooks(),
      },
      { values: this._getProp('values').map(toUpperCase) as { [K in keyof T]: Uppercase<T[K]> } }
    )
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <T extends readonly [string, ...string[]]>(values: F.Narrow<T>): ZEnum<T> =>
    new ZEnum(
      {
        schema: ZJoi.any().valid(...values),
        manifest: {},
        hooks: {},
      },
      { values: values as T }
    )
}
