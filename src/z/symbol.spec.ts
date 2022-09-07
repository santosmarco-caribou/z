import { ZSpecUtils } from '../utils'
import { ZSymbol, ZUniqueSymbol } from './z'

describe('ZSymbol', () => {
  ZSpecUtils.buildBaseSpec({
    type: ZSymbol,
    typeName: 'ZSymbol',
    typeHint: 'symbol',
    shouldParse: [[Symbol()], [ZSpecUtils._UniqueSymbol]],
    shouldNotParse: [
      [undefined, 'any.required', '"value" is required'],
      [null, 'symbol.base', '"value" must be a symbol'],
      [ZSpecUtils._NaN, 'symbol.base', '"value" must be a symbol'],
      [false, 'symbol.base', '"value" must be a symbol'],
      [true, 'symbol.base', '"value" must be a symbol'],
      [-1, 'symbol.base', '"value" must be a symbol'],
      [0, 'symbol.base', '"value" must be a symbol'],
      [1, 'symbol.base', '"value" must be a symbol'],
      ['', 'symbol.base', '"value" must be a symbol'],
      ['test', 'symbol.base', '"value" must be a symbol'],
      [[], 'symbol.base', '"value" must be a symbol'],
      [[-1, 0, 1], 'symbol.base', '"value" must be a symbol'],
      [['', 'test'], 'symbol.base', '"value" must be a symbol'],
      [BigInt(-1), 'symbol.base', '"value" must be a symbol'],
      [BigInt(0), 'symbol.base', '"value" must be a symbol'],
      [BigInt(1), 'symbol.base', '"value" must be a symbol'],
    ],
    extra: {
      '.': [
        [
          '.unique() should return an instance of ZUniqueSymbol',
          z => expect(z.unique(ZSpecUtils._UniqueSymbol)).toBeInstanceOf(ZUniqueSymbol),
        ],
      ],
    },
  })

  describe('ZUniqueSymbol', () => {
    ZSpecUtils.buildBaseSpec({
      type: { create: () => ZUniqueSymbol.create(ZSpecUtils._UniqueSymbol) },
      typeName: 'ZUniqueSymbol',
      typeHint: 'Symbol(uniq)',
      shouldParse: [[ZSpecUtils._UniqueSymbol]],
      shouldNotParse: [
        [undefined, 'any.required', '"value" is required'],
        [null, 'symbol.map', '"value" must be one of [uniq -> Symbol(uniq)]'],
        [ZSpecUtils._NaN, 'symbol.map', '"value" must be one of [uniq -> Symbol(uniq)]'],
        [false, 'symbol.map', '"value" must be one of [uniq -> Symbol(uniq)]'],
        [true, 'symbol.map', '"value" must be one of [uniq -> Symbol(uniq)]'],
        [-1, 'symbol.map', '"value" must be one of [uniq -> Symbol(uniq)]'],
        [0, 'symbol.map', '"value" must be one of [uniq -> Symbol(uniq)]'],
        [1, 'symbol.map', '"value" must be one of [uniq -> Symbol(uniq)]'],
        ['', 'symbol.map', '"value" must be one of [uniq -> Symbol(uniq)]'],
        ['test', 'symbol.map', '"value" must be one of [uniq -> Symbol(uniq)]'],
        [[], 'symbol.map', '"value" must be one of [uniq -> Symbol(uniq)]'],
        [[-1, 0, 1], 'symbol.map', '"value" must be one of [uniq -> Symbol(uniq)]'],
        [['', 'test'], 'symbol.map', '"value" must be one of [uniq -> Symbol(uniq)]'],
        [BigInt(-1), 'symbol.map', '"value" must be one of [uniq -> Symbol(uniq)]'],
        [BigInt(0), 'symbol.map', '"value" must be one of [uniq -> Symbol(uniq)]'],
        [BigInt(1), 'symbol.map', '"value" must be one of [uniq -> Symbol(uniq)]'],
        [Symbol(), 'any.only', '"value" must be [Symbol(uniq)]'],
      ],
      extra: {
        '.': [
          ['.symbol should return the symbol', z => expect(z.symbol).toStrictEqual(ZSpecUtils._UniqueSymbol)],
          [
            'should throw an error when the symbol has no description',
            () => {
              const uniqSymbol = Symbol()
              expect(() => ZUniqueSymbol.create(uniqSymbol)).toThrowError('The provided symbol must have a description')
            },
          ],
        ],
      },
    })
  })
})
