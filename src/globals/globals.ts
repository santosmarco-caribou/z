import { PartialDeep } from 'type-fest'

import { AnyZIssueCode, Z_ISSUE_MAP } from '../_internals'
import { mergeObjsAndArrays } from '../utils'

/* -------------------------------------------------------------------------- */
/*                                  ZGlobals                                  */
/* -------------------------------------------------------------------------- */

export type ZGlobalsOptions = {
  /**
   * Whether to disable colors on the `ZType` hints.
   *
   * @default false
   */
  stripColorsOnHints: boolean
  errorMessages: Record<AnyZIssueCode, string>
}

export class ZGlobals {
  private static _instance?: ZGlobals

  readonly options: ZGlobalsOptions = {
    stripColorsOnHints: false,
    errorMessages: Z_ISSUE_MAP,
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  setOptions(opts: PartialDeep<ZGlobalsOptions>): this {
    mergeObjsAndArrays(this.options, opts)
    return this
  }

  /* ------------------------------------------------------------------------ */

  static get = (): ZGlobals => {
    if (!ZGlobals._instance) {
      ZGlobals._instance = new ZGlobals()
    }
    return ZGlobals._instance
  }
}
