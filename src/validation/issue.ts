import Joi from 'joi'
import type { F, L, S } from 'ts-toolbelt'
import type { RemoveIndexSignature, SetRequired } from 'type-fest'

import type { ZType } from '../types'
import { TypeUtils } from '../utils/types'

/* ------------------------------- ZIssueTags ------------------------------- */

export const ZIssueTags = {
  primitive<Name extends string, Type extends 'string' | 'number' | 'boolean'>(
    name: Name,
    type: Type
  ) {
    return `{{#${name}:${type}}}` as const
  },

  literal<
    Name extends string,
    Type extends string | number | boolean,
    Values extends [Type, ...Type[]]
  >(name: Name, values: Values) {
    return `{{#${name}:(${values
      .map(v => (typeof v === 'string' ? `'${v}'` : v))
      .join('|')})}}` as const
  },

  label() {
    return this.primitive('label', 'string')
  },
}

/* -------------------------------------------------------------------------- */
/*                                  ZIssueMap                                 */
/* -------------------------------------------------------------------------- */

export const ZIssueMap = (<
  Map extends Record<
    `${_FormatZTypeToZIssueMap<ZType>}`,
    `{{#label:string}} ${string}`
  >
>(
  map: F.Narrow<Map>
) =>
  map as unknown as Map[keyof Map] extends `${infer IssueMsg}.`
    ? TypeUtils.Error<`ZIssue messages cannot end with a period: '${IssueMsg}'`>
    : Map)({
  'any.base': `${ZIssueTags.label()} failed parsing but no issues were detected`,
})

export type ZIssueMap<TypeName extends ZType = ZType> = Pick<
  typeof ZIssueMap,
  Extract<keyof typeof ZIssueMap, _FormatZTypeToZIssueMap<TypeName>>
>

export type ZIssueCode<TypeName extends ZType = ZType> =
  keyof ZIssueMap<TypeName>

/* ------------------------------ ZIssueContext ----------------------------- */

type _GetZIssueTags<Issue extends ZIssueCode> = L.Select<
  S.Split<ZIssueMap[Issue], ' '>,
  `{{#${string}:${string}}}`
>

type _ZIssueContextOptions = { Extras?: boolean }
export type ZIssueContext<
  Issue extends ZIssueCode,
  Opts extends _ZIssueContextOptions = { Extras: false }
> = {
  [K in keyof _GetZIssueTags<Issue>]: _GetZIssueTags<Issue>[K] extends `{{#${infer TagName}:${infer TagType}}}`
    ? {
        [KK in TagName]: TagType extends `(${infer LiteralUnion})`
          ? S.Split<LiteralUnion, '|'>[number]
          : TagType extends 'string'
          ? string
          : TagType extends 'number'
          ? number
          : TagType extends 'boolean'
          ? boolean
          : never
      }
    : never
}[keyof _GetZIssueTags<Issue>] &
  (Opts['Extras'] extends true
    ? RemoveIndexSignature<SetRequired<Omit<Joi.Context, 'label'>, 'value'>>
    : Record<string, never>)

/* --------------------------------- Helpers -------------------------------- */

type _FormatZTypeToZIssueMap<TypeName extends ZType> =
  TypeName extends `Z${infer Name}` ? `${Lowercase<Name>}.${string}` : never
