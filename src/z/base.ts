import { nanoid } from 'nanoid'
import { mix, settings } from 'ts-mixer'
import type { A, O } from 'ts-toolbelt'
import type { CamelCasedProperties, Simplify } from 'type-fest'

import {
  AnyZSchema,
  ZArray,
  ZHooks,
  ZHooksObject,
  ZManifest,
  ZNullable,
  ZOptional,
  ZParser,
  ZPropsManager,
  ZType,
  ZUnion,
  ZValidator,
} from '../_internals'
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
    ZManifest<Def> {}

@mix(ZValidator, ZPropsManager, ZHooks, ZParser, ZManifest)
export abstract class Z<Def extends AnyZDef> {
  readonly $_output!: ZOutput<Def>
  readonly $_input!: ZInput<Def>

  readonly _id: string

  abstract readonly name: ZType
  protected abstract readonly _hint: string

  constructor(_: ZDependencies<Def>, __: ZProps<Def>) {
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

  /* ---------------------------------------------------------------------------------------------------------------- */

  isOptional(): boolean {
    return this.safeParse(undefined).ok
  }

  isNullable(): boolean {
    return this.safeParse(null).ok
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  preprocess(fn: (value: unknown) => ZOutput<Def>): this {
    this._addHook('beforeParse', { name: `preprocess-${nanoid()}`, handler: fn })
    return this
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

export type TypeOf<T extends AnyBaseZ> = Simplify<ZOutput<T>, { deep: true }>
