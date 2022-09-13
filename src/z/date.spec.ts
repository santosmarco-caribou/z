import { ZSpec } from '../tests/z-spec'
import { ZDate } from './z'

ZSpec.create('ZDate', {
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
}).build()
