import { ZSpec } from '../tests/z-spec'
import { ZUndefined } from './z'

ZSpec.create('ZUndefined', {
  type: ZUndefined,
  typeName: 'ZUndefined',
  typeHint: 'undefined',
  shouldParse: {
    values: ['undefined'],
  },
  shouldNotParse: {
    defaultErrorCode: 'any.unknown',
    defaultErrorMessage: '"value" is not allowed',
  },
}).build()
