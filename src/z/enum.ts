import type Joi from 'joi'
import type { F } from 'ts-toolbelt'

import { Z, ZJoi, ZType } from '../_internals'
import { unionizeHints } from '../utils'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZEnum                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZEnum<T extends readonly [string, ...string[]]> extends Z<{
  Output: T[number]
  Input: T[number]
  Schema: Joi.StringSchema
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

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <T extends readonly [string, ...string[]]>(values: F.Narrow<T>): ZEnum<T> =>
    new ZEnum(
      {
        schema: ZJoi.string().valid(...values),
        manifest: {},
        hooks: {},
      },
      { values: values as T }
    )
}
