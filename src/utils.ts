import type Joi from 'joi'
import _, {
  cloneDeep,
  isObject as _isObject,
  merge as _merge,
  omit as _omit,
  omitBy as _omitBy,
  pick as _pick,
} from 'lodash'
import type { A, L, O } from 'ts-toolbelt'
import type { Simplify } from 'type-fest'

import type { AnyZManifestObject } from './types'
import { _ZInput, _ZOutput, AnyZ, AnyZObjectShape, ZArray, ZObject, ZOptional } from './z/z'

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

  type _UnionToArray<T extends string> = {
    [K in T]: [...(Exclude<T, K> extends never ? [] : _UnionToArray<Exclude<T, K>>[Exclude<T, K>]), K]
  }
  export type UnionToArray<T extends string> = _UnionToArray<T>[T]
}

export namespace ZTypeUtils {
  export type Nullable<T> = T | null | undefined
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

  export const mergeSafe = <
    T extends [ZTypeUtils.Nullable<AnyStringRecord>, ...ZTypeUtils.Nullable<AnyStringRecord>[]]
  >(
    ...objs: T
  ): Simplify<O.MergeAll<NonNullable<T[0]>, L.Update<L.Tail<T>, PropertyKey, NonNullable<A.x>>, 'deep'>> =>
    merge({}, ...objs.map(obj => cloneDeep(obj)))

  export type ToPartialZObjectShape<Shape extends AnyZObjectShape, Depth extends 'flat' | 'deep' = 'flat'> = {
    flat: { [K in keyof Shape]: ZOptional<Shape[K]> }
    deep: {
      [K in keyof Shape]: Shape[K] extends ZObject<infer S>
        ? ZOptional<ZObject<ToPartialZObjectShape<S, 'deep'>>>
        : ZOptional<Shape[K]>
    }
  }[Depth]

  export const zShapeToJoiSchema = <Shape extends AnyZObjectShape>(shape: Shape): Joi.StrictSchemaMap<Shape> =>
    Object.fromEntries(
      Object.entries(shape).map(([key, z]) => [key, z['_validator']])
    ) as unknown as Joi.StrictSchemaMap<Shape>

  export const getZObjectManifestDeep = <S extends AnyZObjectShape>(shape: S): Record<string, AnyZManifestObject> =>
    Object.entries(shape).reduce(
      (acc, entry) => ({
        ...acc,
        [entry[0]]: entry[1] instanceof ZObject ? getZObjectManifestDeep(entry[1].shape) : entry[1].manifest,
      }),
      {}
    )

  export const isPlainObject = <T>(obj: T): obj is Record<PropertyKey, any> => _.isPlainObject(obj)
}
