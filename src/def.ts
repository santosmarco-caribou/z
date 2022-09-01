import type Joi from 'joi'
import type { A } from 'ts-toolbelt'
import type { Merge } from 'type-fest'

import type { ZType } from './type'

export type ZDefBase = {
  type: ZType
  validator: Joi.Schema
}

export type ZDefExtras = Record<string, any> | A.x

export type ZDef<Base extends ZDefBase, Extras extends ZDefExtras = A.x> = Extras extends A.x
  ? Base
  : Merge<Extras, Base>

export type AnyZDef = ZDef<{ type: ZType; validator: Joi.Schema }>
