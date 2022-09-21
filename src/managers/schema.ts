import Joi from 'joi'

import {
  _ZOutput,
  ParseOptions,
  ZDef,
  ZGlobals,
  ZHooksManager,
  ZPreferencesManager,
} from '../_internals'
import { ObjectUtils } from '../utils/objects'

/* -------------------------------------------------------------------------- */
/*                               ZSchemaManager                               */
/* -------------------------------------------------------------------------- */

export const DEFAULT_VALIDATION_OPTIONS: Joi.ValidationOptions &
  Required<ParseOptions> = {
  abortEarly: false,
}

export interface ZSchemaManager<Def extends ZDef> {
  get(): Def['Schema']
  update(fn: (curr: Def['Schema']) => Def['Schema']): this
  $_updatePreferences(prefs: Joi.ValidationOptions): this
  createValidator(
    prefs: ZPreferencesManager,
    hooks: ZHooksManager<Def>
  ): (
    input: unknown,
    options: ParseOptions | undefined
  ) => Joi.ValidationResult<_ZOutput<Def>>
}

export const ZSchemaManager = <Def extends ZDef>(
  schema: Def['Schema']
): ZSchemaManager<Def> => {
  let $_schema = schema

  return {
    get(): Def['Schema'] {
      return $_schema
    },

    update(fn: (curr: Def['Schema']) => Def['Schema']) {
      $_schema = fn($_schema)
      return this
    },

    createValidator(
      prefs: ZPreferencesManager,
      hooks: ZHooksManager<Def>
    ): (
      input: unknown,
      options: ParseOptions | undefined
    ) => Joi.ValidationResult<_ZOutput<Def>> {
      return (
        input: unknown,
        options: ParseOptions | undefined
      ): Joi.ValidationResult<_ZOutput<Def>> => {
        const mergedOpts = ObjectUtils.mergeDeepSafe(
          { messages: ZGlobals.get().preferences().messages },
          prefs.get(),
          options ?? {}
        )

        const _input = hooks.apply('beforeParse', input)

        const result = $_schema.validate(
          _input,
          mergedOpts
        ) as Joi.ValidationResult<_ZOutput<Def>>

        if (result.value) {
          const _output = hooks.apply('afterParse', result.value)
          return { ...result, value: _output }
        }

        return result
      }
    },

    /**
     * Intended to be used by the `PreferencesManager` only.
     *
     * @internal
     */
    $_updatePreferences(prefs: Joi.ValidationOptions) {
      this.update(s => s.preferences(prefs))
      return this
    },
  }
}
