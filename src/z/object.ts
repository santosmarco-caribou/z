import type Joi from 'joi'
import { keys, merge, omit, pick } from 'lodash'
import type { A, L, U } from 'ts-toolbelt'
import type { LiteralUnion } from 'type-fest'

import {
  type AnyZ,
  AnyZHooksObject,
  AnyZManifestObject,
  Z,
  ZDependencies,
  ZEnum,
  ZJoi,
  ZOptional,
  ZRequired,
  ZType,
} from '../_internals'
import {
  generateZHint,
  MapToZInput,
  MapToZOutput,
  safeJsonStringify,
  WithQuestionMarks,
} from '../utils'

/* -------------------------------------------------------------------------- */
/*                                   ZObject                                  */
/* -------------------------------------------------------------------------- */

export type AnyZObjectShape = {
  [K in string]?: AnyZ
}
export type SomeZObjectShape = {
  [K in string]: AnyZ
}

/* -------------------------------------------------------------------------- */

export type ZObjectOptions = {
  mode: 'passthrough' | 'strip' | 'strict'
  catchall: AnyZ | undefined
}

export type ZObjectDef<
  Shape extends AnyZObjectShape,
  Opts extends ZObjectOptions
> = {
  Output: A.Compute<WithQuestionMarks<MapToZOutput<Shape>>, 'deep'>
  Input: A.Compute<WithQuestionMarks<MapToZInput<Shape>>, 'deep'>
  Schema: Joi.ObjectSchema
  Shape: Shape
  Options: Opts
}

export class ZObject<
  Shape extends AnyZObjectShape,
  Opts extends ZObjectOptions = {
    mode: 'strip'
    catchall: undefined
  }
