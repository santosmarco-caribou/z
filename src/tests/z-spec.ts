import type { Promisable } from 'type-fest'

import { ZArrayUtils, ZObjectUtils } from '../utils'
import type { AnyZ } from '../z/z'
import { ZNullableSpecChild, ZNullishSpecChild, ZOptionalSpecChild } from './common-children'

const Z_SPEC_ALL_VALUES = Symbol('Z_SPEC_ALL_VALUES')
const Z_SPEC_UNIQUE_SYMBOL = Symbol('Z_SPEC_UNIQUE_SYMBOL')
const Z_SPEC_BYPASS_CASTING = Symbol('Z_SPEC_BYPASS_CASTING')

// Only used for testing ZInstanceOf
export class Z_SPEC_CLASS {}
abstract class Z_SPEC_ABSTRACT_CLASS {}

const Z_SPEC_VALUE_MAP = {
  // Nil
  undefined: undefined,
  null: null,
  // Booleans
  true: true,
  false: false,
  // Numbers
  NaN: NaN,
  '-1': -1,
  '-0.5': -0.5,
  '-0.25': -0.25,
  '-0.125': -0.125,
  '0': 0,
  '0.125': 0.125,
  '0.25': 0.25,
  '0.5': 0.5,
  '1': 1,
  // Strings
  '""': '',
  '"test"': 'test',
  isodate: '1995-12-17T03:24:00',
  // Arrays
  '[]': [],
  '[-1, 0, 1]': [-1, 0, 1],
  '["", "test"]': ['', 'test'],
  // BigInts
  'BigInt(-1)': BigInt(-1),
  'BigInt(0)': BigInt(0),
  'BigInt(1)': BigInt(1),
  // Dates
  'new Date(0)': new Date(0),
  // Symbols
  symbol: Symbol(),
  'unique symbol': Z_SPEC_UNIQUE_SYMBOL,
  // Classes
  class: new Z_SPEC_CLASS(),
  'abstract class': Z_SPEC_ABSTRACT_CLASS,
} as const

type ZSpecValueKey = keyof typeof Z_SPEC_VALUE_MAP

/* --------------------------------------------------- ShouldParse -------------------------------------------------- */

type ZSpecShouldParseValueConfig = {
  value: ZSpecValueKey
  castTo?: any
}

type ZSpecShouldParseConfig = {
  values: Array<ZSpecValueKey | ZSpecShouldParseValueConfig> | typeof Z_SPEC_ALL_VALUES
  defaultCastTo?: any
}

/* ------------------------------------------------- ShouldNotParse ------------------------------------------------- */

type ZSpecShouldNotParseValueConfig = {
  value: ZSpecValueKey
  errorCode: string
  errorMessage: string
}

type ZSpecShouldNotParseConfig = {
  defaultErrorCode?: string
  defaultErrorMessage?: string
  values?: Array<ZSpecValueKey | ZSpecShouldNotParseValueConfig>
}

/* ----------------------------------------------------- Config ----------------------------------------------------- */

