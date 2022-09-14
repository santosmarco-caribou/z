import Joi from 'joi'

import { AnyZ, Z, ZDef, ZInput, ZOutput, ZSchema, ZTuple, ZType, ZUnknown, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZFunction                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZFunction<P extends readonly [AnyZ, ...AnyZ[]] | [], R extends AnyZ> extends Z<
  ZDef<
    {
      Output: (...args: ZOutput<ZTuple<P>>) => ZOutput<R>
      Input: (...args: ZInput<ZTuple<P>>) => ZInput<R>
      Validator: ZSchema<Joi.FunctionSchema>
    },
    { parameters: ZTuple<P>; returnType: R }
  >
> {
  readonly name = ZType.Function
  protected readonly _hint = `(${this._props.parameters.elements
    .map((z, idx) => `args_${idx}: ${z.hint}`)
    .join(', ')}) => ${this._props.returnType.hint}`

  get parameters(): ZTuple<P> {
    return this._props.parameters
  }
  get returnType(): R {
    return this._props.returnType
  }

  /**
   * Requires the function to have a certain set of parameters.
   *
   * @param parameters - parameters The schemas of the function's parameters.
   */
  arguments<T extends readonly [AnyZ, ...AnyZ[]] | []>(parameters: T): ZFunction<T, R> {
    return new ZFunction<T, R>(
      { validator: this._validator, hooks: this._hooks },
      { ...this._props, parameters: ZTuple.create(parameters) }
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
    return new ZFunction<P, T>({ validator: this._validator, hooks: this._hooks }, { ...this._props, returnType })
  }

  implement(fn: (...args: ZOutput<ZTuple<P>>) => ZOutput<R>): (...args: ZOutput<ZTuple<P>>) => ZOutput<R> {
    const validatedFn = (...args: ZOutput<ZTuple<P>>): ZOutput<R> => {
      const validatedArgs = this._props.parameters.parse(args)
      return this._props.returnType.parse(fn(...validatedArgs))
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
    const validator = ZValidator.function()
    if (parameters && returnType) {
      return new ZFunction<P, R>(
        { validator, hooks: {} },
        { parameters: ZTuple.create(parameters), returnType: returnType }
      )
    }
    return new ZFunction<[], ZUnknown>(
      { validator, hooks: {} },
      { parameters: ZTuple.create([]), returnType: ZUnknown.create() }
    )
  }
}
