import { Z, ZType } from '../_internals'

/* -------------------------------------------------------------------------- */
/*                                    ZAny                                    */
/* -------------------------------------------------------------------------- */

export class ZAny extends Z<{
  TypeName: ZType.Any
  Output: any
  Input: any
}> {
  protected readonly _typeName = ZType.Any
  protected readonly _hint = 'any'

  /* ------------------------------------------------------------------------ */

  static create = (): ZAny =>
    new ZAny({
      checks: [{ validate: (value, { OK }) => OK(value) }],
      manifest: {},
      hooks: {},
    })
}
