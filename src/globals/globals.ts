import { type AnyZIssueCode, Z_ISSUE_MAP } from '../_internals'
import { ObjectUtils } from '../utils/objects'
import type { TypeUtils } from '../utils/types'

/* -------------------------------------------------------------------------- */
/*                                  ZGlobals                                  */
/* -------------------------------------------------------------------------- */

export type ZGlobalsPreferences = {
  messages: Record<AnyZIssueCode, string>
}

export class ZGlobals {
  private static _instance?: ZGlobals

  private _preferences: ZGlobalsPreferences = {
    messages: Z_ISSUE_MAP,
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  preferences(
    prefs?: TypeUtils.PartialDeep<ZGlobalsPreferences>
  ): TypeUtils.ReadonlyDeep<ZGlobalsPreferences> {
    if (prefs) {
      this._preferences = ObjectUtils.mergeDeepSafe(this._preferences, prefs)
    }
    return ObjectUtils.cloneDeep(this._preferences)
  }

  /* ------------------------------------------------------------------------ */

  static get = (): ZGlobals => {
    if (!ZGlobals._instance) {
      ZGlobals._instance = new ZGlobals()
    }
    return ZGlobals._instance
  }
}
