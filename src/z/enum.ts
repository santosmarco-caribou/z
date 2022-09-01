import Joi from 'joi'
import type { F } from 'ts-toolbelt'

import type { ZDef } from '../def'
import { ZType } from '../type'
import { Z } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZEnum                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZEnumDef<T extends string> = ZDef<{ validator: Joi.StringSchema }, { values: T[] }>

export class ZEnum<T extends string> extends Z<T, ZEnumDef<T>> {
  readonly name = ZType.Enum
  readonly hint = this._def.values.map(value => `'${value}'`).join(' | ')

  get values(): T[] {
    return this._def.values
  }

  static create = <T extends string>(...values: F.Narrow<T>[]): ZEnum<T> => {
    return new ZEnum({
      validator: Joi.string()
        .strict()
        .valid(...values)
        .required(),
      values: values as T[],
    })
  }
}

/* ------------------------------------------------------------------------------------------------------------------ */

export type AnyZEnum = ZEnum<string>