type ZSpecConfig<Z extends AnyZ> = {
  type: { create: () => Z }
  typeName: string
  typeHint: string
  shouldParse: ZSpecShouldParseConfig
  shouldNotParse?: ZSpecShouldNotParseConfig
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZSpec                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZSpec<Z extends AnyZ> {
  private readonly _specs: Array<{ name: string; fn: <_Z extends Z = Z>(z: _Z) => Promisable<void> }> = []
  private readonly _children: AnyZSpec[] = []

  constructor(readonly name: string, readonly config: ZSpecConfig<Z>) {
    const { typeName, typeHint } = this.config

    this.addSpec(`should have a name of ${typeName}`, z => expect(z.name).toStrictEqual(typeName))
    this.addSpec(`should have a hint of '${typeHint}'`, z => expect(z.hint).toStrictEqual(typeHint))
  }

  build(): void {
    const {
      type: { create },
      shouldParse,
    } = this.config

    const shouldParseValueConfigs = this._getShouldParseValueConfigs()
    const shouldNotParseValueConfigs = this._getShouldNotParseValueConfigs()

    describe(this.name, () => {
      let z: Z

      beforeEach(() => {
        z = create()
      })

      this._specs.forEach(({ name, fn }) => it(name, async () => fn(z)))

      describe('should parse', () =>
        shouldParseValueConfigs.forEach(({ value, ...config }) =>
          it(value, () => {
            const parsed = z.safeParse(Z_SPEC_VALUE_MAP[value]).value
            if (typeof parsed === 'bigint') {
              expect(String(parsed)).toStrictEqual(String(Z_SPEC_VALUE_MAP[value]))
            }
            expect(parsed).toStrictEqual(
              'castTo' in config
                ? config.castTo
                : 'defaultCastTo' in shouldParse
                ? shouldParse.defaultCastTo
                : Z_SPEC_VALUE_MAP[value]
            )
          })
        ))

      describe('should not parse', () =>
        shouldNotParseValueConfigs.forEach(({ value, errorCode, errorMessage }) =>
          it(value, () => {
            const { error } = z.safeParse(Z_SPEC_VALUE_MAP[value])
            expect(error?.issues).toHaveLength(1)
            expect(error?.issues[0]?.code).toStrictEqual(errorCode)
            expect(error?.issues[0]?.message).toStrictEqual(errorMessage)
          })
        ))

      this._children.forEach(child => child.build())
    })
  }

  child<_Z extends AnyZ>(spec: ZSpec<_Z>): ZSpec<_Z>
  child<_Z extends AnyZ>(
    name: string,
    config: ZObjectUtils.PartialKeys<ZSpecConfig<_Z>, 'typeName' | 'typeHint'>
  ): ZSpec<_Z>
  child<_Z extends AnyZ>(
    specOrName: ZSpec<_Z> | string,
    config?: ZObjectUtils.PartialKeys<ZSpecConfig<_Z>, 'typeName' | 'typeHint'>
  ): ZSpec<_Z> {
    let child: ZSpec<_Z>

    if (typeof specOrName === 'string' && config) {
      child = new ZSpec(specOrName, { typeName: this.config.typeName, typeHint: this.config.typeHint, ...config })
    } else if (specOrName instanceof ZSpec) {
      child = specOrName
    } else {
      throw new Error('Invalid arguments')
    }

    this._children.push(child)
    return child
  }

  addSpec(name: string, specFn: (z: Z) => Promisable<void>): this {
    this._specs.push({ name, fn: specFn })
    return this
  }

  private _getShouldParseValueConfigs(): ZSpecShouldParseValueConfig[] {
    const shouldParseValues = this.config.shouldParse.values
    const shouldParseValueKeys = [
      ...new Set(
        shouldParseValues === Z_SPEC_ALL_VALUES
          ? ZObjectUtils.keys(Z_SPEC_VALUE_MAP)
          : shouldParseValues.map(value => (typeof value === 'string' ? value : value.value))
      ),
    ].filter(
      value =>
        !this.config.shouldNotParse?.values?.map(val => (typeof val === 'string' ? val : val.value)).includes(value)
    )
    return shouldParseValueKeys
      .map(key => {
        if (typeof shouldParseValues === 'symbol') return { value: key }
        const keyOrConfig = shouldParseValues.find(
          keyOrConfig => keyOrConfig === key || (typeof keyOrConfig !== 'string' && keyOrConfig.value === key)
        )
        return typeof keyOrConfig === 'string' ? { value: keyOrConfig } : keyOrConfig
      })
      .filter((val): val is NonNullable<typeof val> => !!val)
  }

  private _getShouldNotParseValueConfigs(): ZSpecShouldNotParseValueConfig[] {
    const { shouldNotParse } = this.config
    if (!shouldNotParse) return []
    return [
      ...new Set(
        ZArrayUtils.concat(
          ZObjectUtils.keys(Z_SPEC_VALUE_MAP).filter(
            value =>
              !ZArrayUtils.includes(
                ZArrayUtils.concat(
                  this._getValueKeys(this._getShouldParseValueConfigs()),
                  (shouldNotParse.values ?? []).map(value => (typeof value === 'string' ? value : value.value))
                ),
                value
              )
          ),
          shouldNotParse.values ?? []
        )
      ),
    ].map(value =>
      typeof value === 'string'
        ? {
            value,
            errorCode: shouldNotParse.defaultErrorCode ?? '',
            errorMessage: shouldNotParse.defaultErrorMessage ?? '',
          }
        : value
    )
  }

  private _getValueKeys(
    valueConfigs: Array<ZSpecShouldParseValueConfig | ZSpecShouldNotParseValueConfig>
  ): ZSpecValueKey[] {
    return valueConfigs.map(({ value }) => value)
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <Z extends AnyZ>(name: string, config: ZSpecConfig<Z>): ZSpec<Z> => {
    const spec = new ZSpec(name, config)

    spec.child(ZOptionalSpecChild(spec))
    spec.child(ZNullableSpecChild(spec))
    spec.child(ZNullishSpecChild(spec))

    return spec
  }

  static ALL: typeof Z_SPEC_ALL_VALUES = Z_SPEC_ALL_VALUES
  static UNIQUE_SYMBOL: typeof Z_SPEC_UNIQUE_SYMBOL = Z_SPEC_UNIQUE_SYMBOL
  static BYPASS_CASTING: typeof Z_SPEC_BYPASS_CASTING = Z_SPEC_BYPASS_CASTING
}

/* ------------------------------------------------------------------------------------------------------------------ */

export type AnyZSpec = ZSpec<AnyZ>
