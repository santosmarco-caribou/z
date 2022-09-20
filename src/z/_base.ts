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
  ZCheck,
  ZDefault,
  ZHooksController,
  ZHooksObject,
  ZIntersection,
  ZIssueMap,
  ZJoi,
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
  ZTransform,
  ZType,
  ZUnion,
  ZValidator,
} from '../_internals'
import { colorizeZHint, WithQuestionMarks } from '../utils'

settings.initFunction = '_init'

/* -------------------------------------------------------------------------- */
/*                          ZDef/ZDependencies/ZProps                         */
/* -------------------------------------------------------------------------- */

export type ZDef = {
  TypeName: ZType
  Output: any
  Input: any
  Options?: Record<string, any>
  Props?: Record<string, any>
}

/* ------------------------------ ZDependencies ----------------------------- */

export type _ZChecks<Def extends ZDef> = readonly [
  ZCheck<Def>,
  ...ZCheck<Def>[]
]
export type _ZManifest<Def extends ZDef> = ZManifestObject<Def['Output']>
export type _ZHooks<Def extends ZDef> = Partial<ZHooksObject<Def>>
export type _ZOptions<Def extends ZDef> = CamelCasedProperties<Def['Options']>
export type _ZProps<Def extends ZDef> = CamelCasedProperties<Def['Props']>

export type ZDependencies<Def extends ZDef> = {
  checks: _ZChecks<Def>
  manifest: _ZManifest<Def>
  hooks: _ZHooks<Def>
} & WithQuestionMarks<{
  options: _ZOptions<Def> extends Record<string, never>
    ? undefined
    : _ZOptions<Def>
  props: _ZProps<Def> extends Record<string, never> ? undefined : _ZProps<Def>
}>

export type AnyZDependencies = ZDependencies<ZDef>

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

  readonly _checks: _ZChecks<Def>
  readonly _manifest: _ZManifest<Def>
  readonly _hooks: _ZHooks<Def>
  readonly _options: _ZOptions<Def>
  readonly _props: _ZProps<Def>

  readonly _validator: ZValidator<Def, { checks: ZDependencies<Def>['checks'] }>
}

export type AnyBaseZ = BaseZ<ZDef>

/* -------------------------------------------------------------------------- */
/*                                      Z                                     */
/* -------------------------------------------------------------------------- */

// export interface Z<Def extends ZDef>
//   extends BaseZ<Def>,
//     ZParser<Def>,
//     ZManifest<Def>,
//     ZOpenApi<Def> {}

@mix(ZParser, ZManifest, ZOpenApi)
export abstract class Z<Def extends ZDef> {
  /** @internal */
  readonly $_output!: Def['Output']
  /** @internal */
  readonly $_input!: Def['Input']

  /** @internal */
  private _schema: Joi.Schema = ZJoi.any()

  /** @internal */
  readonly _manifest: ZManifestController<Def>
  /** @internal */
  readonly _hooks: ZHooksController<Def>
  /** @internal */
  readonly _props: ZPropsController<Def>

  readonly _validator: ZValidator<Def, { checks: ZDependencies<Def>['checks'] }>

  /** @internal */
  readonly _id: string = nanoid()

  protected abstract readonly _typeName: Def['TypeName']
  protected abstract readonly _issueMap: ZIssueMap<Def['TypeName']>

  /** @internal */
  protected abstract _hint: string

  /** @internal */
  constructor(deps: ZDependencies<Def>) {
    const { checks, manifest, hooks } = deps

    this._validator = ZValidator.create<Def>(this._schema).addChecks(...checks)
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

type A = Capitalize<string>
const a: A = 'SarBar'
