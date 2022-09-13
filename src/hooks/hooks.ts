import type { AnyZDef, ParseResult, ZOutput } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZHooks                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZHookMap<Def extends AnyZDef> = {
  beforeParse(input: unknown): any
  afterParse(input: ParseResult<ZOutput<Def>>['value']): ZOutput<Def>
}

export type ZHookName<Def extends AnyZDef = AnyZDef> = keyof ZHookMap<Def>
export type ZHookHandler<Def extends AnyZDef, Name extends ZHookName<Def>> = ZHookMap<Def>[Name]

export type ZHooksObject<Def extends AnyZDef> = {
  [Name in ZHookName]?: ZHookHandler<Def, Name>[]
}
export type ZHooksReadonlyObjectDeep<Def extends AnyZDef> = {
  readonly [Name in ZHookName]: readonly ZHookHandler<Def, Name>[]
}

/* ------------------------------------------------------------------------------------------------------------------ */

export class ZHooks<Def extends AnyZDef> {
  private _hooks: ZHooksObject<Def> = {
    beforeParse: [],
    afterParse: [],
  }

  protected get hooks(): ZHooksReadonlyObjectDeep<Def> {
    return this._hooks as ZHooksReadonlyObjectDeep<Def>
  }

  protected _addHook<T extends ZHookName>(name: T, handler: ZHookHandler<Def, T>): this {
    if (!this._hooks[name]) this._hooks[name] = [handler]
    else this._hooks[name]?.push(handler)
    return this
  }
}
