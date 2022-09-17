import Joi from 'joi'
import { nanoid } from 'nanoid'
import { mix, settings } from 'ts-mixer'
import type { A, F } from 'ts-toolbelt'
import type { CamelCasedProperties } from 'type-fest'

import {
  AnyZMetaObject,
  ZArray,
  ZBrand,
  ZHooks,
  ZHooksObject,
  ZIntersection,
  ZJoiSchema,
  ZManifest,
  ZManifestObject,
  ZNullable,
  ZOpenApi,
  ZOptional,
  ZParser,
  ZPropsManager,
  ZReadonly,
  ZReadonlyDeep,
  ZType,
  ZUnion,
  ZValidator,
} from '../_internals'
import { formatHint } from '../utils'

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
  schema: _ZSchema<Def>
  manifest: ZManifestObject<Def['Output']>
  hooks: Partial<ZHooksObject<Def>>
}

export type AnyZDependencies = ZDependencies<ZDef>

/* ----------------------------------------------------- ZProps ----------------------------------------------------- */

export type ZProps<Def extends ZDef> = CamelCasedProperties<Omit<Def, keyof ZDef>>

export type AnyZProps = ZProps<ZDef>

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        BaseZ                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export interface BaseZ<Def extends ZDef> {
  readonly $_output: Def['Output']
  readonly $_input: Def['Input']
  readonly _meta: AnyZMetaObject
  $_schema: _ZSchema<Def>
  $_manifest: ZManifestObject<Def['Output']>
}

export type AnyBaseZ = BaseZ<ZDef>

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                          Z                                                         */
/* ------------------------------------------------------------------------------------------------------------------ */

export interface Z<Def extends ZDef>
  extends BaseZ<Def>,
    ZValidator<Def>,
    ZPropsManager<Def>,
    ZHooks<Def>,
    ZParser<Def>,
    ZManifest<Def>,
    ZOpenApi<Def> {}

@mix(ZValidator, ZPropsManager, ZHooks, ZParser, ZManifest, ZOpenApi)
export abstract class Z<Def extends ZDef> {
  readonly $_output!: Def['Output']
  readonly $_input!: Def['Input']

  readonly $_schema: _ZSchema<Def>
  readonly $_manifest: ZManifestObject<Def['Output']>

  readonly _id: string

  abstract readonly name: ZType
  protected abstract readonly _hint: string

  constructor(deps: ZDependencies<Def>, props: ZProps<Def>) {
    const { schema, manifest, hooks } = deps

    this.$_schema = schema

    const meta = this.$_schema.$_terms.metas[0]
    meta.update({ _manifest: manifest, _hooks: hooks, _props: props })

    this.$_manifest = meta._manifest

    this._id = nanoid()
  }

  get hint(): string {
    return formatHint(this)
  }

  get _meta(): AnyZMetaObject {
    return this.$_schema.$_terms.metas[0]
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  optional(): ZOptional<this> {
    return ZOptional.create(this)
  }

  nullable(): ZNullable<this> {
    return ZNullable.create(this)
  }

  nullish(): ZOptional<ZNullable<this>> {
    return this.nullable().optional()
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
}

export type AnyZ<Output = any> = Z<{ Output: Output; Input: any; Schema: Joi.Schema }>

/* ------------------------------------------------- Type inference ------------------------------------------------- */

export type _ZOutput<T extends ZDef | AnyBaseZ> = T extends ZDef
  ? T['Output']
  : T extends AnyBaseZ
  ? T['$_output']
  : never

export type _ZInput<T extends ZDef | AnyBaseZ> = T extends ZDef ? T['Input'] : T extends AnyBaseZ ? T['$_input'] : never

export type _ZSchema<T extends ZDef | AnyBaseZ> = ZJoiSchema<
  T extends ZDef ? T['Schema'] : T extends AnyBaseZ ? T['$_schema'] : never
>

/* ------------------------------------------------------------------------------------------------------------------ */

export type TypeOf<T extends AnyZ> = T extends Z<infer Def>
  ? _ZOutput<Def> extends Map<any, any> | Set<any>
    ? _ZOutput<Def>
    : A.Compute<_ZOutput<Def>, 'deep'>
  : never
