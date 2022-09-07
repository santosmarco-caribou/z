import { ZSpecUtils } from '../utils'
import { ZNever } from './z'

describe('ZNever', () => {
  ZSpecUtils.buildBaseSpec({
    type: ZNever,
    typeName: 'ZNever',
    typeHint: 'never',
    shouldParse: [],
    shouldNotParse: [
      [undefined, 'any.required', '"value" is required'],
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
