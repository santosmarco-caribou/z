import type Joi from 'joi'

import { Z, ZJoi, ZType } from '../_internals'
import { toLowerCase, toUpperCase, unionizeHints } from '../utils'

/* -------------------------------------------------------------------------- */
/*                                    ZEnum                                   */
/* -------------------------------------------------------------------------- */

export class ZEnum<T extends [string, ...string[]]> extends Z<{
  Output: T[number]
  Input: T[number]
  Schema: Joi.AnySchema
  Values: T
}> {
  readonly name = ZType.Enum
  protected readonly _hint = unionizeHints(
    ...this._props
      .getOne('values')
      .map(value => `'${value}'`)
      .sort()
  )

  get values(): T {
    return this._props.getOne('values')
  }

  get enum(): {
    [K in keyof T]: T[K]
  } {
    return this._props.getOne('values').reduce(
      (acc, value) => ({ ...acc, [value]: value }),
      {} as {
        [K in keyof T]: T[K]
      }
    )
  }

  /* ------------------------------------------------------------------------ */

  uppercase(): ZEnum<{ [K in keyof T]: Uppercase<T[K]> }> {
    return this._transform(
      values => values.map(toUpperCase) as { [K in keyof T]: Uppercase<T[K]> }
    )
  }

  lowercase(): ZEnum<{ [K in keyof T]: Lowercase<T[K]> }> {
    return this._transform(
      values => values.map(toLowerCase) as { [K in keyof T]: Lowercase<T[K]> }
    )
  }

  /* ------------------------------------------------------------------------ */

  private _transform<_T extends [string, ...string[]]>(
    fn: (values: T) => _T
  ): ZEnum<_T> {
    const transformedValues = fn(this._props.getOne('values'))
    return new ZEnum<_T>(
      {
        schema: ZJoi.any().valid(...transformedValues),
        manifest: this._manifest.get(),
        hooks: this._hooks.get(),
      },
      { values: transformedValues }
    )
  }

  /* ------------------------------------------------------------------------ */

  static create = <T extends string, U extends [T, ...T[]]>(
    values: U
  ): ZEnum<U> =>
    new ZEnum(
      {
        schema: ZJoi.any().valid(...values),
        manifest: {},
        hooks: {},
      },
      { values: values }
    )
}

/* -------------------------------------------------------------------------- */

export type AnyZEnum = ZEnum<[string, ...string[]]>
