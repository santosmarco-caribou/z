import { ZSpec } from '../tests/z-spec'
import { ZAny } from './z'

ZSpec.create('ZAny', {
  type: ZAny,
  typeName: 'ZAny',
  typeHint: 'any',
  shouldParse: {
    values: ZSpec.ALL,
  },
  shouldNotParse: {
    values: [{ value: 'undefined', errorCode: 'any.required', errorMessage: '"value" is required' }],
  },
}).build()
