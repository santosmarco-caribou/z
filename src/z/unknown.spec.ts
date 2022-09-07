import { ZSpec } from '../tests/z-spec'
import { ZUnknown } from './z'

ZSpec.create('ZUnknown', {
  type: ZUnknown,
  typeName: 'ZUnknown',
  typeHint: 'unknown',
  shouldParse: {
    values: ZSpec.ALL,
  },
}).build()
