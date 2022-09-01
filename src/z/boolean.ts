import Joi from 'joi'

import type { ZDef } from '../def'
import { ZType } from '../type'
import { Z } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZBoolean                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZBooleanDef = ZDef<{ validator: Joi.BooleanSchema }>

export class ZBoolean extends Z<boolean, ZBooleanDef> {
  readonly name = ZType.Boolean
  readonly hint = 'boolean'

  truthy(): ZTrue {
    return ZTrue.$_create(this._validator)
  }

  falsy(): ZFalse {
    return ZFalse.$_create(this._validator)
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

  static $_create = (previousValidator: Joi.BooleanSchema): ZTrue => {
    return new ZTrue({
      validator: previousValidator.strict().valid(true),
    })
  }

  static create = (): ZTrue => {
    return this.$_create(Joi.boolean().required())
  }
}

/* ----------------------------------------------------- ZFalse ----------------------------------------------------- */

export class ZFalse extends Z<false, ZBooleanDef> {
  readonly name = ZType.False
  readonly hint = 'false'

  static $_create = (previousValidator: Joi.BooleanSchema): ZFalse => {
    return new ZFalse({
      validator: previousValidator.strict().valid(false),
    })
  }

  static create = (): ZFalse => {
    return this.$_create(Joi.boolean().required())
  }
}
