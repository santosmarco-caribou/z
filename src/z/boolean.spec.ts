import { ZSpec } from '../tests/z-spec'
import { ZBoolean, ZFalse, ZFalsy, ZTrue, ZTruthy } from './z'

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
  .addSpec('.true() should return an instance of ZTrue', z => expect(z.true()).toBeInstanceOf(ZTrue))
  .addSpec('.false() should return an instance of ZFalse', z => expect(z.false()).toBeInstanceOf(ZFalse))
  .addSpec('.truthy() should return an instance of ZTruthy', z => expect(z.truthy()).toBeInstanceOf(ZTruthy))
  .addSpec('.falsy() should return an instance of ZFalsy', z => expect(z.falsy()).toBeInstanceOf(ZFalsy))

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

spec.child('ZTruthy', {
  type: ZTruthy,
  typeName: 'ZTruthy',
  typeHint: 'Truthy',
  shouldParse: {
    values: [
      'true',
      '-1',
      '-0.5',
      '-0.25',
      '-0.125',
      '0.125',
      '0.25',
      '0.5',
      '1',
      '"test"',
      '[]',
      '[-1, 0, 1]',
      '["", "test"]',
      'BigInt(-1)',
      'BigInt(1)',
      'symbol',
      'unique symbol',
      'class',
      'abstract class',
    ],
    defaultCastTo: true,
  },
  shouldNotParse: {
    defaultErrorCode: 'truthy.base',
    defaultErrorMessage: '"value" must be truthy',
    values: [{ value: 'undefined', errorCode: 'any.required', errorMessage: '"value" is required' }],
  },
})

spec.child('ZFalsy', {
  type: ZFalsy,
  typeName: 'ZFalsy',
  typeHint: 'Falsy',
  shouldParse: {
    values: ['undefined', 'null', 'false', 'NaN', '0', '""', 'BigInt(0)'],
  },
  shouldNotParse: {
    defaultErrorCode: 'falsy.base',
    defaultErrorMessage: '"value" must be falsy',
  },
})

spec.build()
