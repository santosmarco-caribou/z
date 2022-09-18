import Joi from 'joi'
import { nanoid } from 'nanoid'

import { type _ZInput, type _ZOutput, type AnyZ, Z, ZType } from '../_internals'

/* -------------------------------------------------------------------------- */
/*                                  ZEffects                                  */
/* -------------------------------------------------------------------------- */

/* ------------------------------- Preprocess ------------------------------- */

export class ZPreprocess<T extends AnyZ> extends Z<{
  Output: _ZOutput<T>
  Input: _ZInput<T>
  Schema: Joi.AnySchema
  TargetType: T
  HookName: string
}> {
  readonly name = ZType.Preprocess
  protected readonly _hint = this._props.getOne('targetType').hint

  /* ------------------------------------------------------------------------ */

  static create = <T extends AnyZ>(
    preprocess: (arg: unknown) => _ZInput<T>,
    type: T
  ): ZPreprocess<T> => {
    const hookName = `preprocess-${nanoid()}`
    return new ZPreprocess(
      {
        schema: type._schema.get(),
        manifest: type._manifest.get(),
        hooks: {
          ...type._hooks.get(),
          beforeParse: [
            ...type._hooks.getByTrigger('beforeParse'),
            {
              name: hookName,
              handler: preprocess,
            },
          ],
          afterParse: type._hooks.get().afterParse,
        },
      },
      { targetType: type, hookName }
    )
  }
}

/* ------------------------------- ZTransform ------------------------------- */

export class ZTransform<T extends AnyZ, NewOutput = _ZOutput<T>> extends Z<{
  Output: NewOutput
  Input: _ZInput<T>
  Schema: Joi.AnySchema
  InnerType: T
  HookName: string
}> {
  readonly name = ZType.Transform
  protected readonly _hint = `Transformed<${
    this._props.getOne('innerType').hint
  }>`

  revert(): T {
    this._hooks.remove('afterParse', this._props.getOne('hookName'))
    return this._props.getOne('innerType')
  }

  /* ------------------------------------------------------------------------ */

  static create = <T extends AnyZ, NewOutput>(
    innerType: T,
    transform: (arg: _ZOutput<T>) => NewOutput
  ): ZTransform<T, NewOutput> => {
    const hookName = `transform-${nanoid()}`
    return new ZTransform(
      {
        schema: innerType._schema.get(),
        manifest: innerType._manifest.get(),
        hooks: {
          ...innerType._hooks.get(),
          afterParse: [
            ...innerType._hooks.getByTrigger('afterParse'),
            {
              name: hookName,
              handler: transform,
            },
          ],
        },
      },
      { innerType, hookName }
    )
  }
}
