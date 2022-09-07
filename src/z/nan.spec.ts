import { ZSpecUtils } from '../utils'
import { ZNaN } from './z'

describe('ZNaN', () => {
  ZSpecUtils.buildBaseSpec({
    type: ZNaN,
    typeName: 'ZNaN',
    typeHint: 'NaN',
    shouldParse: [[ZSpecUtils._NaN]],
    shouldNotParse: [
      [undefined, 'any.required', '"value" is required'],
      [null, 'nan.base', '"value" must be a NaN'],
      [false, 'nan.base', '"value" must be a NaN'],
      [true, 'nan.base', '"value" must be a NaN'],
      [-1, 'nan.base', '"value" must be a NaN'],
      [-0.5, 'nan.base', '"value" must be a NaN'],
      [0, 'nan.base', '"value" must be a NaN'],
      [0.5, 'nan.base', '"value" must be a NaN'],
      [1, 'nan.base', '"value" must be a NaN'],
      ['', 'nan.base', '"value" must be a NaN'],
      ['test', 'nan.base', '"value" must be a NaN'],
      [[], 'nan.base', '"value" must be a NaN'],
      [[-1, 0, 1], 'nan.base', '"value" must be a NaN'],
      [['', 'test'], 'nan.base', '"value" must be a NaN'],
      [BigInt(-1), 'nan.base', '"value" must be a NaN'],
      [BigInt(0), 'nan.base', '"value" must be a NaN'],
      [BigInt(1), 'nan.base', '"value" must be a NaN'],
      [Symbol(), 'nan.base', '"value" must be a NaN'],
      [ZSpecUtils._UniqueSymbol, 'nan.base', '"value" must be a NaN'],
    ],
  })
})
