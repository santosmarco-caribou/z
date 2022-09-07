import { ZSpec } from '../tests/z-spec'
import { ZBoolean, ZFalse, ZTrue } from './z'

const spec = ZSpec.create('ZBoolean', {
  type: ZBoolean,
  typeName: 'ZBoolean',
  typeHint: 'boolean',
  shouldParse: {
    values: ['true', 'false'],
  },
  shouldNotParse: {
    defaultErrorCode: 'boolean.base',
    defaultErrorMessage: '"value" must be a boolean',
    values: [{ value: 'undefined', errorCode: 'any.required', errorMessage: '"value" is required' }],
  },
})
  .addSpec('.truthy() should return an instance of ZTrue', z => expect(z.truthy()).toBeInstanceOf(ZTrue))
  .addSpec('.falsy() should return an instance of ZFalse', z => expect(z.falsy()).toBeInstanceOf(ZFalse))

spec.child('ZTrue', {
  type: ZTrue,
  typeName: 'ZTrue',
  typeHint: 'true',
  shouldParse: {
    values: ['true'],
  },
  shouldNotParse: {
    defaultErrorCode: 'any.only',
    defaultErrorMessage: '"value" must be [true]',
    values: [{ value: 'undefined', errorCode: 'any.required', errorMessage: '"value" is required' }],
  },
})

spec.child('ZFalse', {
  type: ZFalse,
  typeName: 'ZFalse',
  typeHint: 'false',
  shouldParse: {
    values: ['false'],
  },
  shouldNotParse: {
    defaultErrorCode: 'any.only',
    defaultErrorMessage: '"value" must be [false]',
    values: [{ value: 'undefined', errorCode: 'any.required', errorMessage: '"value" is required' }],
  },
})

spec.build()
