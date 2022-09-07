import type { AnyZ, ZOptional } from '../z/z'
import { AnyZSpec, ZSpec } from './z-spec'

export const ZOptionalSpecChild = <Z extends AnyZ>(parent: ZSpec<Z>): ZSpec<ZOptional<Z>> =>
  new ZSpec('.optional()', {
    type: { create: () => parent.config.type.create().optional() },
    typeName: 'ZOptional',
    typeHint: parent.config.typeHint === 'undefined' ? parent.config.typeHint : `${parent.config.typeHint} | undefined`,
    shouldParse: {
      ...parent.config.shouldParse,
      values:
        parent.config.shouldParse.values === ZSpec.ALL ? ZSpec.ALL : [...parent.config.shouldParse.values, 'undefined'],
    },
    shouldNotParse: parent.config.shouldNotParse
      ? {
          ...parent.config.shouldNotParse,
          values: parent.config.shouldNotParse.values?.filter(val =>
            typeof val === 'string' ? val !== 'undefined' : val.value !== 'undefined'
          ),
        }
      : undefined,
  })

export const ZNullableSpecChild = (parent: AnyZSpec) =>
  new ZSpec('.nullable()', {
    type: { create: () => parent.config.type.create().nullable() },
    typeName: 'ZNullable',
    typeHint: `${parent.config.typeHint} | null`,
    shouldParse: {
      ...parent.config.shouldParse,
      values:
        parent.config.shouldParse.values === ZSpec.ALL
          ? ZSpec.ALL
          : [...parent.config.shouldParse.values, { value: 'null', castTo: ZSpec.BYPASS_CASTING }],
    },
    shouldNotParse: parent.config.shouldNotParse
      ? {
          ...parent.config.shouldNotParse,
          values: parent.config.shouldNotParse.values?.filter(val =>
            typeof val === 'string' ? val !== 'null' : val.value !== 'null'
          ),
        }
      : undefined,
  })
