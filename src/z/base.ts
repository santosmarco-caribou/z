import { merge } from 'lodash'
import { mix, settings } from 'ts-mixer'
import type { A, O } from 'ts-toolbelt'
import type { CamelCasedProperties } from 'type-fest'

import { AnyZSchema, ZHooks, ZManifest, ZNullable, ZOptional, ZParser, ZType, ZValidator } from '../_internals'
import { entries, hasProp, isArray } from '../utils'

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
}

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

export interface Z<Def extends AnyZDef> extends BaseZ<Def>, ZValidator<Def>, ZHooks<Def>, ZParser<Def>, ZManifest<Def> {
  optional(): ZOptional<this>
  nullable(): ZNullable<this>
  nullish(): ZNullable<ZOptional<this>>
  isOptional(): boolean
  isNullable(): boolean
}

@mix(ZValidator, ZHooks, ZParser, ZManifest)
export abstract class Z<Def extends AnyZDef> {
  readonly $_output!: ZOutput<Def>
  readonly $_input!: ZInput<Def>

  abstract readonly name: ZType
  abstract readonly hint: string

  private $_props: ZProps<Def>

  protected constructor(_: ZDependencies<Def>, props: ZProps<Def>) {
    this.$_props = props
  }

  protected get _props(): Readonly<ZProps<Def>> {
    return Object.freeze(this.$_props)
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

  /* ---------------------------------------------------------------------------------------------------------------- */

  isOptional(): boolean {
    return this.safeParse(undefined).ok
  }

  isNullable(): boolean {
    return this.safeParse(null).ok
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  protected _updateProps(fn: (props: Readonly<ZProps<Def>>) => ZProps<Def>): this {
    const oldDef = this.$_props
    const newDef = fn(this._props)
    merge(
      this.$_props,
      entries(newDef).reduce(
        (acc, [k, v]) => ({
          ...acc,
          [k]: isArray(v) ? [...(hasProp(oldDef, k) && isArray(oldDef[k]) ? oldDef[k] : []), ...v] : v,
        }),
        {}
      )
    )
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

export type TypeOf<T extends AnyBaseZ> = ZOutput<T>
