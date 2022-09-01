import Joi from 'joi'

import type { ZDef } from '../def'
import { ZType } from '../type'
import { Z } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZBoolean                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZBooleanDef = ZDef<{ type: ZType.Boolean; validator: Joi.Schema<boolean> }>

export class ZBoolean extends Z<boolean, ZBooleanDef> {
  readonly name = 'boolean'

  truthy(): ZTrue {
    return ZTrue.create()
  }

  falsy(): ZFalse {
    return ZFalse.create()
  }

  static create = (): ZBoolean => {
    return new ZBoolean({
      type: ZType.Boolean,
      validator: Joi.boolean().required(),
    })
  }
}

/* ------------------------------------------------------ ZTrue ----------------------------------------------------- */

export class ZTrue extends Z<true, ZBooleanDef> {
  readonly name = 'true'

  static create = (): ZTrue => {
    return new ZTrue({
      type: ZType.Boolean,
      validator: Joi.boolean().strict().valid(true).required(),
    })
  }
}

/* ----------------------------------------------------- ZFalse ----------------------------------------------------- */

export class ZFalse extends Z<false, ZBooleanDef> {
  readonly name = 'false'

  static create = (): ZFalse => {
    return new ZFalse({
      type: ZType.Boolean,
      validator: Joi.boolean().strict().valid(false).required(),
    })
  }
}
