import Joi from 'joi'
import type { F } from 'ts-toolbelt'
import type { Primitive } from 'type-fest'

import type { ZDef } from '../def'
import { ZType } from '../type'
import { Z } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZLiteral                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZLiteralDef<T extends Primitive> = ZDef<{ validator: Joi.AnySchema }, { value: T }>

export class ZLiteral<T extends Primitive> extends Z<T, ZLiteralDef<T>> {
  readonly name = ZType.Literal
  readonly hint = typeof this._def.value === 'string' ? `'${this._def.value}'` : String(this._def.value)

  get value(): T {
    return this._def.value
  }

  static create = <T extends Primitive>(value: F.Narrow<T>): ZLiteral<T> => {
    return new ZLiteral({
      validator: Joi.valid(value).required(),
      value: value as T,
    })
  }
}

/* ------------------------------------------------------------------------------------------------------------------ */

export type AnyZLiteral = ZLiteral<Primitive>
