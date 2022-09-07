import type Joi from 'joi'
import { isObject as _isObject, merge as _merge, omit as _omit, omitBy as _omitBy, pick as _pick } from 'lodash'
import type { A, L, O } from 'ts-toolbelt'

import { _ZInput, _ZOutput, AnyZ, AnyZObjectShape, ZArray, ZObject } from './z/z'

export namespace ZUtils {
  export type MaybeArray<T> = T | T[]
  export type AtLeastOne<T> = [T, ...T[]]

  export type Simplify<T, Options extends { flat?: boolean } = { flat: false }> = A.Compute<
    T,
    Options['flat'] extends true ? 'flat' : 'deep'
  >

  type OptionalKeys<T extends O.Object> = {
    [K in keyof T]: undefined extends T[K] ? K : never
  }[keyof T]
  type RequiredKeys<T extends O.Object> = {
    [K in keyof T]: undefined extends T[K] ? never : K
  }[keyof T]

  export type RequiredDeep<T extends O.Object> = O.Required<T, PropertyKey, 'deep'>
  export type MergeDeep<A extends O.Object, B extends O.Object> = O.Merge<A, B, 'deep'>

  export type OmitInternals<T extends O.Object> = Omit<T, `${'$_' | '_'}${string}`>

  export type WithQuestionMarks<T extends O.Object> = Pick<T, RequiredKeys<T>> & Partial<Pick<T, OptionalKeys<T>>>

  export type Function<P extends L.List = L.List<any>, R = any> = (...args: P) => R

  export type MapToZOutput<T> = Simplify<{ [K in keyof T]: T[K] extends AnyZ ? _ZOutput<T[K]> : never }>
  export type MapToZInput<T> = Simplify<{ [K in keyof T]: T[K] extends AnyZ ? _ZInput<T[K]> : never }>

  export const hasProp = <T, P extends string>(obj: T, prop: P): obj is T & Record<P, any> =>
    _isObject(obj) && prop in obj

  export const pick = _pick
  export const omit = _omit
  export const merge = _merge

  export const unionizeHints = (...hints: string[]): string => [...new Set(hints)].join(' | ')
  export const generateZObjectHint = (shape: AnyZObjectShape): string => {
    const _generateHint = (_shape: AnyZObjectShape, indentation = 2): string =>
      '{\n' +
      Object.entries(_shape)
        .map(
          ([key, z]) =>
            `${' '.repeat(indentation)}${key}${z.isOptional() ? '?' : ''}: ${
              z instanceof ZObject
                ? _generateHint(z.shape as AnyZObjectShape, indentation + 2)
                : z instanceof ZArray && z.element instanceof ZObject
                ? `Array<${_generateHint(z.element.shape as AnyZObjectShape, indentation + 2)}>`
                : z.hint
            },`
        )
        .join('\n') +
      `\n${' '.repeat(indentation - 2)}}`
    return _generateHint(shape)
  }
}

export namespace ZArrayUtils {
  export type AnyArray = any[] | readonly any[]

  export type Concat<Arrs extends AnyArray[]> = Arrs extends [infer Head, ...infer Rest]
    ? [
        ...(Head extends AnyArray ? Head : []),
        ...(Rest extends AnyArray[] ? Concat<Rest> : Rest extends AnyArray ? Rest : [])
      ]
    : []

  export const concat = <T extends [AnyArray, ...AnyArray[]]>(...arrs: T): Concat<T> =>
    arrs[0].concat(...arrs.slice(1)) as Concat<T>
  export const includes = <T extends AnyArray, U>(arr: T, value: U): value is T[number] => arr.includes(value)
  export const omitBy = <T>(arr: T[], predicate: (value: T, key: number) => boolean): T[] => arr.filter(predicate)
}

export namespace ZObjectUtils {
  export type AnyStringRecord = Record<string, any>

  export type PartialKeys<T extends AnyStringRecord, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>

  export const keys = <T extends AnyStringRecord>(obj: T): (keyof T)[] => Object.keys(obj) as (keyof T)[]

  export const pick = _pick
  export const omit = _omit
  export const omitBy = _omitBy
  export const merge = _merge

  export const zShapeToJoiSchema = <Shape extends AnyZObjectShape>(shape: Shape): Joi.StrictSchemaMap<Shape> =>
    Object.fromEntries(
      Object.entries(shape).map(([key, z]) => [key, z._validator])
    ) as unknown as Joi.StrictSchemaMap<Shape>
}
