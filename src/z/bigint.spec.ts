import { ZSpec } from '../tests/z-spec'
import { ZBigInt } from './z'

ZSpec.create('ZBigInt', {
  type: ZBigInt,
  typeName: 'ZBigInt',
  typeHint: 'bigint',
  shouldParse: {
    values: ['BigInt(-1)', 'BigInt(0)', 'BigInt(1)'],
  },
  shouldNotParse: {
    defaultErrorCode: 'bigint.base',
    defaultErrorMessage: '"value" must be a bigint',
    values: [{ value: 'undefined', errorCode: 'any.required', errorMessage: '"value" is required' }],
  },
}).build()
