import { isObject as _isObject, merge as _merge, omit as _omit, pick as _pick } from 'lodash'
import type { A, F, N, O } from 'ts-toolbelt'
import type { FixedLengthArray, LiteralUnion, Promisable } from 'type-fest'

import type { _ZInput, _ZOutput, AnyZ } from './z/z'

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

  export type MapToZOutput<T> = Simplify<{ [K in keyof T]: T[K] extends AnyZ ? _ZOutput<T[K]> : never }>
  export type MapToZInput<T> = Simplify<{ [K in keyof T]: T[K] extends AnyZ ? _ZInput<T[K]> : never }>

  export const hasProp = <T, P extends string>(obj: T, prop: P): obj is T & Record<P, any> =>
    _isObject(obj) && prop in obj

  export const pick = _pick
  export const omit = _omit
  export const merge = _merge
}

export namespace ZSpecUtils {
  export const _NaN = NaN as unknown as A.x

  const TYPE_SPEC_BASE_VALUES = [
    undefined,
    null,
    _NaN,
    false,
    true,
    -1,
    0,
    1,
    '',
    'test',
    [],
    [-1, 0, 1],
    ['', 'test'],
    BigInt(-1),
    BigInt(0),
    BigInt(1),
  ] as const

  type TypeSpecBaseValues = typeof TYPE_SPEC_BASE_VALUES
  type TypeSpecBaseValue = TypeSpecBaseValues[number]

  type TypeSpecConfig<Z extends AnyZ, ShouldParseValues extends TypeSpecBaseValue[]> = {
    type: { create: () => Z }
    typeName: string
    typeHint: string
    shouldParse: {
      [K in keyof ShouldParseValues]: [value: ShouldParseValues[K], parseTo?: any]
    }
    shouldNotParse: N.Sub<TypeSpecBaseValues['length'], ShouldParseValues['length']> extends 0
      ? never[]
      : FixedLengthArray<
          [value: Exclude<TypeSpecBaseValue, ShouldParseValues[number]>, errorCode: string, errorMessage: string],
          N.Sub<TypeSpecBaseValues['length'], ShouldParseValues['length']>
        >
    extra?: {
      [K in LiteralUnion<'.', string>]?: [name: string, fn: (z: Z) => Promisable<void>][]
    }
  }

  const stringifySpecValue = (value: any): string =>
    value === undefined
      ? 'undefined'
      : typeof value === 'number' && isNaN(value)
      ? 'NaN'
      : typeof value === 'bigint'
      ? `BigInt(${value})`
      : Array.isArray(value)
      ? `[${value.map(val => JSON.stringify(val)).join(', ')}]`
      : JSON.stringify(value)

  const getSpecName = (value: any, subTitles?: Record<string, string>): string =>
    stringifySpecValue(value).padEnd(13) +
    (subTitles
      ? ` ${Object.entries(subTitles)
          .map(([k, v]) => `${k}: ${v}`)
          .join('; ')}`
      : '')

  /* ---------------------------------------------------------------------------------------------------------------- */

  export const buildBaseSpec = <Z extends AnyZ, ShouldParseValues extends TypeSpecBaseValue[]>(
    config: F.Narrow<TypeSpecConfig<Z, ShouldParseValues>>
  ) => {
    const {
      type: { create },
      typeName,
      typeHint,
      shouldParse,
      shouldNotParse,
      extra,
    } = config

    let z: Z

    beforeEach(() => {
      z = create()
    })

    it(`should have a name of '${typeName}'`, () => {
      expect(z.name).toBe(typeName)
    })

    it(`should have a hint of '${typeHint}'`, () => {
      expect(z.hint).toBe(typeHint)
    })

    extra?.['.']?.forEach(([name, fn]) => it(name, async () => fn(z)))

    /* -------------------------------------------------------------------------------------------------------------- */

    describe('should parse:', () => {
      shouldParse.forEach(def => {
        const [value, parseTo] = def
        const containsParseTo = def.length === 2
        it(getSpecName(value, containsParseTo ? { to: stringifySpecValue(parseTo) } : undefined), () => {
          expect(z.safeParse(value).value).toStrictEqual(containsParseTo ? parseTo : value)
        })
      })
    })

    /* -------------------------------------------------------------------------------------------------------------- */

    describe('should not parse:', () => {
      const _shouldNotParse = shouldNotParse as [value: TypeSpecBaseValue, errorCode: string, errorMessage: string][]
      _shouldNotParse.forEach(([value, errorCode, errorMessage]) => {
        it(getSpecName(value, { 'w/ code': errorCode, msg: errorMessage }), () => {
          const { error } = z.safeParse(value)
          expect(error?.issues).toHaveLength(1)
          expect(error?.issues[0]?.code).toBe(errorCode)
          expect(error?.issues[0]?.message).toBe(errorMessage)
        })
      })
    })

    /* -------------------------------------------------------------------------------------------------------------- */

    extra &&
      Object.entries(extra)
        .filter(([key]) => key !== '.')
        .forEach(([, specs]) => specs?.forEach(([name, fn]) => it(name, async () => fn(z))))
  }
}
