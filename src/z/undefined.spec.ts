import { ZSpecUtils } from '../utils'
import { ZUndefined } from './z'

describe('ZUndefined', () => {
  ZSpecUtils.buildBaseSpec({
    type: ZUndefined,
    typeName: 'ZUndefined',
    typeHint: 'undefined',
    shouldParse: [[undefined]],
    shouldNotParse: [
      [null, 'any.unknown', '"value" is not allowed'],
      [ZSpecUtils._NaN, 'any.unknown', '"value" is not allowed'],
      [false, 'any.unknown', '"value" is not allowed'],
      [true, 'any.unknown', '"value" is not allowed'],
      [-1, 'any.unknown', '"value" is not allowed'],
      [0, 'any.unknown', '"value" is not allowed'],
      [1, 'any.unknown', '"value" is not allowed'],
      ['', 'any.unknown', '"value" is not allowed'],
      ['test', 'any.unknown', '"value" is not allowed'],
      [[], 'any.unknown', '"value" is not allowed'],
      [[-1, 0, 1], 'any.unknown', '"value" is not allowed'],
      [['', 'test'], 'any.unknown', '"value" is not allowed'],
      [BigInt(-1), 'any.unknown', '"value" is not allowed'],
      [BigInt(0), 'any.unknown', '"value" is not allowed'],
      [BigInt(1), 'any.unknown', '"value" is not allowed'],
    ],
  })
})
