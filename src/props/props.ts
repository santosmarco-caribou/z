import { merge } from 'lodash'

import type { BaseZ, ZDef, ZProps } from '../_internals'
import { entries, hasProp, isArray } from '../utils'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                    ZPropsManager                                                   */
/* ------------------------------------------------------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ZPropsManager<Def extends ZDef> extends BaseZ<Def> {}

export class ZPropsManager<Def extends ZDef> {
  protected _getProp<P extends keyof ZProps<Def>>(prop: P): ZProps<Def>[P] {
    return this.$_props[prop]
  }

  protected _updateProps(fn: (props: Readonly<ZProps<Def>>) => ZProps<Def>): this {
    const oldDef = this.$_props
    const newDef = fn(this.$_props)
    merge(
      this.$_props,
      entries(newDef).reduce(
        (acc, [k, v]) => ({
          ...acc,
          [k]: isArray(v) ? [...(hasProp(oldDef, k) && isArray(oldDef[k]) ? oldDef[k] : []), ...v] : v,
        }),
        {}
      )
    )
    return this
  }
}
