import type { TypeUtils } from './types'

export namespace ArrayUtils {
  export const ensureArray = <T>(input: TypeUtils.MaybeArray<T>): T[] =>
    Array.isArray(input) ? input : [input]
}
