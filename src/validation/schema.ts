import Joi from 'joi'

import type { ZDef } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                  ZSchemaController                                                 */
/* ------------------------------------------------------------------------------------------------------------------ */

export interface ZSchemaController<Def extends ZDef> {
  get(): Def['Schema']
  update(fn: (curr: Def['Schema']) => Def['Schema']): this
  updatePreferences(prefs: Joi.ValidationOptions): this
}

export const ZSchemaController = <Def extends ZDef>(schema: Def['Schema']): ZSchemaController<Def> => {
  let $_schema = schema

  return {
    get(): Def['Schema'] {
      return $_schema
    },
    update(fn: (curr: Def['Schema']) => Def['Schema']) {
      $_schema = fn($_schema)
      return this
    },
    updatePreferences(prefs: Joi.ValidationOptions) {
      this.update(s => s.preferences(prefs))
      return this
    },
  }
}
