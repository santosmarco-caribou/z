import { Z_SPEC_CLASS, ZSpec } from '../tests/z-spec'
import { ZInstanceOf } from './z'

ZSpec.create('ZInstanceOf', {
  type: { create: () => ZInstanceOf.create(Z_SPEC_CLASS) },
  typeName: 'ZInstanceOf',
  typeHint: 'instanceof Z_SPEC_CLASS',
  shouldParse: {
    values: ['class'],
  },
  shouldNotParse: {
    defaultErrorCode: 'instanceof.base',
    defaultErrorMessage: '"value" must be an instance of Z_SPEC_CLASS',
    values: [{ value: 'undefined', errorCode: 'any.required', errorMessage: '"value" is required' }],
  },
}).build()
