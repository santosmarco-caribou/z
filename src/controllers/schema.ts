import Joi from 'joi'
import { cloneDeep } from 'lodash'

import {
  _ZOutput,
  ParseOptions,
  Z_ISSUE_MAP,
  ZDef,
  ZGlobals,
  ZHooksController,
} from '../_internals'
import { mergeSafe } from '../utils'

/* -------------------------------------------------------------------------- */
/*                              ZSchemaController                             */
/* -------------------------------------------------------------------------- */

export const DEFAULT_VALIDATION_OPTIONS: Joi.ValidationOptions &
  Required<ParseOptions> = {
  abortEarly: true,
  messages: Z_ISSUE_MAP,
}

export interface ZSchemaController<Def extends ZDef> {
  get(): Def['Schema']
  update(fn: (curr: Def['Schema']) => Def['Schema']): this
  updatePreferences(prefs: Joi.ValidationOptions): this
  createValidator(
    hooksController: ZHooksController<Def>
  ): (
    input: unknown,
    options: ParseOptions | undefined
  ) => Joi.ValidationResult<_ZOutput<Def>>
}

export const ZSchemaController = <Def extends ZDef>(
  schema: Def['Schema']
): ZSchemaController<Def> => {
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

    createValidator(hooksController: ZHooksController<Def>) {
      return (
        input: unknown,
        options: ParseOptions | undefined
      ): Joi.ValidationResult<_ZOutput<Def>> => {
        const mergedOpts = mergeSafe(
          { messages: cloneDeep(ZGlobals.get().options.errorMessages) },
          options ?? {}
        )

        const clonedInput = cloneDeep(input)
        const _input = hooksController.apply('beforeParse', clonedInput)

        const result = $_schema.validate(
          _input,
          mergedOpts
        ) as Joi.ValidationResult<_ZOutput<Def>>

        if (result.value) {
          const clonedResult = cloneDeep(result.value)
          const _output = hooksController.apply('afterParse', clonedResult)
          return { ...result, value: _output }
        }

        return result
      }
    },
  }
}
