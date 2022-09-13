import type Joi from 'joi'

import { type ZDef, Z, ZSchema, ZType, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZBoolean                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZBoolean extends Z<ZDef<{ Output: boolean; Validator: ZSchema<Joi.BooleanSchema> }>> {
  readonly name = ZType.Boolean
  readonly hint = 'boolean'

  /**
   * Requires the boolean to be `true`.
   */
  true(): ZTrue {
    return ZTrue.$_create(this)
  }
  /**
   * Requires the boolean to be `false`.
   */
  false(): ZFalse {
    return ZFalse.$_create(this)
  }

  static create = (): ZBoolean => new ZBoolean({ validator: ZValidator.boolean() }, {})
}

/* ------------------------------------------------------ ZTrue ----------------------------------------------------- */

export class ZTrue extends Z<ZDef<{ Output: true; Validator: ZSchema<Joi.BooleanSchema> }>> {
  readonly name = ZType.True
  readonly hint = 'true'

  static $_create = (parent: ZBoolean): ZTrue => new ZTrue({ validator: parent._validator.valid(true) }, {})

  static create = (): ZTrue => this.$_create(ZBoolean.create())
}

/* ----------------------------------------------------- ZFalse ----------------------------------------------------- */

export class ZFalse extends Z<ZDef<{ Output: false; Validator: ZSchema<Joi.BooleanSchema> }>> {
  readonly name = ZType.False
  readonly hint = 'false'

  static $_create = (parent: ZBoolean): ZFalse => new ZFalse({ validator: parent._validator.valid(false) }, {})

  static create = (): ZFalse => this.$_create(ZBoolean.create())
}
