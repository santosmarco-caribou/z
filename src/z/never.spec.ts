import { ZSpecUtils } from '../utils'
import { ZNever } from './z'

describe('ZNever', () => {
  ZSpecUtils.buildBaseSpec({
    type: ZNever,
    typeName: 'ZNever',
    typeHint: 'never',
    shouldParse: [],
    shouldNotParse: [
      [undefined, '"value" is required'],
      [null, '"value" is not allowed'],
      [ZSpecUtils._NaN, '"value" is not allowed'],
      [-1, '"value" is not allowed'],
      [0, '"value" is not allowed'],
      [1, '"value" is not allowed'],
      ['', '"value" is not allowed'],
      ['test', '"value" is not allowed'],
      [[], '"value" is not allowed'],
      [[-1, 0, 1], '"value" is not allowed'],
      [['', 'test'], '"value" is not allowed'],
      [BigInt(-1), '"value" is not allowed'],
      [BigInt(0), '"value" is not allowed'],
      [BigInt(1), '"value" is not allowed'],
    ],
  })
})
