import { ZSpecUtils } from '../utils'
import { ZBoolean, ZFalse, ZTrue } from './z'

describe('ZBoolean', () => {
  ZSpecUtils.buildBaseSpec({
    type: ZBoolean,
    typeName: 'ZBoolean',
    typeHint: 'boolean',
    shouldParse: [[false], [true]],
    shouldNotParse: [
      [undefined, 'any.required', '"value" is required'],
      [null, 'boolean.base', '"value" must be a boolean'],
      [ZSpecUtils._NaN, 'boolean.base', '"value" must be a boolean'],
      [-1, 'boolean.base', '"value" must be a boolean'],
      [0, 'boolean.base', '"value" must be a boolean'],
      [1, 'boolean.base', '"value" must be a boolean'],
      ['', 'boolean.base', '"value" must be a boolean'],
      ['test', 'boolean.base', '"value" must be a boolean'],
      [[], 'boolean.base', '"value" must be a boolean'],
      [[-1, 0, 1], 'boolean.base', '"value" must be a boolean'],
      [['', 'test'], 'boolean.base', '"value" must be a boolean'],
      [BigInt(-1), 'boolean.base', '"value" must be a boolean'],
      [BigInt(0), 'boolean.base', '"value" must be a boolean'],
      [BigInt(1), 'boolean.base', '"value" must be a boolean'],
      [Symbol(), 'boolean.base', '"value" must be a boolean'],
      [ZSpecUtils._UniqueSymbol, 'boolean.base', '"value" must be a boolean'],
    ],
    extra: {
      '.': [
        ['.truthy() should return an instance of ZTrue', z => expect(z.truthy()).toBeInstanceOf(ZTrue)],
        ['.falsy() should return an instance of ZFalse', z => expect(z.falsy()).toBeInstanceOf(ZFalse)],
      ],
    },
  })

  describe('ZTrue', () => {
    ZSpecUtils.buildBaseSpec({
      type: ZTrue,
      typeName: 'ZTrue',
      typeHint: 'true',
      shouldParse: [[true]],
      shouldNotParse: [
        [undefined, 'any.required', '"value" is required'],
        [null, 'any.only', '"value" must be [true]'],
        [ZSpecUtils._NaN, 'any.only', '"value" must be [true]'],
        [false, 'any.only', '"value" must be [true]'],
        [-1, 'any.only', '"value" must be [true]'],
        [0, 'any.only', '"value" must be [true]'],
        [1, 'any.only', '"value" must be [true]'],
        ['', 'any.only', '"value" must be [true]'],
        ['test', 'any.only', '"value" must be [true]'],
        [[], 'any.only', '"value" must be [true]'],
        [[-1, 0, 1], 'any.only', '"value" must be [true]'],
        [['', 'test'], 'any.only', '"value" must be [true]'],
        [BigInt(-1), 'any.only', '"value" must be [true]'],
        [BigInt(0), 'any.only', '"value" must be [true]'],
        [BigInt(1), 'any.only', '"value" must be [true]'],
        [Symbol(), 'any.only', '"value" must be [true]'],
        [ZSpecUtils._UniqueSymbol, 'any.only', '"value" must be [true]'],
      ],
    })
  })

  describe('ZFalse', () => {
    ZSpecUtils.buildBaseSpec({
      type: ZFalse,
      typeName: 'ZFalse',
      typeHint: 'false',
      shouldParse: [[false]],
      shouldNotParse: [
        [undefined, 'any.required', '"value" is required'],
        [null, 'any.only', '"value" must be [false]'],
        [ZSpecUtils._NaN, 'any.only', '"value" must be [false]'],
        [true, 'any.only', '"value" must be [false]'],
        [-1, 'any.only', '"value" must be [false]'],
        [0, 'any.only', '"value" must be [false]'],
        [1, 'any.only', '"value" must be [false]'],
        ['', 'any.only', '"value" must be [false]'],
        ['test', 'any.only', '"value" must be [false]'],
        [[], 'any.only', '"value" must be [false]'],
        [[-1, 0, 1], 'any.only', '"value" must be [false]'],
        [['', 'test'], 'any.only', '"value" must be [false]'],
        [BigInt(-1), 'any.only', '"value" must be [false]'],
        [BigInt(0), 'any.only', '"value" must be [false]'],
        [BigInt(1), 'any.only', '"value" must be [false]'],
        [Symbol(), 'any.only', '"value" must be [false]'],
        [ZSpecUtils._UniqueSymbol, 'any.only', '"value" must be [false]'],
      ],
    })
  })
})
