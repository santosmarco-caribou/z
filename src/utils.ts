import { merge as _merge, omit as _omit, pick as _pick } from 'lodash'
import type { A, O } from 'ts-toolbelt'

import type { AnyZ, ZInput, ZOutput } from './z/z'

export namespace ZUtils {
  export type MaybeArray<T> = T | T[]
  export type AtLeastOne<T> = [T, ...T[]]

  export type Simplify<T, Options extends { flat?: boolean } = { flat: false }> = A.Compute<
    T,
    Options['flat'] extends true ? 'flat' : 'deep'
  >

  export type RequiredDeep<T extends O.Object> = O.Required<T, PropertyKey, 'deep'>
  export type MergeDeep<A extends O.Object, B extends O.Object> = O.Merge<A, B, 'deep'>

  export type OmitInternals<T extends O.Object> = Omit<T, `${'$_' | '_'}${string}`>

  export type MapToZOutput<T> = Simplify<{ [K in keyof T]: T[K] extends AnyZ ? ZOutput<T[K]> : never }>
  export type MapToZInput<T> = Simplify<{ [K in keyof T]: T[K] extends AnyZ ? ZInput<T[K]> : never }>

  export const pick = _pick
  export const omit = _omit
  export const merge = _merge
}
