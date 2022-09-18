import type Joi from 'joi'
import { keys, merge, omit, pick } from 'lodash'
import { A, F, L, U } from 'ts-toolbelt'

import { type AnyZ, Z, ZAny, ZEnum, ZJoi, ZOptional, ZType } from '../_internals'
import type { MapToZInput, MapToZOutput, WithQuestionMarks } from '../utils'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZObject                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type AnyZObjectShape = {
  [K in string]?: AnyZ
}
export type SomeZObjectShape = {
  [K in string]: AnyZ
}

export type ZObjectOptions = { mode: 'passthrough' | 'strip' | 'strict' }

export class ZObject<Shape extends AnyZObjectShape> extends Z<{
  Output: A.Compute<WithQuestionMarks<MapToZOutput<Shape>>, 'deep'>
  Input: A.Compute<WithQuestionMarks<MapToZInput<Shape>>, 'deep'>
  Schema: Joi.ObjectSchema
  Shape: Shape
  Options: ZObjectOptions
  Catchall: AnyZ
}> {
  readonly name = ZType.Object
  protected readonly _hint = _generateZObjectHint(this._props.getOne('shape'))

  get shape(): Shape {
    return this._props.getOne('shape')
  }

  keyof(): ZEnum<[U.ListOf<keyof Shape>[0], ...L.Tail<U.ListOf<keyof Shape>>]> {
    return ZEnum.create(
      keys(this._props.getOne('shape')) as F.Narrow<[U.ListOf<keyof Shape>[0], ...L.Tail<U.ListOf<keyof Shape>>]>
    )
  }

  pick<K extends keyof Shape>(keys: K[]): ZObject<Pick<Shape, K>> {
    return ZObject.$_create(
      pick(this._props.getOne('shape'), keys),
      this._props.getOne('options'),
      this._props.getOne('catchall')
    )
  }

  omit<K extends keyof Shape>(keys: K[]): ZObject<Omit<Shape, K>> {
    return ZObject.$_create(
      omit(this._props.getOne('shape'), keys),
      this._props.getOne('options'),
      this._props.getOne('catchall')
    )
  }

  extend<S extends AnyZObjectShape>(incomingShape: S): ZObject<Shape & S> {
    return ZObject.$_create(
      merge({}, this._props.getOne('shape'), incomingShape),
      this._props.getOne('options'),
      this._props.getOne('catchall')
    )
  }

  merge<S extends AnyZObjectShape>(incomingSchema: ZObject<S>): ZObject<Shape & S> {
    return this.extend(incomingSchema.shape)
  }

  partial<K extends keyof Shape>(keys?: K[]): ZObject<_ToPartialZObjectShape<Shape, K>> {
    return ZObject.$_create(
      Object.fromEntries(
        Object.entries(this._props.getOne('shape')).map(([key, z]) =>
          keys && keys.includes(key as K) ? [key, z?.optional()] : [key, z]
        )
      ) as _ToPartialZObjectShape<Shape, K>,
      this._props.getOne('options'),
      this._props.getOne('catchall')
    )
  }

  partialDeep(): ZObject<_ToPartialZObjectShape<Shape, keyof Shape, 'deep'>> {
    return ZObject.$_create(
      Object.fromEntries(
        Object.entries(this._props.getOne('shape')).map(([key, z]) => [
          key,
          z instanceof ZObject ? z.partialDeep().optional() : z?.optional(),
        ])
      ) as _ToPartialZObjectShape<Shape, keyof Shape, 'deep'>,
      this._props.getOne('options'),
      this._props.getOne('catchall')
    )
  }

  /* ------------------------------------------------- Configuration ------------------------------------------------ */

  passthrough(): this {
    this._props.update(p => ({ ...p, options: { mode: 'passthrough' } }))
    return this
  }

  strict(): this {
    this._props.update(p => ({ ...p, options: { mode: 'strict' } }))
    return this
  }

  strip(): this {
    this._props.update(p => ({ ...p, options: { mode: 'strip' } }))
    return this
  }

  catchall<Z extends AnyZ>(z: Z): this {
    this._props.update(p => ({ ...p, catchall: z }))
    return this
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static $_create = <Shape extends AnyZObjectShape, Options extends ZObjectOptions, Catchall extends AnyZ>(
    shape: Shape,
    options: Options,
    catchall: Catchall
  ): ZObject<Shape> => {
    if (catchall) options.mode = 'passthrough'

    const baseValidator = ZJoi.object(_zShapeToJoiSchemaMap(shape)).preferences(
      {
        passthrough: { allowUnknown: true, stripUnknown: false },
        strict: { allowUnknown: false, stripUnknown: false },
        strip: { allowUnknown: true, stripUnknown: true },
      }[options.mode]
    )

    const zObject = new ZObject(
      {
        schema: catchall ? baseValidator.pattern(/./, catchall._schema.get()) : baseValidator,
        manifest: {},
        hooks: {},
      },
      { shape: shape, options, catchall }
    )

    return zObject
  }

  static create = <Shape extends AnyZObjectShape>(shape: Shape): ZObject<Shape> =>
    this.$_create(shape, { mode: 'strip' }, ZAny.create())
}

export type AnyZObject = ZObject<AnyZObjectShape>
export type SomeZObject = ZObject<SomeZObjectShape>

/* ------------------------------------------------------------------------------------------------------------------ */

type _ToPartialZObjectShape<
  Shape extends AnyZObjectShape,
  PickKey extends keyof Shape = keyof Shape,
  Depth extends 'flat' | 'deep' = 'flat'
> = {
  flat: Omit<Shape, PickKey> & {
    [K in Extract<keyof Shape, PickKey>]: Shape[K] extends AnyZ ? ZOptional<Shape[K]> : never
  }
  deep: Omit<Shape, PickKey> & {
    [K in Extract<keyof Shape, PickKey>]: Shape[K] extends ZObject<infer S>
      ? ZOptional<ZObject<_ToPartialZObjectShape<S, 'deep'>>>
      : Shape[K] extends AnyZ
      ? ZOptional<Shape[K]>
      : never
  }
}[Depth]

const _generateZObjectHint = (shape: AnyZObjectShape, opts?: { readonly?: 'flat' | 'deep' | boolean }): string => {
  const _generateHint = (
    _shape: AnyZObjectShape,
    indentation = 2,
    _opts?: { readonly?: 'flat' | 'deep' | boolean }
  ): string =>
    '{\n' +
    Object.entries(_shape)
      .map(
        ([key, z]) =>
          `${' '.repeat(indentation)}${_opts?.readonly ? 'readonly ' : ''}${key}${z?.isOptional() ? '?' : ''}: ${
            (z instanceof ZObject
              ? _generateHint(z.shape as AnyZObjectShape, indentation + 2, {
                  readonly: _opts?.readonly === 'deep',
                })
              : z?.hint) ?? ''
          },`
      )
      .join('\n') +
    `\n${' '.repeat(indentation - 2)}}`
  return _generateHint(shape, 2, opts)
}

export const _zShapeToJoiSchemaMap = <Shape extends AnyZObjectShape>(shape: Shape): Joi.SchemaMap =>
  Object.fromEntries(
    Object.entries(shape).map(([key, z]) => {
      return [key, z?._schema.get()]
    })
  )
