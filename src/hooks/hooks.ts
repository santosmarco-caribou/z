import type { _ZOutput, BaseZ, ZDef } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZHooks                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZHook<I = any, O = any> = {
  name: string
  handler: (input: I) => O
}

export type ZHooksObject<Def extends ZDef> = {
  beforeParse: ZHook[]
  afterParse: ZHook<_ZOutput<Def>>[]
}

/* ------------------------------------------------------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ZHooks<Def extends ZDef> extends BaseZ<Def> {}

export class ZHooks<Def extends ZDef> {
  protected _addHook<T extends keyof ZHooksObject<Def>>(trigger: T, hook: ZHook<Def, T>): this {
    this.$_schema.$_terms.metas[0].update({
      _hooks: { [trigger]: this.$_hooks[trigger].some(h => h.name === hook.name) ? [] : [hook] },
    })
    return this
  }

  protected _removeHook<T extends keyof ZHooksObject<Def>>(trigger: T, name: string): this {
    this.$_schema.$_terms.metas[0]._hooks[trigger] = this.$_schema.$_terms.metas[0]._hooks[trigger].filter(
      h => h.name !== name
    )
    return this
  }
}
