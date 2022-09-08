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
    typeHint: parent.config.typeHint === 'null' ? parent.config.typeHint : `${parent.config.typeHint} | null`,
    shouldParse: {
      ...parent.config.shouldParse,
      values:
        parent.config.shouldParse.values === ZSpec.ALL
          ? ZSpec.ALL
          : 'defaultCastTo' in parent.config.shouldParse
          ? parent.config.shouldParse.values
          : [...parent.config.shouldParse.values, 'null'],
    },
    shouldNotParse: parent.config.shouldNotParse
      ? {
          ...parent.config.shouldNotParse,
          values:
            'defaultCastTo' in parent.config.shouldParse
              ? parent.config.shouldNotParse.values
              : parent.config.shouldNotParse.values?.filter(val =>
                  typeof val === 'string' ? val !== 'null' : val.value !== 'null'
                ),
        }
      : undefined,
  })

export const ZNullishSpecChild = <Z extends AnyZ>(parent: ZSpec<Z>) =>
  new ZSpec('.nullish()', {
    type: { create: () => parent.config.type.create().nullish() },
    typeName: 'ZNullish',
    typeHint:
      parent.config.typeHint === 'undefined'
        ? `${parent.config.typeHint} | null`
        : parent.config.typeHint === 'null'
        ? `${parent.config.typeHint} | undefined`
        : parent.config.typeHint.split(' | ').filter(hint => hint === 'undefined' || hint === 'null').length === 2
        ? parent.config.typeHint
        : `${parent.config.typeHint} | null | undefined`,
    shouldParse: {
      ...parent.config.shouldParse,
      values:
        parent.config.shouldParse.values === ZSpec.ALL
          ? ZSpec.ALL
          : [...parent.config.shouldParse.values, 'null', 'undefined'],
    },
    shouldNotParse: parent.config.shouldNotParse
      ? {
          ...parent.config.shouldNotParse,
          values: parent.config.shouldNotParse.values
            ?.filter(val => (typeof val === 'string' ? val !== 'undefined' : val.value !== 'undefined'))
            .filter(val => (typeof val === 'string' ? val !== 'null' : val.value !== 'null')),
        }
      : undefined,
  })
