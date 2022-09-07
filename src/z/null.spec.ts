import { ZSpecUtils } from '../utils'
import { ZNull } from './z'

describe('ZNull', () => {
  ZSpecUtils.buildBaseSpec({
    type: ZNull,
    typeName: 'ZNull',
    typeHint: 'null',
    shouldParse: [null],
    shouldNotParse: [
      [undefined, '"value" is required'],
      [ZSpecUtils._NaN, '"value" must be [null]'],
      [-1, '"value" must be [null]'],
      [0, '"value" must be [null]'],
      [1, '"value" must be [null]'],
      ['', '"value" must be [null]'],
      ['test', '"value" must be [null]'],
      [[], '"value" must be [null]'],
      [[-1, 0, 1], '"value" must be [null]'],
      [['', 'test'], '"value" must be [null]'],
      [BigInt(-1), '"value" must be [null]'],
      [BigInt(0), '"value" must be [null]'],
      [BigInt(1), '"value" must be [null]'],
    ],
  })
})
