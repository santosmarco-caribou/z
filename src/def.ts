import type Joi from 'joi'
import type { A } from 'ts-toolbelt'

export type ZDefBase = {
  validator: Joi.Schema
}

export type ZDefExtras = Record<string, any> | A.x

export type ZDef<Base extends ZDefBase, Extras extends ZDefExtras = A.x> = Extras extends A.x ? Base : Extras & Base

export type AnyZDef = ZDef<{ validator: Joi.Schema }>
