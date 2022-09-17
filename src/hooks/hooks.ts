import type { _ZOutput, BaseZ, ZDef } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZHooks                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZHookTrigger = 'beforeParse' | 'afterParse'

export type ZHookHandler<Def extends ZDef, Trigger extends ZHookTrigger> = {
  beforeParse: (input: unknown) => any
  afterParse: (input: _ZOutput<Def>) => any
}[Trigger]

export type ZHook<Def extends ZDef, Trigger extends ZHookTrigger> = {
  name: string
  handler: ZHookHandler<Def, Trigger>
}

export type ZHooksObject<Def extends ZDef> = {
  beforeParse: ZHook<Def, 'beforeParse'>[]
  afterParse: ZHook<Def, 'afterParse'>[]
}

/* ------------------------------------------------------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ZHooks<Def extends ZDef> extends BaseZ<Def> {}

export class ZHooks<Def extends ZDef> {
  protected _addHook<T extends ZHookTrigger>(trigger: T, hook: ZHook<Def, T>): this {
    const hooks = this.$_hooks[trigger]
    hooks.push(hook as any)
    return this
  }

  protected _removeHook<T extends ZHookTrigger>(trigger: T, name: string): this {
    if (trigger === 'beforeParse')
      this.$_hooks.beforeParse = this.$_hooks.beforeParse?.filter(hook => hook.name !== name)
    else this.$_hooks.afterParse = this.$_hooks.afterParse?.filter(hook => hook.name !== name)
    return this
  }
}
