import { ZSpec } from '../tests/z-spec'
import { ZNumber } from './z'

const spec = ZSpec.create('ZNumber', {
  type: ZNumber,
  typeName: 'ZNumber',
  typeHint: 'number',
  shouldParse: {
    values: ['-1', '-0.5', '-0.25', '-0.125', '0', '0.125', '0.25', '0.5', '1'],
  },
  shouldNotParse: {
    defaultErrorCode: 'number.base',
    defaultErrorMessage: '"value" must be a number',
    values: [{ value: 'undefined', errorCode: 'any.required', errorMessage: '"value" is required' }],
  },
})

spec.child('.integer()', {
  type: { create: () => ZNumber.create().integer() },
  shouldParse: {
    values: ['-1', '0', '1'],
  },
  shouldNotParse: {
    defaultErrorCode: 'number.base',
    defaultErrorMessage: '"value" must be a number',
    values: [
      { value: 'undefined', errorCode: 'any.required', errorMessage: '"value" is required' },
      { value: '-0.5', errorCode: 'number.integer', errorMessage: '"value" must be an integer' },
      { value: '-0.25', errorCode: 'number.integer', errorMessage: '"value" must be an integer' },
      { value: '-0.125', errorCode: 'number.integer', errorMessage: '"value" must be an integer' },
      { value: '0.125', errorCode: 'number.integer', errorMessage: '"value" must be an integer' },
      { value: '0.25', errorCode: 'number.integer', errorMessage: '"value" must be an integer' },
      { value: '0.5', errorCode: 'number.integer', errorMessage: '"value" must be an integer' },
    ],
  },
})

spec.child('.positive()', {
  type: { create: () => ZNumber.create().positive() },
  shouldParse: {
    values: ['0.125', '0.25', '0.5', '1'],
  },
  shouldNotParse: {
    defaultErrorCode: 'number.base',
    defaultErrorMessage: '"value" must be a number',
    values: [
      { value: 'undefined', errorCode: 'any.required', errorMessage: '"value" is required' },
      { value: '-1', errorCode: 'number.positive', errorMessage: '"value" must be a positive number' },
      { value: '-0.5', errorCode: 'number.positive', errorMessage: '"value" must be a positive number' },
      { value: '-0.25', errorCode: 'number.positive', errorMessage: '"value" must be a positive number' },
      { value: '-0.125', errorCode: 'number.positive', errorMessage: '"value" must be a positive number' },
      { value: '0', errorCode: 'number.positive', errorMessage: '"value" must be a positive number' },
    ],
  },
})

spec.child('.nonpositive()', {
  type: { create: () => ZNumber.create().nonpositive() },
  shouldParse: {
    values: ['-1', '-0.5', '-0.25', '-0.125', '0'],
  },
  shouldNotParse: {
    defaultErrorCode: 'number.base',
    defaultErrorMessage: '"value" must be a number',
    values: [
      { value: 'undefined', errorCode: 'any.required', errorMessage: '"value" is required' },
      { value: '0.125', errorCode: 'number.max', errorMessage: '"value" must be less than or equal to 0' },
      { value: '0.25', errorCode: 'number.max', errorMessage: '"value" must be less than or equal to 0' },
      { value: '0.5', errorCode: 'number.max', errorMessage: '"value" must be less than or equal to 0' },
      { value: '1', errorCode: 'number.max', errorMessage: '"value" must be less than or equal to 0' },
    ],
  },
})

spec.build()
