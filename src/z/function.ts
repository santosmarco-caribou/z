import Joi from 'joi'

import {
  type _ZInput,
  type _ZOutput,
  type AnyZ,
  type ZManifestObject,
  Z,
  ZJoi,
  ZTuple,
  ZType,
  ZUnknown,
} from '../_internals'
import { MapToZOutput } from '../utils'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZFunction                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZFunction<P extends readonly [AnyZ, ...AnyZ[]] | [], R extends AnyZ> extends Z<{
  Output: (...args: _ZOutput<ZTuple<P>>) => _ZOutput<R>
  Input: (...args: _ZInput<ZTuple<P>>) => _ZInput<R>
  Schema: Joi.FunctionSchema
  Parameters: ZTuple<P>
  ReturnType: R
}> {
  readonly name = ZType.Function
  protected readonly _hint = `(${this._getProp('parameters')
    .elements.map((z, idx) => `args_${idx}: ${z.hint}`)
    .join(', ')}) => ${this._getProp('returnType').hint}`

  get parameters(): ZTuple<P> {
    return this._getProp('parameters')
  }
  get returnType(): R {
    return this._getProp('returnType')
  }

  /**
   * Requires the function to have a certain set of parameters.
   *
   * @param parameters - parameters The schemas of the function's parameters.
   */
  arguments<T extends readonly [AnyZ, ...AnyZ[]] | []>(parameters: T): ZFunction<T, R> {
    return new ZFunction<T, R>(
      {
        schema: this.$_schema,
        manifest: this.$_manifest as ZManifestObject<(...args: MapToZOutput<T>) => _ZOutput<R>>,
        hooks: this._getHooks() as any,
      },
      { ...this._getProps(), parameters: ZTuple.create(parameters) }
    )
  }
  /**
   * {@inheritDoc ZFunction#arguments}
   */
  args<T extends readonly [AnyZ, ...AnyZ[]] | []>(parameters: T): ZFunction<T, R> {
    return this.arguments(parameters)
  }

  /**
   * Requires the function to return a certain type.
   *
   * @param returnType - The schema of the function's return type.
   */
  returns<T extends AnyZ>(returnType: T): ZFunction<P, T> {
    return new ZFunction<P, T>(
      {
        schema: this.$_schema,
        manifest: this.$_manifest,
        hooks: this._getHooks(),
      },
      { ...this._getProps(), returnType }
    )
  }

  implement(fn: (...args: _ZOutput<ZTuple<P>>) => _ZOutput<R>): (...args: _ZOutput<ZTuple<P>>) => _ZOutput<R> {
    const validatedFn = (...args: _ZOutput<ZTuple<P>>): _ZOutput<R> => {
      const validatedArgs = this._getProp('parameters').parse(args)
      return this._getProp('returnType').parse(fn(...validatedArgs))
    }
    return validatedFn
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create: {
    <P extends readonly [AnyZ, ...AnyZ[]] | [], R extends AnyZ>(parameters: P, returnType: R): ZFunction<P, R>
    (): ZFunction<[], ZUnknown>
  } = <P extends readonly [AnyZ, ...AnyZ[]] | [], R extends AnyZ>(
    parameters?: P,
    returnType?: R
  ): ZFunction<P, R> | ZFunction<[], ZUnknown> => {
    if (parameters && returnType) {
      return new ZFunction<P, R>(
        {
          schema: ZJoi.function(),
          manifest: {},
          hooks: {},
        },
        { parameters: ZTuple.create(parameters), returnType: returnType }
      )
    }
    return new ZFunction<[], ZUnknown>(
      {
        schema: ZJoi.function(),
        manifest: {},
        hooks: {},
      },
      { parameters: ZTuple.create([]), returnType: ZUnknown.create() }
    )
  }
}
