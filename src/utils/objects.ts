import { cloneDeep as _cloneDeep, mergeWith as _mergeWith } from 'lodash'
import type { O } from 'ts-toolbelt'

import type { TypeUtils } from './types'

export namespace ObjectUtils {
  export const cloneDeep = <T>(input: T): T => _cloneDeep(input)

  const _mergeDeepCustomizer = (objValue: any, srcValue: any) =>
    Array.isArray(objValue) ? objValue.concat(srcValue) : undefined

  export const mergeDeep = <T extends [O.Object, ...O.Object[]]>(
    ...objs: T
  ): TypeUtils.MergeDeep<T> =>
    _mergeWith(objs[0], ...objs.slice(1), _mergeDeepCustomizer)
  export const mergeDeepSafe = <T extends [O.Object, ...O.Object[]]>(
    ...objs: T
  ): TypeUtils.MergeDeep<T> =>
    _mergeWith({}, ...objs.map(cloneDeep), _mergeDeepCustomizer)

  export const freezeDeep = <T>(input: T): TypeUtils.ReadonlyDeep<T> => {
    const _input = input as Record<PropertyKey, any>
    Object.getOwnPropertyNames(_input).forEach(prop =>
      _input[prop] && typeof _input[prop] === 'object'
        ? freezeDeep(_input[prop])
        : Object.freeze(_input[prop])
    )
    return Object.freeze(_input) as TypeUtils.ReadonlyDeep<T>
  }
}
