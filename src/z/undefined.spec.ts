import { ZSpecUtils } from '../utils'
import { ZUndefined } from './z'

describe('ZUndefined', () => {
  ZSpecUtils.buildBaseSpec({
    type: ZUndefined,
    typeName: 'ZUndefined',
    typeHint: 'undefined',
    shouldParse: [undefined],
    shouldNotParse: [
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
