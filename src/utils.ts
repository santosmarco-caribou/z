import { cloneDeep, mergeWith } from 'lodash'
import type { L, N, O } from 'ts-toolbelt'
import type { ReadonlyDeep, ReadonlyTuple } from 'type-fest'

import type { _ZInput, _ZOutput, AnyZ } from './_internals'
import { ZType } from './types'

/* ---------------------------------------------------- Constants --------------------------------------------------- */

const EMPTY_OBJECT = Symbol('EMPTY_OBJECT')

/* ------------------------------------------------------ Types ----------------------------------------------------- */

export type Nullable<T> = T | null | undefined

export type EmptyObject = { [EMPTY_OBJECT]?: never }
export type IsEmptyObject<T> = T extends EmptyObject ? true : false

export type MaybeArray<T> = T | T[]

export type OmitInternals<T extends O.Object> = Omit<T, `${'$_' | '_'}${string}`>

export type FixedLengthArray<Element, Length extends number> = ReadonlyTuple<Element, Length>
export type MinLengthArray<Element, Length extends number> = [...FixedLengthArray<Element, Length>, ...Element[]]
export type MaxLengthArray<Element, Length extends number> = Partial<FixedLengthArray<Element, Length>>
export type MinMaxLengthArray<Element, Min extends number, Max extends number> = [...MinLengthArray<Element, Min>] &
  MaxLengthArray<Element, N.Sub<Max, Min>>

export type MapToZOutput<T> = {
  [K in keyof T]: T[K] extends AnyZ ? _ZOutput<T[K]> : never
}
export type MapToZInput<T> = {
  [K in keyof T]: T[K] extends AnyZ ? _ZInput<T[K]> : never
}

export type OptionalKeys<T extends O.Object> = {
  [K in keyof T]: undefined extends T[K] ? K : never
}[keyof T]
export type RequiredKeys<T extends O.Object> = {
  [K in keyof T]: undefined extends T[K] ? never : K
}[keyof T]

export type RequiredDeep<T extends O.Object> = O.Required<T, PropertyKey, 'deep'>
export type MergeDeep<A extends O.Object, B extends O.Object> = O.Merge<A, B, 'deep'>

export type WithQuestionMarks<T extends O.Object> = Pick<T, RequiredKeys<T>> & Partial<Pick<T, OptionalKeys<T>>>

/* ----------------------------------------------------- Strings ---------------------------------------------------- */

export const toUpperCase = <T extends string>(str: T): Uppercase<T> => str.toUpperCase() as Uppercase<T>

export const toLowerCase = <T extends string>(str: T): Lowercase<T> => str.toLowerCase() as Lowercase<T>

/* ----------------------------------------------------- Arrays ----------------------------------------------------- */

export const isArray = (maybeArr: unknown): maybeArr is any[] => Array.isArray(maybeArr)

/* ----------------------------------------------------- Objects ---------------------------------------------------- */

export const hasProp = <T extends O.Object, P extends PropertyKey>(obj: T, prop: P): obj is T & Record<P, any> => {
  return typeof obj === 'object' && !!obj && prop in obj
}

export const mergeSafe = <T extends [O.Object, ...O.Object[]]>(...objs: T): O.MergeAll<T[0], L.Tail<T>> =>
  mergeWith({}, ...objs.map(cloneDeep), (objValue: any, srcValue: any) =>
    isArray(objValue) ? objValue.concat(srcValue) : undefined
  )

export const entries = <T extends O.Object>(
  obj: T
): {
  [K in keyof T]: [K, T[K]]
}[keyof T][] => Object.entries(obj)

export const freezeDeep = <T>(x: T): ReadonlyDeep<T> => {
  const _x = x as Record<PropertyKey, any>
  Object.getOwnPropertyNames(_x).forEach(prop =>
    _x[prop] && typeof _x[prop] === 'object' ? freezeDeep(_x[prop]) : Object.freeze(_x[prop])
  )
  return Object.freeze(_x) as ReadonlyDeep<T>
}

/* ------------------------------------------------------ Hints ----------------------------------------------------- */

export const unionizeHints = (...hints: string[]): string => {
  const deunionized = hints.flatMap(h => h.split(' | '))
  const unionized = [...new Set(deunionized)].join(' | ')
  if (unionized.split(' | ').includes('any')) return 'any'
  if (unionized.split(' | ').includes('never')) return 'never'
  if (unionized.split(' | ').includes('unknown')) return 'unknown'
  return unionized
}

export const isComplexHint = (hint: string): boolean => hint.split('\n').length > 1

export const isOnlyUnionHint = (typeName: ZType): boolean =>
  [ZType.Union, ZType.Nullable, ZType.Optional].includes(typeName)

export const formatHint = (z: AnyZ): string => {
  if ((z.name === ZType.Array && z['_hint'].split('|').length > 2) || isComplexHint(z['_hint'])) {
    return `(${z['_hint']})`
  }
  return z['_hint']
}

/* ------------------------------------------------------------------------------------------------------------------ */

export const safeJsonStringify = (value: any): string =>
  JSON.stringify(value, (_, val) => (typeof val === 'bigint' ? `BigInt(${val.toString()})` : val))
