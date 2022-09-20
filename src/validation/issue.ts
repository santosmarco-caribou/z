import Joi from 'joi'
import type { F, L, S } from 'ts-toolbelt'
import type { RemoveIndexSignature, SetRequired, Simplify } from 'type-fest'

import type { ZType } from '../types'

/* -------------------------------------------------------------------------- */
/*                                   ZIssue                                   */
/* -------------------------------------------------------------------------- */

/* -------------------------------- ZIssueTag ------------------------------- */

type _ZIssueTagTypeMap = {
  string: string
  number: number
  boolean: boolean
}

export type ZIssueTagTypeKey = keyof _ZIssueTagTypeMap
export type ZIssueTagTypeValue<K extends ZIssueTagTypeKey> =
  _ZIssueTagTypeMap[K]

export type ZIssueTag<
  Label extends string,
  TypeKey extends ZIssueTagTypeKey
> = `{{#${Label}:${TypeKey}}}`

export type AnyZIssueTag = ZIssueTag<string, ZIssueTagTypeKey>

export const createZIssueTag = <
  Label extends string,
  TypeKey extends ZIssueTagTypeKey
>(
  label: Label,
  type: TypeKey
): ZIssueTag<Label, TypeKey> => `{{#${label}:${type}}}`

/* ------------------------------ ZIssueMessage ----------------------------- */

export type ZIssueMessage<Msg extends string = `${string}.`> =
  Msg extends `${string}.` ? `${ZIssueTag<'label', 'string'>} ${Msg}` : never

/* -------------------------------- ZIssueMap ------------------------------- */

export type ZIssueMap<TypeName extends ZType = ZType> = Simplify<
  Record<`${TypeName}.base`, ZIssueMessage> &
    Partial<Record<`${TypeName}.${string}`, ZIssueMessage>>,
  { deep: true }
>

/* -------------------------------------------------------------------------- */

type _RemoveMapPrefixes<T extends ZType> = {
  [K in keyof ZIssueMap<T> as S.Join<
    L.Tail<S.Split<Extract<K, string>, '.'>>,
    '.'
  >]: S.Replace<
    Extract<ZIssueMap<T>[K], string>,
    `${ZIssueTag<'label', 'string'>} `,
    ''
  >
}
type _AddMapPrefixes<
  T extends ZType,
  Map extends _RemoveMapPrefixes<T>
> = Simplify<{
  [K in keyof Map as `${T}.${Extract<K, string>}`]: ZIssueMessage<
    Extract<Map[K], string>
  >
}>

export const createZIssueMap = <
  TypeName extends ZType,
  Map extends _RemoveMapPrefixes<TypeName> = _RemoveMapPrefixes<TypeName>
>(
  typeName: TypeName,
  map: F.Narrow<Map>
): _AddMapPrefixes<TypeName, Map> =>
  Object.fromEntries(
    Object.entries<string>(map as Map).map(([k, v]) => [
      `${typeName}.${k}`,
      `{{#label:string}} ${v}`,
    ])
  ) as _AddMapPrefixes<TypeName, Map>

/* ------------------------------- ZIssueCode ------------------------------- */

export type ZIssueCode<
  TypeName extends ZType = ZType,
  IssueMap extends ZIssueMap<TypeName> = ZIssueMap<TypeName>
> = keyof IssueMap

/* ------------------------------ ZIssueContext ----------------------------- */

type _GetZIssueTags<Msg extends string> = L.Select<
  S.Split<Msg, ' '>,
  AnyZIssueTag
>

type _ZIssueContextOptions = {
  Extras?: boolean
}

export type ZIssueContext<
  Msg extends string,
  Opts extends _ZIssueContextOptions = { Extras: false }
> = {
  [K in keyof _GetZIssueTags<Msg>]: _GetZIssueTags<Msg>[K] extends ZIssueTag<
    infer TagLabel,
    infer TagTypeKey
  >
    ? {
        [KK in TagLabel]: ZIssueTagTypeValue<TagTypeKey>
      }
    : never
}[keyof _GetZIssueTags<Msg>] &
  (Opts['Extras'] extends true
    ? RemoveIndexSignature<SetRequired<Omit<Joi.Context, 'label'>, 'value'>>
    : Record<string, never>)
