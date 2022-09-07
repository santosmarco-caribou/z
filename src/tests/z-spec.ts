import type { Promisable } from 'type-fest'

import { ZArrayUtils, ZObjectUtils } from '../utils'
import type { AnyZ } from '../z/z'

const Z_SPEC_ALL_VALUES = Symbol('Z_SPEC_ALL_VALUES')
const Z_SPEC_UNIQUE_SYMBOL = Symbol('Z_SPEC_UNIQUE_SYMBOL')

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
  // Arrays
  '[]': [],
  '[-1, 0, 1]': [-1, 0, 1],
  '["", "test"]': ['', 'test'],
  // BigInts
  'BigInt(-1)': BigInt(-1),
  'BigInt(0)': BigInt(0),
  'BigInt(1)': BigInt(1),
  // Symbols
  symbol: Symbol(),
  'unique symbol': Z_SPEC_UNIQUE_SYMBOL,
} as const

type ZSpecValueKey = keyof typeof Z_SPEC_VALUE_MAP

/* --------------------------------------------------- ShouldParse -------------------------------------------------- */

type ZSpecShouldParseValueConfig = {
  value: ZSpecValueKey
  castTo?: any
}

type ShouldParseValues = Array<ZSpecValueKey | ZSpecShouldParseValueConfig> | typeof Z_SPEC_ALL_VALUES

type ZSpecShouldParseConfig<V extends ShouldParseValues> = {
  values: V
  defaultCastTo?: any
}

/* ------------------------------------------------- ShouldNotParse ------------------------------------------------- */

type ZSpecShouldNotParseValueConfig = {
  value: ZSpecValueKey
  errorCode: string
  errorMessage: string
}

type ShouldNotParseValues = Array<ZSpecValueKey | ZSpecShouldNotParseValueConfig>

type ZSpecShouldNotParseConfig<V extends ShouldNotParseValues> = {
  defaultErrorCode: string
  defaultErrorMessage: string
  values?: V
}

/* ----------------------------------------------------- Config ----------------------------------------------------- */

type ZSpecConfig<Z extends AnyZ, SPV extends ShouldParseValues> = {
  type: { create: () => Z }
  typeName: string
  typeHint: string
  shouldParse: ZSpecShouldParseConfig<SPV>
} & (SPV extends typeof Z_SPEC_ALL_VALUES
  ? {
      shouldNotParse?: {
        [K in keyof ZSpecShouldNotParseConfig<ShouldNotParseValues>]?: never
      }
    }
  : { shouldNotParse: ZSpecShouldNotParseConfig<Exclude<ShouldNotParseValues, Exclude<SPV, symbol>[number]>> })

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZSpec                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZSpec<Z extends AnyZ, SPV extends ShouldParseValues> {
  private readonly _specs: Array<{ name: string; fn: (z: Z) => Promisable<void> }> = []
  private readonly _children: AnyZSpec[] = []

  private constructor(private readonly _name: string, private readonly _config: ZSpecConfig<Z, SPV>) {
    const { typeName, typeHint } = this._config

    this.addSpec(`should have a name of ${typeName}`, z => expect(z.name).toStrictEqual(typeName))
    this.addSpec(`should have a hint of '${typeHint}'`, z => expect(z.hint).toStrictEqual(typeHint))
  }

  build(): void {
    const {
      type: { create },
      shouldParse,
    } = this._config

    const shouldParseValueConfigs = this._getShouldParseValueConfigs()
    const shouldParseValueKeys = this._getValueKeys(shouldParseValueConfigs)

    const shouldNotParseValueConfigs = this._getShouldNotParseValueConfigs()
    const shouldNotParseValueKeys = this._getValueKeys(shouldNotParseValueConfigs)

    describe(this._name, () => {
      let z: Z

      beforeEach(() => {
        z = create()
      })

      this._specs.forEach(({ name, fn }) => it(name, async () => fn(z)))

      shouldParseValueKeys.length &&
        it(`should parse ${
          this._isAllKeys(shouldParseValueConfigs) ? 'everything' : `{ ${shouldParseValueKeys.join(', ')} }`
        }`, () =>
          shouldParseValueConfigs.forEach(config =>
            expect(z.safeParse(Z_SPEC_VALUE_MAP[config.value]).value).toStrictEqual(
              'castTo' in config
                ? config.castTo
                : 'defaultCastTo' in shouldParse
                ? shouldParse.defaultCastTo
                : Z_SPEC_VALUE_MAP[config.value]
            )
          ))

      shouldNotParseValueKeys.length &&
        it(`should not parse ${
          this._isAllKeys(shouldNotParseValueConfigs) ? 'anything' : `{ ${shouldNotParseValueKeys.join(', ')} }`
        }`, () =>
          shouldNotParseValueConfigs.forEach(({ value, errorCode, errorMessage }) => {
            const { error } = z.safeParse(Z_SPEC_VALUE_MAP[value])
            expect(error?.issues).toHaveLength(1)
            expect(error?.issues[0]?.code).toStrictEqual(errorCode)
            expect(error?.issues[0]?.message).toStrictEqual(errorMessage)
          }))

      this._children.forEach(child => child.build())
    })
  }

  child<_Z extends AnyZ, _SPV extends ShouldParseValues>(
    name: string,
    config: ZObjectUtils.PartialKeys<ZSpecConfig<_Z, _SPV>, 'typeName' | 'typeHint'>
  ): ZSpec<_Z, _SPV> {
    const child = ZSpec.create(name, {
      ...config,
      typeName: config.typeName ?? this._config.typeName,
      typeHint: config.typeHint ?? this._config.typeHint,
    } as unknown as ZSpecConfig<_Z, _SPV>)
    this._children.push(child)
    return child
  }

  addSpec(name: string, specFn: (z: Z) => Promisable<void>): this {
    this._specs.push({ name, fn: specFn })
    return this
  }

  private _getShouldParseValueConfigs(): ZSpecShouldParseValueConfig[] {
    return this._config.shouldParse.values === Z_SPEC_ALL_VALUES
      ? ZObjectUtils.keys(Z_SPEC_VALUE_MAP).map(value => ({ value }))
      : this._config.shouldParse.values.map(value => (typeof value === 'string' ? { value } : value))
  }

  private _getShouldNotParseValueConfigs(): ZSpecShouldNotParseValueConfig[] {
    const { shouldNotParse } = this._config

    if (!shouldNotParse) return []
    else
      return ZArrayUtils.concat(
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
      ).map(value =>
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

  private _isAllKeys(valueConfigs: Array<ZSpecShouldParseValueConfig | ZSpecShouldNotParseValueConfig>): boolean {
    return valueConfigs.length === ZObjectUtils.keys(Z_SPEC_VALUE_MAP).length
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <Z extends AnyZ, SPV extends ShouldParseValues>(
    name: string,
    config: ZSpecConfig<Z, SPV>
  ): ZSpec<Z, SPV> => new ZSpec(name, config)

  static ALL: typeof Z_SPEC_ALL_VALUES = Z_SPEC_ALL_VALUES
  static UNIQUE_SYMBOL: typeof Z_SPEC_UNIQUE_SYMBOL = Z_SPEC_UNIQUE_SYMBOL
}

/* ------------------------------------------------------------------------------------------------------------------ */

export type AnyZSpec = ZSpec<any, any>