> extends Z<ZObjectDef<Shape, Opts>> {
  readonly name = ZType.Object
  protected readonly _hint = generateZHint(() =>
    safeJsonStringify(
      Object.fromEntries(
        Object.entries(this.shape).map(([key, z]) => [key, z?.hint])
      )
    )
  )

  get shape(): Shape {
    return this._props.getOne('shape')
  }

  keyof(): ZEnum<[U.ListOf<keyof Shape>[0], ...L.Tail<U.ListOf<keyof Shape>>]> {
    const shapeKeys = keys(this._props.getOne('shape'))
    return ZEnum.create<
      Extract<keyof Shape, string>,
      [U.ListOf<keyof Shape>[0], ...L.Tail<U.ListOf<keyof Shape>>]
    >([shapeKeys[0] ?? '', ...shapeKeys.slice(1)] as [
      U.ListOf<keyof Shape>[0],
      ...L.Tail<U.ListOf<keyof Shape>>
    ])
  }

  pick<K extends keyof Shape>(keys: K[]): ZObject<Pick<Shape, K>, Opts> {
    return ZObject.$_create(
      pick(this._props.getOne('shape'), keys),
      this._props.getOne('options'),
      {
        manifest: this._manifest.get() as AnyZManifestObject,
        hooks: this._hooks.get() as AnyZHooksObject,
      }
    )
  }
  omit<K extends keyof Shape>(keys: K[]): ZObject<Omit<Shape, K>, Opts> {
    return ZObject.$_create(
      omit(this._props.getOne('shape'), keys),
      this._props.getOne('options'),
      {
        manifest: this._manifest.get() as AnyZManifestObject,
        hooks: this._hooks.get() as AnyZHooksObject,
      }
    )
  }

  extend<S extends AnyZObjectShape>(
    incomingShape: S
  ): ZObject<Shape & S, Opts> {
    return ZObject.$_create(
      merge({}, this._props.getOne('shape'), incomingShape),
      this._props.getOne('options'),
      {
        manifest: this._manifest.get() as AnyZManifestObject,
        hooks: this._hooks.get() as AnyZHooksObject,
      }
    )
  }
  merge<S extends AnyZObjectShape>(
    incomingSchema: ZObject<S>
  ): ZObject<Shape & S, Opts> {
    return this.extend(incomingSchema.shape)
  }

  setKey<K extends LiteralUnion<keyof Shape, string>, Z extends AnyZ>(
    key: K,
    type: Z
  ): ZObject<Shape & { [_K in K]: Z }, Opts> {
    return this.extend({ [key]: type })
  }

  partial<K extends keyof Shape>(
    keys?: K[]
  ): ZObject<_ToPartialZObjectShape<Shape, K>, Opts> {
    return ZObject.$_create(
      Object.fromEntries(
        Object.entries(this._props.getOne('shape')).map(([key, z]) =>
          keys && keys.includes(key as K) ? [key, z?.optional()] : [key, z]
        )
      ) as _ToPartialZObjectShape<Shape, K>,
      this._props.getOne('options'),
      {
        manifest: this._manifest.get() as AnyZManifestObject,
        hooks: this._hooks.get() as AnyZHooksObject,
      }
    )
  }
  partialDeep(): ZObject<
    _ToPartialZObjectShape<Shape, keyof Shape, 'deep'>,
    Opts
  > {
    return ZObject.$_create(
      Object.fromEntries(
        Object.entries(this._props.getOne('shape')).map(([key, z]) => [
          key,
          z instanceof ZObject ? z.partialDeep().optional() : z?.optional(),
        ])
      ) as _ToPartialZObjectShape<Shape, keyof Shape, 'deep'>,
      this._props.getOne('options'),
      {
        manifest: this._manifest.get() as AnyZManifestObject,
        hooks: this._hooks.get() as AnyZHooksObject,
      }
    )
  }

  requiredKeys<K extends keyof Shape>(
    keys?: K[]
  ): ZObject<_ToRequiredZObjectShape<Shape, K>, Opts> {
    return ZObject.$_create(
      Object.fromEntries(
        Object.entries(this._props.getOne('shape')).map(([key, z]) =>
          keys && keys.includes(key as K)
            ? [key, z?.required()]
            : [key, z?.required()]
        )
      ) as _ToRequiredZObjectShape<Shape, K>,
      this._props.getOne('options'),
      {
        manifest: this._manifest.get() as AnyZManifestObject,
        hooks: this._hooks.get() as AnyZHooksObject,
      }
    )
  }
  requiredKeysDeep(): ZObject<
    _ToRequiredZObjectShape<Shape, keyof Shape, 'deep'>,
    Opts
  > {
    return ZObject.$_create(
      Object.fromEntries(
        Object.entries(this._props.getOne('shape')).map(([key, z]) => [
          key,
          z instanceof ZObject
            ? z.requiredKeysDeep().required()
            : z?.required(),
        ])
      ) as _ToRequiredZObjectShape<Shape, keyof Shape, 'deep'>,
      this._props.getOne('options'),
      {
        manifest: this._manifest.get() as AnyZManifestObject,
        hooks: this._hooks.get() as AnyZHooksObject,
      }
    )
  }

  /* ----------------------------- Configuration ---------------------------- */

  passthrough(): ZObject<Shape, Opts & { mode: 'passthrough' }> {
    return ZObject.$_create(
      this._props.getOne('shape'),
      { ...this._props.getOne('options'), mode: 'passthrough' },
      { manifest: this._manifest.get(), hooks: this._hooks.get() }
    )
  }

  strict(): ZObject<Shape, Opts & { mode: 'strict' }> {
    return ZObject.$_create(
      this._props.getOne('shape'),
      { ...this._props.getOne('options'), mode: 'strict' },
      { manifest: this._manifest.get(), hooks: this._hooks.get() }
    )
  }

  strip(): ZObject<Shape, Opts & { mode: 'strip' }> {
    return ZObject.$_create(
      this._props.getOne('shape'),
      { ...this._props.getOne('options'), mode: 'strip' },
      { manifest: this._manifest.get(), hooks: this._hooks.get() }
    )
  }

  catchall<Z extends AnyZ>(type: Z): ZObject<Shape, Opts & { catchall: Z }> {
    return ZObject.$_create(
      this._props.getOne('shape'),
      { ...this._props.getOne('options'), catchall: type },
      { manifest: this._manifest.get(), hooks: this._hooks.get() }
    )
  }

  /* ------------------------------------------------------------------------ */

  static $_create = <
    Shape extends AnyZObjectShape,
    Options extends ZObjectOptions
  >(
    shape: Shape,
    options: Options,
    dependencies: Omit<ZDependencies<ZObjectDef<Shape, Options>>, 'schema'>
  ): ZObject<Shape, Options> => {
    if (options.catchall) options.mode = 'passthrough'

    const baseValidator = ZJoi.object(_zShapeToJoiSchemaMap(shape)).preferences(
      {
        passthrough: { allowUnknown: true, stripUnknown: false },
        strict: { allowUnknown: false, stripUnknown: false },
        strip: { allowUnknown: true, stripUnknown: true },
      }[options.mode]
    )

    const zObject = new ZObject(
      {
        ...dependencies,
        schema: options.catchall
          ? baseValidator.pattern(/./, options.catchall._schema.get())
          : baseValidator,
      },
      { shape: shape, options }
    )

    return zObject
  }

  /* ------------------------------------------------------------------------ */

  static create = <Shape extends AnyZObjectShape>(
    shape: Shape
  ): ZObject<Shape> =>
    this.$_create(
      shape,
      { mode: 'strip', catchall: undefined },
      { manifest: {}, hooks: {} }
    )
}

