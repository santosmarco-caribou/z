import { concat } from 'lodash'

import type { AnyZDef, ParseResult, ZDependencies, ZOutput } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZHooks                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZHookMap<Def extends AnyZDef> = {
  beforeParse(input: unknown): any
  afterParse(input: ParseResult<ZOutput<Def>, Def>['value']): ZOutput<Def>
}

export type ZHookTrigger<Def extends AnyZDef = AnyZDef> = keyof ZHookMap<Def>
export type ZHookHandler<Def extends AnyZDef, Trigger extends ZHookTrigger<Def>> = ZHookMap<Def>[Trigger]
export type ZHook<Def extends AnyZDef, Trigger extends ZHookTrigger<Def>> = {
  name: string
  handler: ZHookHandler<Def, Trigger>
}

export type ZHooksObject<Def extends AnyZDef> = {
  [T in ZHookTrigger]?: ZHook<Def, T>[]
}
export type ZHooksReadonlyObjectDeep<Def extends AnyZDef> = {
  readonly [T in ZHookTrigger]: readonly ZHook<Def, T>[]
}

/* ------------------------------------------------------------------------------------------------------------------ */

export class ZHooks<Def extends AnyZDef> {
  protected _hooks: ZHooksObject<Def> = {}

  constructor(deps: ZDependencies<Def>) {
    this._hooks = {
      beforeParse: concat(this._hooks.beforeParse ?? [], deps.hooks.beforeParse ?? []),
      afterParse: concat(this._hooks.afterParse ?? [], deps.hooks.afterParse ?? []),
    }
  }

  protected get hooks(): ZHooksReadonlyObjectDeep<Def> {
    return this._hooks as ZHooksReadonlyObjectDeep<Def>
  }

  protected _addHook<T extends ZHookTrigger>(trigger: T, hook: ZHook<Def, T>): this {
    if (!this._hooks[trigger]) {
      this._hooks[trigger] = []
    }
    this._hooks[trigger]?.push(hook)
    return this
  }

  protected _removeHook<T extends ZHookTrigger>(trigger: T, name: string): this {
    if (trigger === 'beforeParse') this._hooks.beforeParse = this._hooks.beforeParse?.filter(hook => hook.name !== name)
    else this._hooks.afterParse = this._hooks.afterParse?.filter(hook => hook.name !== name)
    return this
  }
}
