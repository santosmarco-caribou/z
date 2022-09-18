import Joi from 'joi'
import { nanoid } from 'nanoid'
import { mix, settings } from 'ts-mixer'
import type { A, F } from 'ts-toolbelt'
import type { CamelCasedProperties } from 'type-fest'

import {
  ZArray,
  ZBrand,
  ZBrandTag,
  ZGlobals,
  ZHooksController,
  ZHooksObject,
  ZIntersection,
  ZManifest,
  ZManifestController,
  ZManifestObject,
  ZNonNullable,
  ZNullable,
  ZOpenApi,
  ZOptional,
  ZParser,
  ZPromise,
  ZPropsController,
  ZReadonly,
  ZReadonlyDeep,
  ZRequired,
  ZSchemaController,
  ZTransform,
  ZType,
  ZUnion,
  ZValidator,
} from '../_internals'
import { colorizeZHint } from '../utils'

settings.initFunction = '_init'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                              ZDef/ZDependencies/ZProps                                             */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZDef = {
  Output: any
  Input: any
  Schema: Joi.Schema
}

/* -------------------------------------------------- ZDependencies ------------------------------------------------- */

export type ZDependencies<Def extends ZDef> = {
  schema: Def['Schema']
  manifest: ZManifestObject<Def['Output']>
  hooks: Partial<ZHooksObject<Def>>
}

export type AnyZDependencies = ZDependencies<ZDef>

/* ----------------------------------------------------- ZProps ----------------------------------------------------- */

export type ZProps<Def extends ZDef> = CamelCasedProperties<
  Omit<Def, keyof ZDef>
>

export type AnyZProps = ZProps<ZDef>

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        BaseZ                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export interface BaseZ<Def extends ZDef> {
  readonly $_output: Def['Output']
  readonly $_input: Def['Input']
  readonly _schema: ZSchemaController<Def>
  readonly _manifest: ZManifestController<Def>
  readonly _hooks: ZHooksController<Def>
  readonly _props: ZPropsController<Def>
}

export type AnyBaseZ = BaseZ<ZDef>

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                          Z                                                         */
/* ------------------------------------------------------------------------------------------------------------------ */

export interface Z<Def extends ZDef>
  extends BaseZ<Def>,
    ZValidator<Def>,
    ZParser<Def>,
    ZManifest<Def>,
    ZOpenApi<Def> {}

@mix(ZValidator, ZParser, ZManifest, ZOpenApi)
export abstract class Z<Def extends ZDef> {
  /** @internal */
  readonly $_output!: Def['Output']
  /** @internal */
  readonly $_input!: Def['Input']

  /** @internal */
  readonly _schema: ZSchemaController<Def>
  /** @internal */
  readonly _manifest: ZManifestController<Def>
  /** @internal */
  readonly _hooks: ZHooksController<Def>
  /** @internal */
  readonly _props: ZPropsController<Def>

  /** @internal */
  readonly _id: string = nanoid()

  /**
   * The unique name of the `ZType`.
   */
  abstract readonly name: ZType
  /** @internal */
  protected abstract _hint: string

  /** @internal */
  constructor(deps: ZDependencies<Def>, props: ZProps<Def>) {
    const { schema, manifest, hooks } = deps

    this._schema = ZSchemaController(schema)
    this._manifest = ZManifestController(manifest)
    this._hooks = ZHooksController({
      beforeParse: hooks.beforeParse ?? [],
      afterParse: hooks.afterParse ?? [],
    })
    this._props = ZPropsController(props)
  }

  get hint(): string {
    let _hint = this._hint

    if (!ZGlobals.get().options.stripColorsOnHints) {
      _hint = colorizeZHint(_hint)
    }

    return _hint
  }

  protected _setHint(hint: string): this {
    this._hint = hint
    return this
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  /**
   * Retrieves an optional version of the `ZType`.
   *
   * @example
   * ```ts
   * const optionalString = z.string().optional() // string | undefined
   *
   * // equivalent to
   * z.optional(z.string())
   * ```
   */
  optional(): ZOptional<this> {
    return ZOptional.create(this)
  }

  /**
   * Retrieves a nullable version of the `ZType`.
   *
   * @example
   * ```ts
   * const nullableNumber = z.number().nullable() // number | null
   *
   * // equivalent to
   * z.nullable(z.number())
   * ```
   */
  nullable(): ZNullable<this> {
    return ZNullable.create(this)
  }

  /**
   * Retrieves a nullish version of the `ZType`.
   * Nullish `ZTypes` will accept both `undefined` and `null`.
   *
   * @example
   * ```ts
   * const nullishBoolean = z.boolean().nullish() // boolean | null | undefined
   *
   * // equivalent to
   * z.boolean().nullable().optional();
   * ```
   */
  nullish(): ZOptional<ZNullable<this>> {
    return this.nullable().optional()
  }

  required(): ZRequired<this> {
    return ZRequired.create(this)
  }

  nonnullable(): ZNonNullable<this> {
    return ZNonNullable.create(this)
  }

  array(): ZArray<this> {
    return ZArray.create(this)
  }

  or<Z extends AnyZ>(alternative: Z): ZUnion<[this, Z]> {
    return ZUnion.create([this, alternative])
  }

  and<Z extends AnyZ>(intersection: Z): ZIntersection<[this, Z]> {
    return ZIntersection.create([this, intersection])
  }

  promise(): ZPromise<this> {
    return ZPromise.create(this)
  }

  brand<B extends string | number | symbol>(
    brand: F.Narrow<B>
  ): ZBrand<this, B> {
    return ZBrand.create(this, brand as B)
  }

  readonly(): ZReadonly<this> {
    return ZReadonly.create(this)
  }

  readonlyDeep(): ZReadonlyDeep<this> {
    return ZReadonlyDeep.create(this)
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  isOptional(): boolean {
    return this.safeParse(undefined).ok
  }

  isNullable(): boolean {
    return this.safeParse(null).ok
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  transform<NewOut>(
    transform: (arg: Def['Output']) => NewOut
  ): ZTransform<this, NewOut> {
    return ZTransform.create(this, transform)
  }
}

export type AnyZ<Output = any> = Z<{
  Output: Output
  Input: any
  Schema: Joi.Schema
}>

/* ------------------------------------------------- Type inference ------------------------------------------------- */

export type _ZOutput<T extends ZDef | AnyBaseZ> = T extends ZDef
  ? T['Output']
  : T extends AnyBaseZ
  ? T['$_output']
  : never

export type _ZInput<T extends ZDef | AnyBaseZ> = T extends ZDef
  ? T['Input']
  : T extends AnyBaseZ
  ? T['$_input']
  : never

/* ------------------------------------------------------------------------------------------------------------------ */

export type TypeOf<T extends AnyZ> = T extends Z<infer Def>
  ? keyof _ZOutput<Def> extends typeof ZBrandTag
    ? _ZOutput<Def>
    : _ZOutput<Def> extends Map<any, any> | Set<any>
    ? _ZOutput<Def>
    : A.Compute<_ZOutput<Def>, 'deep'>
  : never
