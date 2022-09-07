import { ZSpecUtils } from '../utils'
import { ZNaN } from './z'

describe('ZNaN', () => {
  ZSpecUtils.buildBaseSpec({
    type: ZNaN,
    typeName: 'ZNaN',
    typeHint: 'NaN',
    shouldParse: [ZSpecUtils._NaN],
    shouldNotParse: [
      [undefined, '"value" is required'],
      [null, '"value" must be a NaN'],
      [-1, '"value" must be a NaN'],
      [0, '"value" must be a NaN'],
      [1, '"value" must be a NaN'],
      ['', '"value" must be a NaN'],
      ['test', '"value" must be a NaN'],
      [[], '"value" must be a NaN'],
      [[-1, 0, 1], '"value" must be a NaN'],
      [['', 'test'], '"value" must be a NaN'],
      [BigInt(-1), '"value" must be a NaN'],
      [BigInt(0), '"value" must be a NaN'],
      [BigInt(1), '"value" must be a NaN'],
    ],
  })
})
