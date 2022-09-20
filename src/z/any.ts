import { createZIssueMap, Z, ZType } from '../_internals'

/* -------------------------------------------------------------------------- */
/*                                    ZAny                                    */
/* -------------------------------------------------------------------------- */

const ZAnyIssueMap = createZIssueMap(ZType.Any, {
  base: 'should have passed parsing, but an unknown error occurred.',
})

export class ZAny extends Z<{
  TypeName: ZType.Any
  Output: any
  Input: any
}> {
  protected readonly _typeName = ZType.Any
  protected readonly _issueMap = ZAnyIssueMap
  protected readonly _hint = 'any'

  /* ------------------------------------------------------------------------ */

  static create = (): ZAny =>
    new ZAny({
      checks: [{ validate: (value, { OK, FAIL }) => value === 2 ? FAIL('') : OK(value) }],
      manifest: {},
      hooks: {},
    })
}
