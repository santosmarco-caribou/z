import Joi from 'joi'
import type { F } from 'ts-toolbelt'

import type { ZDef } from '../def'
import { ZType } from '../type'
import { ZUtils } from '../utils'
import { ZEnum } from './enum'
import { AnyZ, Z, ZInput, ZOutput } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZObject                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type AnyZObjectShape = Record<string, AnyZ>

export type ZObjectDef<Shape extends AnyZObjectShape> = ZDef<
  { type: ZType.Object; validator: Joi.ObjectSchema },
  { shape: Shape }
>

export class ZObject<Shape extends AnyZObjectShape> extends Z<
  { [K in keyof Shape]: ZOutput<Shape[K]> },
  ZObjectDef<Shape>,
  { [K in keyof Shape]: ZInput<Shape[K]> }
> {
  readonly name = ZObjectHelpers.generateName(this._def.shape)

  get shape(): Shape {
    return this._def.shape
  }

  keyof(): ZEnum<Extract<keyof Shape, string>> {
    return ZEnum.create<Extract<keyof Shape, string>>(
      ...(Object.keys(this._def.shape) as F.Narrow<Extract<keyof Shape, string>>[])
    )
  }

  pick<K extends keyof Shape>(keys: K[]): ZObject<Pick<Shape, K>> {
    return ZObject.create(ZUtils.pick(this._def.shape, keys))
  }

  omit<K extends keyof Shape>(keys: K[]): ZObject<Omit<Shape, K>> {
    return ZObject.create(ZUtils.omit(this._def.shape, keys))
  }

  extend<S extends AnyZObjectShape>(incomingShape: S): ZObject<Shape & S> {
    return new ZObject({
      type: ZType.Object,
      validator: this._validator.append(ZObjectHelpers.zShapeToJoiShape(incomingShape)),
      shape: ZUtils.merge(this._def.shape, incomingShape),
    })
  }

  merge<S extends AnyZObjectShape>(incomingSchema: ZObject<S>): ZObject<Shape & S> {
    return this.extend(incomingSchema.shape)
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <Shape extends AnyZObjectShape>(shape: Shape): ZObject<Shape> => {
    return new ZObject({
      type: ZType.Object,
      validator: Joi.object(ZObjectHelpers.zShapeToJoiShape(shape)).required(),
      shape: shape,
    })
  }
}

export type AnyZObject = ZObject<AnyZObjectShape>

/* ------------------------------------------------------------------------------------------------------------------ */

class ZObjectHelpers {
  static generateName = <Shape extends AnyZObjectShape>(shape: Shape): string => {
    const _generateName = (shape: AnyZObjectShape, indentation = 2): string =>
      '{\n' +
      Object.entries(shape)
        .map(
          ([key, z]) =>
            `${' '.repeat(indentation)}${key}${z.isOptional() ? '?' : ''}: ${
              z instanceof ZObject ? _generateName(z.shape as AnyZObjectShape, indentation + 2) : z.name
            },`
        )
        .join('\n') +
      `\n${' '.repeat(indentation - 2)}}`

    return _generateName(shape)
  }

  static zShapeToJoiShape = <Shape extends AnyZObjectShape>(shape: Shape): Joi.SchemaMap => {
    return Object.fromEntries(Object.entries(shape).map(([key, z]) => [key, z._validator]))
  }
}
