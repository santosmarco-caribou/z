import Joi from 'joi'

import type { ZDef } from '../def'
import { ZType } from '../type'
import { Z } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZBoolean                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZBooleanDef = ZDef<{ validator: Joi.Schema<boolean> }>

export class ZBoolean extends Z<boolean, ZBooleanDef> {
  readonly name = ZType.Boolean
  readonly hint = 'boolean'

  truthy(): ZTrue {
    return ZTrue.create()
  }

  falsy(): ZFalse {
    return ZFalse.create()
  }

  static create = (): ZBoolean => {
    return new ZBoolean({
      validator: Joi.boolean().required(),
    })
  }
}

/* ------------------------------------------------------ ZTrue ----------------------------------------------------- */

export class ZTrue extends Z<true, ZBooleanDef> {
  readonly name = ZType.True
  readonly hint = 'true'

  static create = (): ZTrue => {
    return new ZTrue({
      validator: Joi.boolean().strict().valid(true).required(),
    })
  }
}

/* ----------------------------------------------------- ZFalse ----------------------------------------------------- */

export class ZFalse extends Z<false, ZBooleanDef> {
  readonly name = ZType.False
  readonly hint = 'false'

  static create = (): ZFalse => {
    return new ZFalse({
      validator: Joi.boolean().strict().valid(false).required(),
    })
  }
}
