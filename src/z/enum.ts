import type Joi from 'joi'

import { Z, ZDef, ZSchema, ZType, ZValidator } from '../_internals'
import { unionizeHints } from '../utils'

export class ZEnum<T extends [string, ...string[]]> extends Z<
  ZDef<{ Output: T[number]; Validator: ZSchema<Joi.StringSchema> }, { values: T }>
> {
  readonly name = ZType.Enum
  protected readonly _hint = unionizeHints(...this._props.values.map(value => `'${value}'`).sort())

  get values(): T {
    return this._props.values
  }

  get enum(): {
    [K in keyof T]: T[K]
  } {
    return this._props.values.reduce(
      (acc, value) => ({ ...acc, [value]: value }),
      {} as {
        [K in keyof T]: T[K]
      }
    )
  }

  static create = <T extends [string, ...string[]]>(values: T): ZEnum<T> =>
    new ZEnum({ validator: ZValidator.string().valid(...values), hooks: {} }, { values })
}
