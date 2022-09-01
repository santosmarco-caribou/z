import Joi from 'joi'
import type { F } from 'ts-toolbelt'

import type { ZDef } from '../def'
import { ZType } from '../type'
import type { ZUtils } from '../utils'
import { ZTuple } from './tuple'
import { ZUnknown } from './unknown'
import { AnyZ, Z, ZInput, ZOutput } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZFunction                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZFunctionDef<P extends AnyZ[], R extends AnyZ> = ZDef<
  { validator: Joi.FunctionSchema },
  { parameters: ZTuple<P>; returnType: R }
>

export class ZFunction<P extends AnyZ[], R extends AnyZ> extends Z<
  F.Function<ZUtils.MapToZOutput<P>, ZOutput<R>>,
  ZFunctionDef<P, R>,
  F.Function<ZUtils.MapToZInput<P>, ZInput<R>>
> {
  readonly name = ZType.Function
  readonly hint = `(${this._def.parameters.elements.map((z, idx) => `args_${idx}: ${z.hint}`).join(', ')}) => ${
    this._def.returnType.hint
  }`

  get parameters(): ZTuple<P> {
    return this._def.parameters
  }
  get returnType(): R {
    return this._def.returnType
  }

  /**
   * Requires the function to have a certain set of parameters.
   *
   * @param {AnyZ[]} parameters The schemas of the function's parameters.
   */
  arguments<T extends AnyZ[]>(parameters: F.Narrow<T>): ZFunction<T, R> {
    return ZFunction.create(parameters, this._def.returnType)
  }
  /**
   * {@inheritDoc ZFunction#arguments}
   */
  args<T extends AnyZ[]>(parameters: F.Narrow<T>): ZFunction<T, R> {
    return this.arguments(parameters)
  }

  /**
   * Requires the function to return a certain type.
   *
   * @param {AnyZ} returnType The schema of the function's return type.
   */
  returns<T extends AnyZ>(returnType: T): ZFunction<P, T> {
    return ZFunction.create(this._def.parameters.elements as F.Narrow<P>, returnType)
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create: {
    <P extends AnyZ[], R extends AnyZ>(parameters: F.Narrow<P>, returnType: R): ZFunction<P, R>
    (): ZFunction<[], ZUnknown>
  } = <P extends AnyZ[], R extends AnyZ>(
    parameters?: F.Narrow<P>,
    returnType?: R
  ): ZFunction<P, R> | ZFunction<[], ZUnknown> => {
    const validator = Joi.function().required()

    if (parameters && returnType) {
      return new ZFunction({
        validator,
        parameters: ZTuple.create(parameters),
        returnType: returnType,
      })
    } else {
      return new ZFunction({
        validator,
        parameters: ZTuple.create([]),
        returnType: ZUnknown.create(),
      })
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------ */

export type AnyZFunction = ZFunction<AnyZ[], AnyZ>
