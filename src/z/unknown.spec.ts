import { ZSpecUtils } from '../utils'
import { ZUnknown } from './z'

describe('ZUnknown', () => {
  ZSpecUtils.buildBaseSpec({
    type: ZUnknown,
    typeName: 'ZUnknown',
    typeHint: 'unknown',
    shouldParse: [
      [undefined],
      [null],
      [ZSpecUtils._NaN],
      [false],
      [true],
      [-1],
      [-0.5],
      [0],
      [0.5],
      [1],
      [''],
      ['test'],
      [[]],
      [[-1, 0, 1]],
      [['', 'test']],
      [BigInt(-1)],
      [BigInt(0)],
      [BigInt(1)],
      [Symbol()],
      [ZSpecUtils._UniqueSymbol],
    ],
    shouldNotParse: [],
  })
})
