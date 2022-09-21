import {
  type AnyZIssueCode,
  type ZDef,
  Z_ISSUE_MAP,
  ZSchemaManager,
} from '../_internals'
import { ObjectUtils } from '../utils/objects'
import type { TypeUtils } from '../utils/types'

/* -------------------------------------------------------------------------- */
/*                             ZPreferencesManager                            */
/* -------------------------------------------------------------------------- */

export type ZPreferencesObject = {
  /**
   * When `true`, stops parsing on the first error,
   * otherwise returns all the errors found.
   *
   * @default false
   */
  abortEarly?: boolean
  /**
   * When `true`, attempts to cast values to the required types,
   * e.g., a string to a number.
   *
   * @default true
   */
  convert?: boolean
  /**
   * Overrides individual error messages. Defaults to no override (`{}`).
   */
  messages?: Record<AnyZIssueCode, string>
  /**
   * When `true`, inputs are shallow cloned to include non-enumerables properties.
   *
   * @default true
   */
  nonEnumerables?: boolean
}

const DEFAULT_PREFERENCES: TypeUtils.RequiredDeep<ZPreferencesObject> = {
  abortEarly: false,
  convert: true,
  messages: Z_ISSUE_MAP,
  nonEnumerables: true,
}

const _getDefaultPreferences = () => ObjectUtils.cloneDeep(DEFAULT_PREFERENCES)

export interface ZPreferencesManager {
  get(): ZPreferencesObject
  update(prefs: TypeUtils.PartialDeep<ZPreferencesObject>): this
}

export const ZPreferencesManager = <Def extends ZDef>(
  schema: ZSchemaManager<Def>
): ZPreferencesManager => {
  let $_preferences = _getDefaultPreferences()

  return {
    get(): TypeUtils.ReadonlyDeep<ZPreferencesObject> {
      return ObjectUtils.cloneDeep($_preferences)
    },
    update(prefs: TypeUtils.PartialDeep<ZPreferencesObject>) {
      $_preferences = ObjectUtils.mergeDeepSafe($_preferences, prefs)
      schema.$_updatePreferences($_preferences)
      return this
    },
  }
}
