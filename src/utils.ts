import { cloneDeep, merge } from 'lodash'
import type { A, L, N, O } from 'ts-toolbelt'
import type { Simplify } from 'type-fest'

import type { AnyZ, ZInput, ZOutput } from './_internals'
import { ZType } from './types'

const EMPTY_OBJECT = Symbol('EMPTY_OBJECT')

export type Nullable<T> = T | null | undefined

export type EmptyObject = { [EMPTY_OBJECT]?: never }
export type IsEmptyObject<T> = T extends EmptyObject ? true : false

export type MaybeArray<T> = T | T[]

export type OmitInternals<T extends O.Object> = Omit<T, `${'$_' | '_'}${string}`>

export type FixedLengthArray<Element, Length extends number> = N.Greater<Length, 40> extends 1
  ? FixedLengthArray<Element, Length>
  : [...O.ListOf<{ [K in Extract<keyof N.Range<1, Length>, `${number}`>]: Element }>]
export type MinLengthArray<Element, Length extends number> = [...FixedLengthArray<Element, Length>, ...Element[]]
export type MaxLengthArray<Element, Length extends number> = Partial<FixedLengthArray<Element, Length>>
export type MinMaxLengthArray<Element, Min extends number, Max extends number> = N.Greater<Min, Max> extends 1
  ? []
  : A.Equals<Min, Max> extends 1
  ? FixedLengthArray<Element, Min>
  : [...MinLengthArray<Element, Min>] & MaxLengthArray<Element, N.Sub<Max, Min>>

export type MapToZOutput<T> = Simplify<{ [K in keyof T]: T[K] extends AnyZ ? ZOutput<T[K]> : never }>
export type MapToZInput<T> = Simplify<{ [K in keyof T]: T[K] extends AnyZ ? ZInput<T[K]> : never }>

export const hasProp = <T extends O.Object, P extends PropertyKey>(obj: T, prop: P): obj is T & Record<P, any> => {
  return prop in obj
}

export const mergeSafe = <T extends [O.Object, ...O.Object[]]>(...objs: T): O.MergeAll<T[0], L.Tail<T>> =>
  merge({}, ...objs.map(cloneDeep))

export const entries = <T extends O.Object>(
  obj: T
): {
  [K in keyof T]: [K, T[K]]
}[keyof T][] => Object.entries(obj)

export const isArray = (maybeArr: unknown): maybeArr is any[] => Array.isArray(maybeArr)

/* ------------------------------------------------------ Hints ----------------------------------------------------- */

export const unionizeHints = (...hints: string[]): string =>
  [...new Set(hints)].join(' | ').replaceAll(/\(([^|]*|[^)]*)\)/g, '$1')

export const isComplexHint = (hint: string): boolean => hint.split('\n').length > 1

export const isOnlyUnionHint = (typeName: ZType): boolean =>
  [ZType.Union, ZType.Nullable, ZType.Optional].includes(typeName)

export const formatHint = (z: AnyZ): string => {
  if (isOnlyUnionHint(z.name) || isComplexHint(z['_hint'])) {
    return `(${z['_hint']})`
  }
  return z['_hint']
}
