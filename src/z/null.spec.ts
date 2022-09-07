import { ZSpec } from '../tests/z-spec'
import { ZNull } from './z'

ZSpec.create('ZNull', {
  type: ZNull,
  typeName: 'ZNull',
  typeHint: 'null',
  shouldParse: {
    values: ['null'],
  },
  shouldNotParse: {
    defaultErrorCode: 'any.only',
    defaultErrorMessage: '"value" must be [null]',
    values: [{ value: 'undefined', errorCode: 'any.required', errorMessage: '"value" is required' }],
  },
}).build()
