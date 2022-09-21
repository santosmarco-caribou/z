import Joi from 'joi'
import { nanoid } from 'nanoid'
import { mix, settings } from 'ts-mixer'
import type { A, F } from 'ts-toolbelt'
import type { CamelCasedProperties, ReadonlyTuple } from 'type-fest'

import {
  AllowedDefaults,
  ZArray,
  ZBrand,
  ZBrandTag,
  ZDefault,
  ZHooksManager,
  ZHooksObject,
  ZIntersection,
  ZManifest,
  ZManifestManager,
  ZManifestObject,
  ZNonNullable,
  ZNullable,
  ZOpenApi,
  ZOptional,
  ZParser,
  ZPreferencesManager,
  ZPreferencesObject,
  ZPromise,
  ZPropsManager,
  ZReadonly,
  ZReadonlyDeep,
  ZRequired,
  ZSchemaManager,
  ZTransform,
  ZType,
  ZUnion,
  ZValidator,
} from '../_internals'
import { colorizeZHint } from '../utils'
import { TypeUtils } from '../utils/types'

settings.initFunction = '_init'

/* -------------------------------------------------------------------------- */
/*                          ZDef/ZDependencies/ZProps                         */
/* -------------------------------------------------------------------------- */

export type ZDef = {
  Output: any
  Input: any
  Schema: Joi.Schema
}

/* ------------------------------ ZDependencies ----------------------------- */

export type ZDependencies<Def extends ZDef> = {
  schema: Def['Schema']
  manifest: ZManifestObject<Def['Output']>
  hooks: Partial<ZHooksObject<Def>>
}

export type AnyZDependencies = ZDependencies<ZDef>

/* --------------------------------- ZProps --------------------------------- */

export type ZProps<Def extends ZDef> = CamelCasedProperties<
  Omit<Def, keyof ZDef>
>

export type AnyZProps = ZProps<ZDef>

/* -------------------------------- ZOptions -------------------------------- */

export type ZFormattedHintOptions = {
  /**
   * Whether to colorize the output.
   *
   * @default true
   */
  color?: boolean
}

/* -------------------------------------------------------------------------- */
/*                                    BaseZ                                   */
/* -------------------------------------------------------------------------- */

export interface BaseZ<Def extends ZDef> {
  readonly $_output: Def['Output']
  readonly $_input: Def['Input']

  readonly _schema: ZSchemaManager<Def>
  readonly _manifest: ZManifestManager<Def>
  readonly _hooks: ZHooksManager<Def>
  readonly _props: ZPropsManager<Def>
  readonly _preferences: ZPreferencesManager
}

export type AnyBaseZ = BaseZ<ZDef>

/* -------------------------------------------------------------------------- */
/*                                      Z                                     */
/* -------------------------------------------------------------------------- */

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
  readonly _schema: ZSchemaManager<Def>
  /** @internal */
  readonly _manifest: ZManifestManager<Def>
  /** @internal */
  readonly _hooks: ZHooksManager<Def>
  /** @internal */
  readonly _props: ZPropsManager<Def>
  /** @internal */
  readonly _preferences: ZPreferencesManager

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

    this._schema = ZSchemaManager(schema)
    this._manifest = ZManifestManager(manifest)
    this._hooks = ZHooksManager({
      beforeParse: hooks.beforeParse ?? [],
      afterParse: hooks.afterParse ?? [],
    })
    this._props = ZPropsManager(props)
    this._preferences = ZPreferencesManager(this._schema)
  }

  /* --------------------------------- Hint --------------------------------- */

  get hint(): string {
    return this._hint
  }

  getFormattedHint(options?: ZFormattedHintOptions): string {
    const formatted =
      options?.color === false ? this._hint : colorizeZHint(this._hint)
    return formatted
  }

  /* ------------------------------ Preferences ----------------------------- */

  preferences(): TypeUtils.ReadonlyDeep<ZPreferencesObject>
  preferences(prefs: TypeUtils.PartialDeep<ZPreferencesObject>): this
  preferences(
    prefs?: TypeUtils.PartialDeep<ZPreferencesObject>
  ): TypeUtils.ReadonlyDeep<ZPreferencesObject> | this {
    if (prefs) {
      this._preferences.update(prefs)
      return this
    }
    return this._preferences.get()
  }

  /* ------------------------------------------------------------------------ */

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

  default<D extends AllowedDefaults>(value: D): ZDefault<this, D> {
    return ZDefault.create(this, value)
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

  /* ------------------------------------------------------------------------ */

  isOptional(): boolean {
    return this.safeParse(undefined).ok
  }

  isNullable(): boolean {
    return this.safeParse(null).ok
  }

  /* ------------------------------------------------------------------------ */

  transform<NewOut>(
    transform: (arg: Def['Output']) => NewOut
  ): ZTransform<this, NewOut> {
    return ZTransform.create(this, transform)
  }

  /* ------------------------------------------------------------------------ */

  equals(compare: AnyZ): boolean {
    return this.name === compare.name
  }
}

export type AnyZ<Output = any> = Z<{
  Output: Output
  Input: any
  Schema: Joi.Schema
}>

/* ----------------------------- Type inference ----------------------------- */

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

/* -------------------------------------------------------------------------- */

export type TypeOf<T extends AnyZ> = keyof _ZOutput<T> extends typeof ZBrandTag
  ? // Branded types shouldn't be computed
    _ZOutput<T>
  : T extends ZArray<infer E, infer C>
  ? // This is to fix a bug with ZArrays (reason still unknown)
    C extends number
    ? ReadonlyTuple<_ZOutput<E>, C>
    : _ZOutput<T>
  : A.Compute<_ZOutput<T>, 'deep'>
