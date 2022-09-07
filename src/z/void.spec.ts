import { ZSpecUtils } from '../utils'
import { ZVoid } from './z'

describe('ZVoid', () => {
  ZSpecUtils.buildBaseSpec({
    type: ZVoid,
    typeName: 'ZVoid',
    typeHint: 'void',
    shouldParse: [
      [undefined, undefined],
      [null, undefined],
      [ZSpecUtils._NaN, undefined],
      [false, undefined],
      [true, undefined],
      [-1, undefined],
      [0, undefined],
      [1, undefined],
      ['', undefined],
      ['test', undefined],
      [[], undefined],
      [[-1, 0, 1], undefined],
      [['', 'test'], undefined],
      [BigInt(-1), undefined],
      [BigInt(0), undefined],
      [BigInt(1), undefined],
      [Symbol(), undefined],
      [ZSpecUtils._UniqueSymbol, undefined],
    ],
    shouldNotParse: [],
  })
})
