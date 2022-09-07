import { ZSpecUtils } from '../utils'
import { ZBigInt } from './z'

describe('ZBigInt', () => {
  ZSpecUtils.buildBaseSpec({
    type: ZBigInt,
    typeName: 'ZBigInt',
    typeHint: 'bigint',
    shouldParse: [BigInt(-1), BigInt(0), BigInt(1)],
    shouldNotParse: [
      [undefined, '"value" is required'],
      [null, '"value" must be a bigint'],
      [ZSpecUtils._NaN, '"value" must be a bigint'],
      [-1, '"value" must be a bigint'],
      [0, '"value" must be a bigint'],
      [1, '"value" must be a bigint'],
      ['', '"value" must be a bigint'],
      ['test', '"value" must be a bigint'],
      [[], '"value" must be a bigint'],
      [[-1, 0, 1], '"value" must be a bigint'],
      [['', 'test'], '"value" must be a bigint'],
    ],
  })
})
