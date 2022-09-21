import type { L, O } from 'ts-toolbelt'
import type {
  PartialDeep as _PartialDeep,
  ReadonlyDeep as _ReadonlyDeep,
} from 'type-fest'

export namespace TypeUtils {
  export type MaybeArray<T> = T | T[]

  export type PartialDeep<T> = _PartialDeep<T>
  export type RequiredDeep<T extends O.Object> = O.Required<
    T,
    PropertyKey,
    'deep'
  >

  export type ReadonlyDeep<T> = _ReadonlyDeep<T>

  export type MergeDeep<Objs extends [O.Object, ...O.Object[]]> = O.MergeAll<
    Objs[0],
    L.Tail<Objs>,
    'deep'
  >
}
