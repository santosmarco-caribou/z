import chalk from 'chalk'
import { cloneDeep, mergeWith } from 'lodash'
import type { L, O } from 'ts-toolbelt'
import type { ReadonlyDeep } from 'type-fest'

import type { _ZInput, _ZOutput, AnyZ } from './_internals'
import { ZType } from './types'

/* -------------------------------- Constants ------------------------------- */

const EMPTY_OBJECT = Symbol('EMPTY_OBJECT')

/* ---------------------------------- Types --------------------------------- */

export type Nullable<T> = T | null | undefined

export type EmptyObject = { [EMPTY_OBJECT]?: never }
export type IsEmptyObject<T> = T extends EmptyObject ? true : false

export type MaybeArray<T> = T | T[]

export type OmitInternals<T extends O.Object> = Omit<
  T,
  `${'$_' | '_'}${string}`
>

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

export type RequiredDeep<T extends O.Object> = O.Required<
  T,
  PropertyKey,
  'deep'
>
export type MergeDeep<A extends O.Object, B extends O.Object> = O.Merge<
  A,
  B,
  'deep'
>

export type WithQuestionMarks<T extends O.Object> = Pick<T, RequiredKeys<T>> &
  Partial<Pick<T, OptionalKeys<T>>>

/* --------------------------------- Strings -------------------------------- */

export const toUpperCase = <T extends string>(str: T): Uppercase<T> =>
  str.toUpperCase() as Uppercase<T>

export const toLowerCase = <T extends string>(str: T): Lowercase<T> =>
  str.toLowerCase() as Lowercase<T>

export const capitalize = <T extends string>(str: T): Capitalize<T> =>
  (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>

export const uncapitalize = <T extends string>(str: T): Uncapitalize<T> =>
  (str.charAt(0).toLowerCase() + str.slice(1)) as Uncapitalize<T>

/* --------------------------------- Arrays --------------------------------- */

export const isArray = (maybeArr: unknown): maybeArr is any[] =>
  Array.isArray(maybeArr)

/* --------------------------------- Objects -------------------------------- */

export const hasProp = <T extends O.Object, P extends PropertyKey>(
  obj: T,
  prop: P
): obj is T & Record<P, any> => {
  return typeof obj === 'object' && !!obj && prop in obj
}

export const mergeObjsAndArrays = <T extends [O.Object, ...O.Object[]]>(
  ...objs: T
): void => {
  mergeWith(objs[0], ...objs.slice(1), (objValue: any, srcValue: any) =>
    isArray(objValue) ? objValue.concat(srcValue) : undefined
  )
}

export const mergeSafe = <T extends [O.Object, ...O.Object[]]>(
  ...objs: T
): O.MergeAll<T[0], L.Tail<T>> =>
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
    _x[prop] && typeof _x[prop] === 'object'
      ? freezeDeep(_x[prop])
      : Object.freeze(_x[prop])
  )
  return Object.freeze(_x) as ReadonlyDeep<T>
}

/* ---------------------------------- Hints --------------------------------- */

const ZHintHelpers = {
  unionizeHints: (...hints: string[]): string => {
    const deunionized = hints.flatMap(h => h.split(' | '))
    const unionized = [...new Set(deunionized)]
      .map(h => h.trim())
      .filter(h => !h)
      .join(' | ')
    if (unionized.split(' | ').includes('any')) return 'any'
    if (unionized.split(' | ').includes('never')) return 'never'
    if (unionized.split(' | ').includes('unknown')) return 'unknown'
    return unionized
  },

  isOnlyUnionHint: (typeName: ZType): boolean =>
    [ZType.Union, ZType.Nullable, ZType.Optional].includes(typeName),
}

type ZHintHelpers = typeof ZHintHelpers

export const generateZHint = (
  generator: (helpers: ZHintHelpers) => string
): string => generator(ZHintHelpers)

export const colorizeZHint = (hint: string): string => {
  return (
    hint
      // `:` and `?:` in objects
      .replaceAll(/(.)(\??:) /g, `$1${chalk.magenta('$2')} `)
      // `|` in unions and `&` in intersections
      .replaceAll(/ (\||&) /g, ` ${chalk.magenta('$1')} `)
      // `instanceof` keyword and type
      .replaceAll(
        /(instanceof) (.*)\b/g,
        `${chalk.magenta('$1')} ${chalk.cyan('$2')}`
      )
      // string literals
      .replaceAll(/'(\w*)'/g, chalk.yellow("'$1'"))
      // template string ticks (`)
      .replaceAll(/`([^`]*)`/g, `${chalk.yellow('`')}$1${chalk.yellow('`')}`)
      // template string braces
      .replaceAll(
        /\$\{([^}]*)\}/g,
        `${chalk.magenta('${')}$1${chalk.magenta('}')}`
      )
      // types
      .replaceAll(
        /(null|undefined|string|number|boolean|true|false|symbol|any|never|unknown|void|bigint|Date|Record|Readonly|Map|Set)/g,
        chalk.cyan('$1')
      )
      // format strings (e.g., string($alphanumeric))
      .replaceAll(/(\(\$[^)]*\))/g, chalk.italic.gray('$1'))
  )
}

export const unionizeHints = (...hints: string[]): string => {
  const deunionized = hints.flatMap(h => h.split(' | '))
  const unionized = [...new Set(deunionized)]
    .filter(h => !h.match(/^\s*$/))
    .join(' | ')
  if (unionized.split(' | ').includes('any')) return 'any'
  if (unionized.split(' | ').includes('never')) return 'never'
  if (unionized.split(' | ').includes('unknown')) return 'unknown'
  return unionized
}

export const isComplexHint = (hint: string): boolean =>
  hint.split('\n').length > 1

export const formatHint = (z: AnyZ): string => {
  if (
    (z.name === ZType.Array && z['_hint'].split('|').length > 2) ||
    isComplexHint(z['_hint'])
  ) {
    return `(${z['_hint']})`
  }
  return z['_hint']
}

/* -------------------------------------------------------------------------- */

export const safeJsonStringify = (value: any, space?: number): string =>
  JSON.stringify(
    value,
    (_, val) => (typeof val === 'bigint' ? `BigInt(${val.toString()})` : val),
    space
  )

/* ---------------------------------- Tests --------------------------------- */

type AssertEqual<T, U> = (<V>() => V extends T ? 1 : 2) extends <
  V
>() => V extends U ? 1 : 2
  ? true
  : false

export const assertEqual = <A, B>(val: AssertEqual<A, B>) => val
export function assertIs<T>(_arg: T): void {}
export function assertNever(_arg: never): never {
  throw new Error()
}
