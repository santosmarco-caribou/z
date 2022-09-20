import {
  cloneDeep as _cloneDeep,
  merge,
  mergeWith,
  omit as _omit,
  pick as _pick,
} from 'lodash'
import type { L, O } from 'ts-toolbelt'
import type { Simplify } from 'type-fest'

import type { TypeUtils } from './types'

export namespace ObjectUtils {
  /* -------------------------------- Cloning ------------------------------- */

  export const cloneDeep = _cloneDeep

  /* -------------------------------- Merging ------------------------------- */

  export const mergeAssign = merge
  export const mergeAssignWith = mergeWith

  export const mergeSafe = <
    T extends [TypeUtils.AnyObject, ...TypeUtils.AnyObject[]]
  >(
    ...objs: T
  ): Simplify<O.MergeAll<T[0], L.Tail<T>, 'deep'>> =>
    mergeAssignWith(
      {},
      ...objs.map(cloneDeep),
      (objValue: any, srcValue: any) =>
        Array.isArray(objValue) ? objValue.concat(srcValue) : undefined
    )

  /* --------------------------- Picking/Omitting --------------------------- */

  export const pick = _pick
  export const omit = _omit
}
