import type Joi from 'joi'

import { type ZManifestObject,Z, ZJoi, ZType } from '../_internals'

/* -------------------------------------------------------------------------- */
/*                                  ZBoolean                                  */
/* -------------------------------------------------------------------------- */

export class ZBoolean extends Z<{
  Output: boolean
  Input: boolean
  Schema: Joi.BooleanSchema
}> {
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

  /* ------------------------------------------------------------------------ */

  static create = (): ZBoolean =>
    new ZBoolean(
      {
        schema: ZJoi.boolean().preferences({ abortEarly: true }),
        manifest: {
          type: 'boolean',
        },
        hooks: {},
      },
      {}
    )
}

/* ---------------------------------- ZTrue --------------------------------- */

export class ZTrue extends Z<{
  Output: true
  Input: true
  Schema: Joi.BooleanSchema
}> {
  readonly name = ZType.True
  protected readonly _hint = 'true'

  /* ------------------------------------------------------------------------ */

  static $_create = (parent: ZBoolean): ZTrue =>
    new ZTrue(
      {
        schema: parent._schema.get().valid(true),
        manifest: parent._manifest.get() as ZManifestObject<true>,
        hooks: parent._hooks.get(),
      },
      {}
    )

  static create = (): ZTrue => this.$_create(ZBoolean.create())
}

/* --------------------------------- ZFalse --------------------------------- */

export class ZFalse extends Z<{
  Output: false
  Input: false
  Schema: Joi.BooleanSchema
}> {
  readonly name = ZType.False
  protected readonly _hint = 'false'

  /* ------------------------------------------------------------------------ */

  static $_create = (parent: ZBoolean): ZFalse =>
    new ZFalse(
      {
        schema: parent._schema.get().valid(false),
        manifest: parent._manifest.get() as ZManifestObject<false>,
        hooks: parent._hooks.get(),
      },
      {}
    )

  static create = (): ZFalse => this.$_create(ZBoolean.create())
}
