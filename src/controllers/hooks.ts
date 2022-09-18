import type { _ZOutput, ZDef } from '../_internals'

/* -------------------------------------------------------------------------- */
/*                              ZHooksController                              */
/* -------------------------------------------------------------------------- */

export type ZHook<I = any, O = any> = {
  readonly name: string
  handler(input: I): O
}

export type ZHooksObject<Def extends ZDef> = {
  readonly beforeParse: ZHook[]
  readonly afterParse: ZHook<_ZOutput<Def>>[]
}

export type AnyZHooksObject = ZHooksObject<ZDef>

/* -------------------------------------------------------------------------- */

export interface ZHooksController<Def extends ZDef> {
  get(): ZHooksObject<Def>
  getByTrigger<T extends keyof ZHooksObject<Def>>(
    trigger: T
  ): ZHooksObject<Def>[T]
  add<T extends keyof ZHooksObject<Def>>(
    trigger: T,
    hook: ZHooksObject<Def>[T][number]
  ): this
  remove<T extends keyof ZHooksObject<Def>>(trigger: T, hookName: string): this
  apply<T extends keyof ZHooksObject<Def>>(
    trigger: T,
    input: Parameters<ZHooksObject<Def>[T][number]['handler']>[0]
  ): Parameters<ZHooksObject<Def>[T][number]['handler']>[0]
}

export const ZHooksController = <Def extends ZDef>(
  hooks: ZHooksObject<Def>
): ZHooksController<Def> => {
  const $_hooks = hooks

  return {
    get(): ZHooksObject<Def> {
      return $_hooks
    },
    getByTrigger<T extends keyof ZHooksObject<Def>>(
      trigger: T
    ): ZHooksObject<Def>[T] {
      return $_hooks[trigger]
    },
    add<T extends keyof ZHooksObject<Def>>(
      trigger: T,
      hook: ZHooksObject<Def>[T][number]
    ) {
      const triggerHooks = this.getByTrigger(trigger)
      if (triggerHooks.some(t => t.name === hook.name)) return this
      $_hooks[trigger] = [...triggerHooks, hook]
      return this
    },
    remove<T extends keyof ZHooksObject<Def>>(trigger: T, hookName: string) {
      const triggerHooks = this.getByTrigger(trigger)
      $_hooks[trigger] = triggerHooks.filter(t => t.name !== hookName)
      return this
    },
    apply<T extends keyof ZHooksObject<Def>>(
      trigger: T,
      input: Parameters<ZHooksObject<Def>[T][number]['handler']>[0]
    ): ReturnType<ZHooksObject<Def>[T][number]['handler']> {
      const triggerHooks = this.getByTrigger(trigger)
      triggerHooks.forEach(hook => (input = hook.handler(input)))
      return input
    },
  }
}
