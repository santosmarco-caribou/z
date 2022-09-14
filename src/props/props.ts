import { merge } from 'lodash'

import type { AnyZDef, ZDependencies, ZProps } from '../_internals'
import { entries, hasProp, isArray } from '../utils'

export class ZPropsManager<Def extends AnyZDef> {
  private $_props: ZProps<Def>

  constructor(_: ZDependencies<Def>, props: ZProps<Def>) {
    this.$_props = props
  }

  protected get _props(): Readonly<ZProps<Def>> {
    return Object.freeze(this.$_props)
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  protected _updateProps(fn: (props: Readonly<ZProps<Def>>) => ZProps<Def>): this {
    const oldDef = this.$_props
    const newDef = fn(this._props)
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
