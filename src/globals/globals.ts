import { PartialDeep } from 'type-fest'

import { ZIssueCode, ZIssueMap } from '../_internals'
import { mergeObjsAndArrays } from '../utils'

/* -------------------------------------------------------------------------- */
/*                                  ZGlobals                                  */
/* -------------------------------------------------------------------------- */

export type ZGlobalsOptions = {
  errorMessages: Record<ZIssueCode, string>
}

export class ZGlobals {
  private static _instance?: ZGlobals

  readonly options: ZGlobalsOptions = {
    errorMessages: ZIssueMap,
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
