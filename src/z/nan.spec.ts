import { ZSpec } from '../tests/z-spec'
import { ZNaN } from './z'

ZSpec.create('ZNaN', {
  type: ZNaN,
  typeName: 'ZNaN',
  typeHint: 'NaN',
  shouldParse: {
    values: ['NaN'],
  },
  shouldNotParse: {
    defaultErrorCode: 'nan.base',
    defaultErrorMessage: '"value" must be a NaN',
    values: [{ value: 'undefined', errorCode: 'any.required', errorMessage: '"value" is required' }],
  },
}).build()
