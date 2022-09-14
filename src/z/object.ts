import type Joi from 'joi'
import { keys, merge, omit, pick } from 'lodash'
import type { L, O, U } from 'ts-toolbelt'

import {
  AnyZ,
  AnyZArray,
  Z,
  ZAny,
  ZArray,
  ZDef,
  ZEnum,
  ZOptional,
  ZReadonlyArray,
  ZSchema,
  ZType,
  ZValidator,
} from '../_internals'
import { deepFreeze, MapToZInput, MapToZOutput, WithQuestionMarks } from '../utils'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZObject                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

const MAKE_OBJECT_READONLY_HOOK = 'makeObjectReadonly'
const MAKE_OBJECT_DEEPLY_READONLY_HOOK = 'makeObjectDeeplyReadonly'

export type AnyZObjectShape = Record<string, AnyZ>

export type ZObjectOptions = { mode: 'passthrough' | 'strip' | 'strict' }

export class ZObject<Shape extends AnyZObjectShape> extends Z<
  ZDef<
    {
      Output: WithQuestionMarks<MapToZOutput<Shape>>
      Input: WithQuestionMarks<MapToZInput<Shape>>
      Validator: ZSchema<Joi.ObjectSchema>
    },
    { Shape: Shape; Options: ZObjectOptions; Catchall: AnyZ }
  >
> {
  readonly name = ZType.Object
  protected readonly _hint = _generateZObjectHint(this._props.shape)

  get shape(): Shape {
    return this._props.shape
  }

  keyof(): ZEnum<[U.ListOf<keyof Shape>[0], ...L.Tail<U.ListOf<keyof Shape>>]> {
    return ZEnum.create(keys(this._props.shape) as [U.ListOf<keyof Shape>[0], ...L.Tail<U.ListOf<keyof Shape>>])
  }

  pick<K extends keyof Shape>(keys: K[]): ZObject<Pick<Shape, K>> {
    return ZObject.$_create(pick(this._props.shape, keys), this._props.options, this._props.catchall)
  }

  omit<K extends keyof Shape>(keys: K[]): ZObject<Omit<Shape, K>> {
    return ZObject.$_create(omit(this._props.shape, keys), this._props.options, this._props.catchall)
  }

  extend<S extends AnyZObjectShape>(incomingShape: S): ZObject<Shape & S> {
    return ZObject.$_create(merge({}, this._props.shape, incomingShape), this._props.options, this._props.catchall)
  }

  merge<S extends AnyZObjectShape>(incomingSchema: ZObject<S>): ZObject<Shape & S> {
    return this.extend(incomingSchema.shape)
  }

  partial(): ZObject<_ToPartialZObjectShape<Shape>> {
    return ZObject.$_create(
      Object.fromEntries(
        Object.entries(this._props.shape).map(([key, z]) => [key, z.optional()])
      ) as _ToPartialZObjectShape<Shape>,
      this._props.options,
      this._props.catchall
    )
  }

  deepPartial(): ZObject<_ToPartialZObjectShape<Shape, 'deep'>> {
    return ZObject.$_create(
      Object.fromEntries(
        Object.entries(this._props.shape).map(([key, z]) => [
          key,
          z instanceof ZObject ? z.deepPartial().optional() : z.optional(),
        ])
      ) as _ToPartialZObjectShape<Shape, 'deep'>,
      this._props.options,
      this._props.catchall
    )
  }

  readonly(): ZObject<_ToReadonlyZObjectShape<Shape>> {
    this._addHook('afterParse', { name: MAKE_OBJECT_READONLY_HOOK, handler: Object.freeze })
    return this
  }

  deepReadonly(): ZObject<_ToReadonlyZObjectShape<Shape, 'deep'>> {
    this._addHook('afterParse', {
      name: MAKE_OBJECT_DEEPLY_READONLY_HOOK,
      handler: input => deepFreeze(input as O.Object) as this['$_output'],
    })
    return this as unknown as ZObject<_ToReadonlyZObjectShape<Shape, 'deep'>>
  }

  /* ------------------------------------------------- Configuration ------------------------------------------------ */

  passthrough(): this {
    this._updateProps(p => ({ ...p, options: { mode: 'passthrough' } }))
    return this
  }

  strict(): this {
    this._updateProps(p => ({ ...p, options: { mode: 'strict' } }))
    return this
  }

  strip(): this {
    this._updateProps(p => ({ ...p, options: { mode: 'strip' } }))
    return this
  }

  catchall<Z extends AnyZ>(z: Z): this {
    this._updateProps(p => ({ ...p, catchall: z }))
    return this
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static $_create = <Shape extends AnyZObjectShape, Options extends ZObjectOptions, Catchall extends AnyZ>(
    shape: Shape,
    options: Options,
    catchall: Catchall
  ): ZObject<Shape> => {
    if (catchall) options.mode = 'passthrough'

    const baseValidator = ZValidator.object(_zShapeToJoiSchemaMap(shape)).preferences(
      {
        passthrough: { allowUnknown: true, stripUnknown: false },
        strict: { allowUnknown: false, stripUnknown: false },
        strip: { allowUnknown: true, stripUnknown: true },
      }[options.mode]
    )

    const zObject = new ZObject(
      { validator: catchall ? baseValidator.pattern(/./, catchall._validator) : baseValidator, hooks: {} },
      { shape: shape, options, catchall }
    )

    return zObject
  }

  static create = <Shape extends AnyZObjectShape>(shape: Shape): ZObject<Shape> =>
    this.$_create(shape, { mode: 'strip' }, ZAny.create())
}

export type AnyZObject = ZObject<AnyZObjectShape>

/* ------------------------------------------------------------------------------------------------------------------ */

type _ToPartialZObjectShape<Shape extends AnyZObjectShape, Depth extends 'flat' | 'deep' = 'flat'> = {
  flat: {
    [K in keyof Shape]: ZOptional<Shape[K]>
  }
  deep: {
    [K in keyof Shape]: Shape[K] extends ZObject<infer S>
      ? ZOptional<ZObject<_ToPartialZObjectShape<S, 'deep'>>>
      : ZOptional<Shape[K]>
  }
}[Depth]

export type _ToReadonlyZObjectShape<Shape extends AnyZObjectShape, Depth extends 'flat' | 'deep' = 'flat'> = {
  flat: { readonly [K in keyof Shape]: Shape[K] }
  deep: {
    readonly [K in keyof Shape]: Shape[K] extends ZObject<infer S>
      ? ZObject<_ToReadonlyZObjectShape<S, 'deep'>>
      : Shape[K] extends AnyZArray
      ? ZReadonlyArray<Shape[K]>
      : Shape[K]
  }
}[Depth]

const _generateZObjectHint = (shape: AnyZObjectShape): string => {
  const _generateHint = (_shape: AnyZObjectShape, indentation = 2): string =>
    '{\n' +
    Object.entries(_shape)
      .map(
        ([key, z]) =>
          `${' '.repeat(indentation)}${key}${z.isOptional() ? '?' : ''}: ${
            z instanceof ZObject ? _generateHint(z.shape as AnyZObjectShape, indentation + 2) : z.hint
          },`
      )
      .join('\n') +
    `\n${' '.repeat(indentation - 2)}}`
  return _generateHint(shape)
}

const _zShapeToJoiSchemaMap = <Shape extends AnyZObjectShape>(shape: Shape): Joi.SchemaMap =>
  Object.fromEntries(
    Object.entries(shape).map(([key, z]) => {
      return [key, z['_validator']]
    })
  )
