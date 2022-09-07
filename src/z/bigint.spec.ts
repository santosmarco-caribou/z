import { ZSpecUtils } from '../utils'
import { ZBigInt } from './z'

describe('ZBigInt', () => {
  ZSpecUtils.buildBaseSpec({
    type: ZBigInt,
    typeName: 'ZBigInt',
    typeHint: 'bigint',
    shouldParse: [[BigInt(-1)], [BigInt(0)], [BigInt(1)]],
    shouldNotParse: [
      [undefined, 'any.required', '"value" is required'],
      [null, 'bigint.base', '"value" must be a bigint'],
      [ZSpecUtils._NaN, 'bigint.base', '"value" must be a bigint'],
      [false, 'bigint.base', '"value" must be a bigint'],
      [true, 'bigint.base', '"value" must be a bigint'],
      [-1, 'bigint.base', '"value" must be a bigint'],
      [0, 'bigint.base', '"value" must be a bigint'],
      [1, 'bigint.base', '"value" must be a bigint'],
      ['', 'bigint.base', '"value" must be a bigint'],
      ['test', 'bigint.base', '"value" must be a bigint'],
      [[], 'bigint.base', '"value" must be a bigint'],
      [[-1, 0, 1], 'bigint.base', '"value" must be a bigint'],
      [['', 'test'], 'bigint.base', '"value" must be a bigint'],
    ],
  })
})
