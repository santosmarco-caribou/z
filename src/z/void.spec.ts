import { ZSpec } from '../tests/z-spec'
import { ZVoid } from './z'

ZSpec.create('ZVoid', {
  type: ZVoid,
  typeName: 'ZVoid',
  typeHint: 'void',
  shouldParse: {
    values: ZSpec.ALL,
    defaultCastTo: undefined,
  },
  shouldNotParse: {
    values: [{ value: 'undefined', errorCode: 'any.required', errorMessage: '"value" is required' }],
  },
}).build()
