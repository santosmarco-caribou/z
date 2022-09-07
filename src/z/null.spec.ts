import { ZSpecUtils } from '../utils'
import { ZNull } from './z'

describe('ZNull', () => {
  ZSpecUtils.buildBaseSpec({
    type: ZNull,
    typeName: 'ZNull',
    typeHint: 'null',
    shouldParse: [[null]],
    shouldNotParse: [
      [undefined, 'any.required', '"value" is required'],
      [ZSpecUtils._NaN, 'any.only', '"value" must be [null]'],
      [false, 'any.only', '"value" must be [null]'],
      [true, 'any.only', '"value" must be [null]'],
      [-1, 'any.only', '"value" must be [null]'],
      [0, 'any.only', '"value" must be [null]'],
      [1, 'any.only', '"value" must be [null]'],
      ['', 'any.only', '"value" must be [null]'],
      ['test', 'any.only', '"value" must be [null]'],
      [[], 'any.only', '"value" must be [null]'],
      [[-1, 0, 1], 'any.only', '"value" must be [null]'],
      [['', 'test'], 'any.only', '"value" must be [null]'],
      [BigInt(-1), 'any.only', '"value" must be [null]'],
      [BigInt(0), 'any.only', '"value" must be [null]'],
      [BigInt(1), 'any.only', '"value" must be [null]'],
    ],
  })
})
