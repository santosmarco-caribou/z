import { nanoid } from 'nanoid'
import { mix, settings } from 'ts-mixer'
import type { A, F, O } from 'ts-toolbelt'
import type { CamelCasedProperties } from 'type-fest'

import {
  AnyZSchema,
  ZArray,
  ZBrand,
  ZHooks,
  ZHooksObject,
  ZIntersection,
  ZManifest,
  ZNullable,
  ZOptional,
  ZParser,
  ZPropsManager,
  ZType,
  ZUnion,
  ZValidator,
} from '../_internals'
import { ZOpenApi } from '../manifest/openapi'
import { formatHint } from '../utils'

settings.initFunction = '_init'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                              ZDef/ZDependencies/ZProps                                             */
/* ------------------------------------------------------------------------------------------------------------------ */

export type BaseZDef = {
  Output: any
  Input?: any
  Validator: AnyZSchema
}

export type ZDef<Base extends BaseZDef, Extras extends O.Object | A.x = A.x> = Extras extends A.x ? Base : Extras & Base

export type AnyZDef = ZDef<BaseZDef>

/* -------------------------------------------------- ZDependencies ------------------------------------------------- */

export type ZDependencies<Def extends AnyZDef> = {
  validator: Def['Validator']
  hooks: ZHooksObject<Def>
}

export type AnyZDependencies = ZDependencies<AnyZDef>

/* ----------------------------------------------------- ZProps ----------------------------------------------------- */

export type ZProps<Def extends AnyZDef> = CamelCasedProperties<Omit<Def, keyof BaseZDef>>

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        BaseZ                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export interface BaseZ<Def extends AnyZDef> {
  readonly $_output: ZOutput<Def>
  readonly $_input: ZInput<Def>
}

export type AnyBaseZ = BaseZ<AnyZDef>

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                          Z                                                         */
/* ------------------------------------------------------------------------------------------------------------------ */

export interface Z<Def extends AnyZDef>
  extends BaseZ<Def>,
    ZValidator<Def>,
    ZPropsManager<Def>,
    ZHooks<Def>,
    ZParser<Def>,
    ZManifest<Def>,
    ZOpenApi<Def> {}

@mix(ZValidator, ZPropsManager, ZHooks, ZParser, ZManifest, ZOpenApi)
export abstract class Z<Def extends AnyZDef> {
  readonly $_output!: ZOutput<Def>
  readonly $_input!: ZInput<Def>

  readonly _id: string

  abstract readonly name: ZType
  protected abstract readonly _hint: string

  constructor(private readonly $__deps: ZDependencies<Def>, private readonly $__props: ZProps<Def>) {
    this._id = nanoid()
  }

  get hint(): string {
    return formatHint(this)
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  optional(): ZOptional<this> {
    return ZOptional.create(this)
  }

  nullable(): ZNullable<this> {
    return ZNullable.create(this)
  }

  nullish(): ZNullable<ZOptional<this>> {
    return this.optional().nullable()
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

  brand<B extends string | number | symbol>(brand: F.Narrow<B>): ZBrand<this, B> {
    return ZBrand.create(this, brand as B)
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  isOptional(): boolean {
    return this.safeParse(undefined).ok
  }

  isNullable(): boolean {
    return this.safeParse(null).ok
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  preprocess(fn: (value: unknown) => unknown): this {
    this._addHook('beforeParse', { name: `preprocess-${nanoid()}`, handler: fn })
    return this
  }

  postprocess<T>(fn: (value: ZOutput<Def>) => T): Z<{ Output: T; Validator: Def['Validator'] }> {
    this._addHook('afterParse', { name: `postprocess-${nanoid()}`, handler: fn })
    return this as any
  }
}

export type AnyZ = Z<AnyZDef>

/* ------------------------------------------------- Type inference ------------------------------------------------- */

export type ZOutput<T extends AnyBaseZ | AnyZDef> = T extends AnyBaseZ
  ? T['$_output']
  : T extends AnyZDef
  ? T['Output']
  : never

export type ZInput<T extends AnyBaseZ | AnyZDef> = T extends AnyBaseZ
  ? T['$_input']
  : T extends AnyZDef
  ? 'Input' extends keyof T
    ? T['Input']
    : ZOutput<T>
  : never

export type TypeOf<T extends AnyBaseZ> = ZOutput<T> extends Map<any, any> | Set<any>
  ? ZOutput<T>
  : A.Compute<ZOutput<T>, 'deep'>
