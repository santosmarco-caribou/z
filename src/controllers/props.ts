import { mergeWith } from 'lodash'

import type { ZDef, ZProps } from '../_internals'

/* -------------------------------------------------------------------------- */
/*                              ZPropsController                              */
/* -------------------------------------------------------------------------- */

export interface ZPropsController<Def extends ZDef> {
  getAll(): ZProps<Def>
  getOne<P extends keyof ZProps<Def>>(prop: P): ZProps<Def>[P]
  update(fn: (curr: ZProps<Def>) => ZProps<Def>): this
}

export const ZPropsController = <Def extends ZDef>(
  props: ZProps<Def>
): ZPropsController<Def> => {
  const $_props = props

  return {
    getAll(): ZProps<Def> {
      return $_props
    },
    getOne<P extends keyof ZProps<Def>>(prop: P): ZProps<Def>[P] {
      return $_props[prop]
    },
    update(fn: (curr: ZProps<Def>) => ZProps<Def>) {
      mergeWith($_props, fn($_props), (objValue, srcValue) =>
        Array.isArray(objValue) ? objValue.concat(srcValue) : undefined
      )
      return this
    },
  }
}
