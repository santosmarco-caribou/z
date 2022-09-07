import { ZSpec } from '../tests/z-spec'
import { ZNever } from './z'

ZSpec.create('ZNever', {
  type: ZNever,
  typeName: 'ZNever',
  typeHint: 'never',
  shouldParse: {
    values: [],
  },
  shouldNotParse: {
    defaultErrorCode: 'any.unknown',
    defaultErrorMessage: '"value" is not allowed',
    values: [{ value: 'undefined', errorCode: 'any.required', errorMessage: '"value" is required' }],
  },
}).build()