export type AnyZObject = ZObject<AnyZObjectShape>
export type SomeZObject = ZObject<SomeZObjectShape>

/* ---------------------------------- Utils --------------------------------- */

type _ToPartialZObjectShape<
  Shape extends AnyZObjectShape,
  PickKey extends keyof Shape = keyof Shape,
  Depth extends 'flat' | 'deep' = 'flat'
> = {
  flat: Omit<Shape, PickKey> & {
    [K in Extract<keyof Shape, PickKey>]: Shape[K] extends AnyZ
      ? Shape[K] extends ZOptional<any>
        ? Shape[K]
        : ZOptional<Shape[K]>
      : never
  }
  deep: {
    [K in keyof Shape]: Shape[K] extends
      | ZObject<infer S>
      | ZRequired<ZObject<infer S>>
      ? ZOptional<ZObject<_ToPartialZObjectShape<S, keyof S, 'deep'>>>
      : Shape[K] extends AnyZ
      ? ZOptional<Shape[K]>
      : never
  }
}[Depth]

type _ToRequiredZObjectShape<
  Shape extends AnyZObjectShape,
  PickKey extends keyof Shape = keyof Shape,
  Depth extends 'flat' | 'deep' = 'flat'
> = {
  flat: Omit<Shape, PickKey> & {
    [K in Extract<keyof Shape, PickKey>]: Shape[K] extends AnyZ
      ? Shape[K] extends ZRequired<any>
        ? Shape[K]
        : ZRequired<Shape[K]>
      : never
  }
  deep: {
    [K in keyof Shape]: Shape[K] extends
      | ZObject<infer S>
      | ZOptional<ZObject<infer S>>
      ? ZRequired<ZObject<_ToRequiredZObjectShape<S, keyof S, 'deep'>>>
      : Shape[K] extends AnyZ
      ? ZRequired<Shape[K]>
      : never
  }
}[Depth]

export const _zShapeToJoiSchemaMap = <Shape extends AnyZObjectShape>(
  shape: Shape
): Joi.SchemaMap =>
  Object.fromEntries(
    Object.entries(shape).map(([key, z]) => {
      return [key, z?._schema.get()]
    })
  )
