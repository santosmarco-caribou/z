import { ZSpecUtils } from '../utils'
import { ZAny } from './z'

describe('ZAny', () => {
  ZSpecUtils.buildBaseSpec({
    type: ZAny,
    typeName: 'ZAny',
    typeHint: 'any',
    shouldParse: [
      [undefined],
      [null],
      [ZSpecUtils._NaN],
      [false],
      [true],
      [-1],
      [0],
      [1],
      [''],
      ['test'],
      [[]],
      [[-1, 0, 1]],
      [['', 'test']],
      [BigInt(-1)],
      [BigInt(0)],
      [BigInt(1)],
    ],
    shouldNotParse: [],
  })
})
