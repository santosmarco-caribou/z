import { cloneDeep } from 'lodash'

import type { BaseZ, ZDef, ZProps } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                    ZPropsManager                                                   */
/* ------------------------------------------------------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ZPropsManager<Def extends ZDef> extends BaseZ<Def> {}

export class ZPropsManager<Def extends ZDef> {
  protected _getProps(): ZProps<Def> {
    return this._meta._props as ZProps<Def>
  }

  protected _getProp<P extends keyof ZProps<Def>>(prop: P): ZProps<Def>[P] {
    return cloneDeep(this._getProps())[prop]
  }

  protected _updateProps(fn: (props: Readonly<ZProps<Def>>) => ZProps<Def>): this {
    this._meta.update({ _props: fn(this._getProps()) })
    return this
  }
}
