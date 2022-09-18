import Joi from 'joi'

import { type _ZInput, type _ZOutput, type AnyZ, Z, ZJoi, ZType, ZValidator } from '../_internals'

export class ZPromise<T extends AnyZ> extends Z<{
  Output: Promise<_ZOutput<T>>
  Input: Promise<_ZInput<T>>
  Schema: Joi.AnySchema
  Awaited: T
}> {
  readonly name = ZType.Promise
  protected readonly _hint = `Promise<${this._props.getOne('awaited').hint}>`

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <T extends AnyZ>(awaited: T): ZPromise<T> =>
    new ZPromise(
      {
        schema: ZValidator.custom(ZJoi.any(), (value, { OK, FAIL }) => {
          console.log(value)
          if (!(value instanceof Promise)) return FAIL('promise.base')
          return OK(value.then(v => awaited.parse(v)))
        }),
        manifest: awaited._manifest.get(),
        hooks: awaited._hooks.get(),
      },
      { awaited }
    )
}
