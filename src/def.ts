import type { A } from 'ts-toolbelt'

import type { AnyZSchema } from './validation/validator'

export type ZDefBase = {
  validator: AnyZSchema
}

export type ZDefExtras = Record<string, any> | A.x

export type ZDef<Base extends ZDefBase, Extras extends ZDefExtras = A.x> = Extras extends A.x ? Base : Extras & Base

export type AnyZDef = ZDef<{ validator: AnyZSchema }>
