import { ZSpec } from '../tests/z-spec'
import { ZDate } from './z'

const spec = ZSpec.create('ZDate', {
  type: ZDate,
  typeName: 'ZDate',
  typeHint: 'Date',
  shouldParse: {
    values: [
      'new Date(0)',
      { value: 'isodate', castTo: new Date('1995-12-17T03:24:00') },
      { value: '-1', castTo: new Date(-1) },
      { value: '-0.5', castTo: new Date(-0.5) },
      { value: '-0.25', castTo: new Date(-0.25) },
      { value: '-0.125', castTo: new Date(-0.125) },
      { value: '0', castTo: new Date(0) },
      { value: '0.125', castTo: new Date(0.125) },
      { value: '0.25', castTo: new Date(0.25) },
      { value: '0.5', castTo: new Date(0.5) },
      { value: '1', castTo: new Date(1) },
    ],
  },
  shouldNotParse: {
    defaultErrorCode: 'date.base',
    defaultErrorMessage: '"value" must be a valid date',
    values: [{ value: 'undefined', errorCode: 'any.required', errorMessage: '"value" is required' }],
  },
})

spec.child('.before(new Date(0))', {
  type: { create: () => ZDate.create().before(new Date(0)) },
  shouldParse: {
    values: [
      'new Date(0)',
      { value: '-1', castTo: new Date(-1) },
      { value: '-0.5', castTo: new Date(-0.5) },
      { value: '-0.25', castTo: new Date(-0.25) },
      { value: '-0.125', castTo: new Date(-0.125) },
      { value: '0', castTo: new Date(0) },
      { value: '0.125', castTo: new Date(0.125) },
      { value: '0.25', castTo: new Date(0.25) },
      { value: '0.5', castTo: new Date(0.5) },
    ],
  },
  shouldNotParse: {
    defaultErrorCode: 'date.base',
    defaultErrorMessage: '"value" must be a valid date',
    values: [
      { value: 'undefined', errorCode: 'any.required', errorMessage: '"value" is required' },
      {
        value: 'isodate',
        errorCode: 'date.max',
        errorMessage: '"value" must be less than or equal to "1970-01-01T00:00:00.000Z"',
      },
      {
        value: '1',
        errorCode: 'date.max',
        errorMessage: '"value" must be less than or equal to "1970-01-01T00:00:00.000Z"',
      },
    ],
  },
})

spec.child('.after(new Date(0))', {
  type: { create: () => ZDate.create().after(new Date(0)) },
  shouldParse: {
    values: [
      'new Date(0)',
      { value: 'isodate', castTo: new Date('1995-12-17T03:24:00') },
      { value: '-0.5', castTo: new Date(-0.5) },
      { value: '-0.25', castTo: new Date(-0.25) },
      { value: '-0.125', castTo: new Date(-0.125) },
      { value: '0', castTo: new Date(0) },
      { value: '0.125', castTo: new Date(0.125) },
      { value: '0.25', castTo: new Date(0.25) },
      { value: '0.5', castTo: new Date(0.5) },
      { value: '1', castTo: new Date(1) },
    ],
  },
  shouldNotParse: {
    defaultErrorCode: 'date.base',
    defaultErrorMessage: '"value" must be a valid date',
    values: [
      { value: 'undefined', errorCode: 'any.required', errorMessage: '"value" is required' },
      {
        value: '-1',
        errorCode: 'date.min',
        errorMessage: '"value" must be greater than or equal to "1970-01-01T00:00:00.000Z"',
      },
    ],
  },
})

spec.build()
