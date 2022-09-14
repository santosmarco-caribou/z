import type Joi from 'joi'

import { type ZDef, Z, ZSchema, ZType, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZBoolean                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZBoolean extends Z<ZDef<{ Output: boolean; Validator: ZSchema<Joi.BooleanSchema> }>> {
  readonly name = ZType.Boolean
  protected readonly _hint = 'boolean'

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

  static create = (): ZBoolean => new ZBoolean({ validator: ZValidator.boolean(), hooks: {} }, {})
}

/* ------------------------------------------------------ ZTrue ----------------------------------------------------- */

export class ZTrue extends Z<ZDef<{ Output: true; Validator: ZSchema<Joi.BooleanSchema> }>> {
  readonly name = ZType.True
  protected readonly _hint = 'true'

  static $_create = (parent: ZBoolean): ZTrue =>
    new ZTrue({ validator: parent._validator.valid(true), hooks: parent['_hooks'] }, {})

  static create = (): ZTrue => this.$_create(ZBoolean.create())
}

/* ----------------------------------------------------- ZFalse ----------------------------------------------------- */

export class ZFalse extends Z<ZDef<{ Output: false; Validator: ZSchema<Joi.BooleanSchema> }>> {
  readonly name = ZType.False
  protected readonly _hint = 'false'

  static $_create = (parent: ZBoolean): ZFalse =>
    new ZFalse({ validator: parent._validator.valid(false), hooks: parent['_hooks'] }, {})

  static create = (): ZFalse => this.$_create(ZBoolean.create())
}
