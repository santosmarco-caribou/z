import { ZSpecUtils } from '../utils'
import { ZNumber } from './z'

describe('ZNumber', () => {
  ZSpecUtils.buildBaseSpec({
    type: ZNumber,
    typeName: 'ZNumber',
    typeHint: 'number',
    shouldParse: [[-1], [-0.5], [0], [0.5], [1]],
    shouldNotParse: [
      [undefined, 'any.required', '"value" is required'],
      [null, 'number.base', '"value" must be a number'],
      [ZSpecUtils._NaN, 'number.base', '"value" must be a number'],
      [false, 'number.base', '"value" must be a number'],
      [true, 'number.base', '"value" must be a number'],
      ['', 'number.base', '"value" must be a number'],
      ['test', 'number.base', '"value" must be a number'],
      [[], 'number.base', '"value" must be a number'],
      [[-1, 0, 1], 'number.base', '"value" must be a number'],
      [['', 'test'], 'number.base', '"value" must be a number'],
      [BigInt(-1), 'number.base', '"value" must be a number'],
      [BigInt(0), 'number.base', '"value" must be a number'],
      [BigInt(1), 'number.base', '"value" must be a number'],
      [Symbol(), 'number.base', '"value" must be a number'],
      [ZSpecUtils._UniqueSymbol, 'number.base', '"value" must be a number'],
    ],
  })

  describe('.integer()', () =>
    ZSpecUtils.buildBaseSpec({
      type: { create: () => ZNumber.create().integer() },
      typeName: 'ZNumber',
      typeHint: 'number',
      shouldParse: [[-1], [0], [1]],
      shouldNotParse: [
        [-0.5, 'number.integer', '"value" must be an integer'],
        [0.5, 'number.integer', '"value" must be an integer'],

        [undefined, 'any.required', '"value" is required'],
        [null, 'number.base', '"value" must be a number'],
        [ZSpecUtils._NaN, 'number.base', '"value" must be a number'],
        [false, 'number.base', '"value" must be a number'],
        [true, 'number.base', '"value" must be a number'],
        ['', 'number.base', '"value" must be a number'],
        ['test', 'number.base', '"value" must be a number'],
        [[], 'number.base', '"value" must be a number'],
        [[-1, 0, 1], 'number.base', '"value" must be a number'],
        [['', 'test'], 'number.base', '"value" must be a number'],
        [BigInt(-1), 'number.base', '"value" must be a number'],
        [BigInt(0), 'number.base', '"value" must be a number'],
        [BigInt(1), 'number.base', '"value" must be a number'],
        [Symbol(), 'number.base', '"value" must be a number'],
        [ZSpecUtils._UniqueSymbol, 'number.base', '"value" must be a number'],
      ],
    }))

  describe('.positive()', () =>
    ZSpecUtils.buildBaseSpec({
      type: { create: () => ZNumber.create().positive() },
      typeName: 'ZNumber',
      typeHint: 'number',
      shouldParse: [[0.5], [1]],
      shouldNotParse: [
        [-1, 'number.positive', '"value" must be a positive number'],
        [-0.5, 'number.positive', '"value" must be a positive number'],
        [0, 'number.positive', '"value" must be a positive number'],

        [undefined, 'any.required', '"value" is required'],
        [null, 'number.base', '"value" must be a number'],
        [ZSpecUtils._NaN, 'number.base', '"value" must be a number'],
        [false, 'number.base', '"value" must be a number'],
        [true, 'number.base', '"value" must be a number'],
        ['', 'number.base', '"value" must be a number'],
        ['test', 'number.base', '"value" must be a number'],
        [[], 'number.base', '"value" must be a number'],
        [[-1, 0, 1], 'number.base', '"value" must be a number'],
        [['', 'test'], 'number.base', '"value" must be a number'],
        [BigInt(-1), 'number.base', '"value" must be a number'],
        [BigInt(0), 'number.base', '"value" must be a number'],
        [BigInt(1), 'number.base', '"value" must be a number'],
        [Symbol(), 'number.base', '"value" must be a number'],
        [ZSpecUtils._UniqueSymbol, 'number.base', '"value" must be a number'],
      ],
    }))

  describe('.nonpositive()', () =>
    ZSpecUtils.buildBaseSpec({
      type: { create: () => ZNumber.create().nonpositive() },
      typeName: 'ZNumber',
      typeHint: 'number',
      shouldParse: [[-1], [-0.5], [0]],
      shouldNotParse: [
        [0.5, 'number.max', '"value" must be less than or equal to 0'],
        [1, 'number.max', '"value" must be less than or equal to 0'],

        [undefined, 'any.required', '"value" is required'],
        [null, 'number.base', '"value" must be a number'],
        [ZSpecUtils._NaN, 'number.base', '"value" must be a number'],
        [false, 'number.base', '"value" must be a number'],
        [true, 'number.base', '"value" must be a number'],
        ['', 'number.base', '"value" must be a number'],
        ['test', 'number.base', '"value" must be a number'],
        [[], 'number.base', '"value" must be a number'],
        [[-1, 0, 1], 'number.base', '"value" must be a number'],
        [['', 'test'], 'number.base', '"value" must be a number'],
        [BigInt(-1), 'number.base', '"value" must be a number'],
        [BigInt(0), 'number.base', '"value" must be a number'],
        [BigInt(1), 'number.base', '"value" must be a number'],
        [Symbol(), 'number.base', '"value" must be a number'],
        [ZSpecUtils._UniqueSymbol, 'number.base', '"value" must be a number'],
      ],
    }))
})
