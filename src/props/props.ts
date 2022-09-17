import type { BaseZ, ZDef, ZProps } from '../_internals'

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
    this.$_schema.$_terms.metas[0].update({ _props: fn(this.$_props) })
    return this
  }
}
