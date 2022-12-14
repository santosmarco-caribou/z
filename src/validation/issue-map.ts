import type Joi from 'joi'
import type { S } from 'ts-toolbelt'
import type { Replace } from 'type-fest'

/* -------------------------------------------------------------------------- */
/*                                  ZIssueMap                                 */
/* -------------------------------------------------------------------------- */

export const Z_ISSUE_MAP = {
  'alternatives.all': '{{#label}} does not match all of the required types',
  'alternatives.any': '{{#label}} does not match any of the allowed types',
  'alternatives.match': '{{#label}} does not match any of the allowed types',
  'alternatives.one': '{{#label}} matches more than one allowed type',
  'alternatives.types': '{{#label}} must be one of {{#types}}',

  'any.custom':
    '{{#label}} failed custom validation because {{#error.message}}',
  'any.default': '{{#label}} threw an error when running default method',
  'any.failover': '{{#label}} threw an error when running failover method',
  'any.invalid':
    '{{#label}} cannot be {if(#invalids.length == 1, "", "any of ")}{{#invalids}}',
  'any.only':
    '{{#label}} must be {if(#valids.length == 1, "", "one of ")}{{#valids}}',
  'any.ref': '{{#label}} {{#arg}} references {{:#ref}} which {{#reason}}',
  'any.required': '{{#label}} is required',
  'any.unknown': '{{#label}} is not allowed',

  'array.base': '{{#label}} must be an array',
  'array.min':
    '{{#label}} must contain at least {{#limit}} item{if(#limit == 1, "", "s")}',
  'array.max':
    '{{#label}} must contain at most {{#limit}} item{if(#limit == 1, "", "s")}',
  'array.length': '{{#label}} must contain exactly {{#limit}} items',
  'array.sort': '{{#label}} must be sorted in {#order} order by {{#by}}',
  'array.sort.mismatching':
    '{{#label}} cannot be sorted due to mismatching types',
  'array.sort.unsupported':
    '{{#label}} cannot be sorted due to unsupported type {#type}',
  'array.includesRequiredUnknowns':
    '{{#label}} does not contain {{#unknownMisses}} required value{if(#unknownMisses == 1, "", "s")}',
  /* ------------------------------------------------------------------------ */
  'array.excludes': '{{#label}} contains an excluded value',
  'array.hasKnown':
    '{{#label}} does not contain at least one required match for type {:#patternLabel}',
  'array.hasUnknown': '{{#label}} does not contain at least one required match',
  'array.includes': '{{#label}} does not match any of the allowed types',
  'array.includesRequiredBoth':
    '{{#label}} does not contain {{#knownMisses}} and {{#unknownMisses}} other required value(s)',
  'array.includesRequiredKnowns':
    '{{#label}} does not contain {{#knownMisses}}',
  'array.orderedLength': '{{#label}} must contain at most {{#limit}} items',
  'array.sparse': '{{#label}} must not be a sparse array item',
  'array.unique': '{{#label}} contains a duplicate value',

  'bigint.base': '{{#label}} must be a bigint',

  'binary.base': '{{#label}} must be a buffer or a string',
  'binary.length': '{{#label}} must be {{#limit}} bytes',
  'binary.max': '{{#label}} must be less than or equal to {{#limit}} bytes',
  'binary.min': '{{#label}} must be at least {{#limit}} bytes',

  'boolean.base': '{{#label}} must be a boolean',

  'date.base': '{{#label}} must be a valid date',
  'date.between':
    '{{#label}} must be a valid date between {{#minDate}} and {{#maxDate}}',
  'date.format':
    '{{#label}} must be in {msg("date.format." + #format) || #format} format',
  'date.greater': '{{#label}} must be greater than {{:#limit}}',
  'date.less': '{{#label}} must be less than {{:#limit}}',
  'date.max': '{{#label}} must be less than or equal to {{:#limit}}',
  'date.min': '{{#label}} must be greater than or equal to {{:#limit}}',
  'date.format.iso': 'ISO 8601 date',
  'date.format.javascript': 'timestamp or number of milliseconds',
  'date.format.unix': 'timestamp or number of seconds',

  'function.arity': '{{#label}} must have an arity of {{#n}}',
  'function.class': '{{#label}} must be a class',
  'function.maxArity':
    '{{#label}} must have an arity lesser or equal to {{#n}}',
  'function.minArity':
    '{{#label}} must have an arity greater or equal to {{#n}}',

  'object.and':
    '{{#label}} contains {{#presentWithLabels}} without its required peers {{#missingWithLabels}}',
  'object.assert':
    '{{#label}} is invalid because {if(#subject.key, `"` + #subject.key + `" failed to ` + (#message || "pass the assertion test"), #message || "the assertion failed")}',
  'object.base': '{{#label}} must be of type {{#type}}',
  'object.instance': '{{#label}} must be an instance of {{:#type}}',
  'object.length':
    '{{#label}} must have {{#limit}} key{if(#limit == 1, "", "s")}',
  'object.max':
    '{{#label}} must have less than or equal to {{#limit}} key{if(#limit == 1, "", "s")}',
  'object.min':
    '{{#label}} must have at least {{#limit}} key{if(#limit == 1, "", "s")}',
  'object.missing':
    '{{#label}} must contain at least one of {{#peersWithLabels}}',
  'object.nand':
    '{{:#mainWithLabel}} must not exist simultaneously with {{#peersWithLabels}}',
  'object.oxor':
    '{{#label}} contains a conflict between optional exclusive peers {{#peersWithLabels}}',
  'object.pattern.match':
    '{{#label}} keys failed to match pattern requirements',
  'object.refType': '{{#label}} must be a Joi reference',
  'object.regex': '{{#label}} must be a RegExp object',
  'object.rename.multiple':
    '{{#label}} cannot rename {{:#from}} because multiple renames are disabled and another key was already renamed to {{:#to}}',
  'object.rename.override':
    '{{#label}} cannot rename {{:#from}} because override is disabled and target {{:#to}} exists',
  'object.schema': '{{#label}} must be a Joi schema of {{#type}} type',
  'object.unknown': '{{#label}} is not allowed',
  'object.with':
    '{{:#mainWithLabel}} missing required peer {{:#peerWithLabel}}',
  'object.without':
    '{{:#mainWithLabel}} conflict with forbidden peer {{:#peerWithLabel}}',
  'object.xor':
    '{{#label}} contains a conflict between exclusive peers {{#peersWithLabels}}',

  'instanceof.base': '{{#label}} must be an instance of {{#type}}',

  'map.base': '{{#label}} must be a Map',
  'map.key.base': '{{#label}} keys must be of type {{#type}}',
  'map.value.base': '{{#label}} values must be of type {{#type}}',

  'nan.base': '{{#label}} must be a NaN',

  'number.base': '{{#label}} must be a number',
  'number.greater': '{{#label}} must be greater than {{#limit}}',
  'number.infinity': '{{#label}} cannot be infinity',
  'number.integer': '{{#label}} must be an integer',
  'number.less': '{{#label}} must be less than {{#limit}}',
  'number.max': '{{#label}} must be less than or equal to {{#limit}}',
  'number.min': '{{#label}} must be greater than or equal to {{#limit}}',
  'number.multiple': '{{#label}} must be a multiple of {{#multiple}}',
  'number.negative': '{{#label}} must be a negative number',
  'number.port': '{{#label}} must be a valid port',
  'number.positive': '{{#label}} must be a positive number',
  'number.precision':
    '{{#label}} must have no more than {{#limit}} decimal place{if(#limit == 1, "", "s")}',
  'number.unsafe': '{{#label}} must be a safe number',

  'record.base': '{{#label}} must be of type record',
  'record.key.base': '{{#label}} keys must be of type {{#type}}',
  'record.value.base': '{{#label}} values must be of type {{#type}}',

  'promise.base': '{{#label}} must be a Promise',

  'string.alphanum': '{{#label}} must only contain alpha-numeric characters',
  'string.base': '{{#label}} must be a string',
  'string.base64': '{{#label}} must be a valid base64 string',
  'string.creditCard': '{{#label}} must be a credit card',
  'string.dataUri': '{{#label}} must be a valid dataUri string',
  'string.domain': '{{#label}} must contain a valid domain name',
  'string.email': '{{#label}} must be a valid email',
  'string.empty': '{{#label}} is not allowed to be empty',
  'string.guid': '{{#label}} must be a valid GUID',
  'string.hex': '{{#label}} must only contain hexadecimal characters',
  'string.hexAlign':
    '{{#label}} hex decoded representation must be byte aligned',
  'string.hostname': '{{#label}} must be a valid hostname',
  'string.ip': '{{#label}} must be a valid ip address with a {{#cidr}} CIDR',
  'string.ipVersion':
    '{{#label}} must be a valid ip address of one of the following versions {{#version}} with a {{#cidr}} CIDR',
  'string.isoDate': '{{#label}} must be in iso format',
  'string.isoDuration': '{{#label}} must be a valid ISO 8601 duration',
  'string.length': '{{#label}} length must be {{#limit}} characters long',
  'string.lowercase': '{{#label}} must only contain lowercase characters',
  'string.max':
    '{{#label}} length must be less than or equal to {{#limit}} characters long',
  'string.min': '{{#label}} length must be at least {{#limit}} characters long',
  'string.normalize':
    '{{#label}} must be unicode normalized in the {{#form}} form',
  'string.token':
    '{{#label}} must only contain alpha-numeric and underscore characters',
  'string.pattern.base':
    '{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}',
  'string.pattern.name':
    '{{#label}} with value {:[.]} fails to match the {{#name}} pattern',
  'string.pattern.invert.base':
    '{{#label}} with value {:[.]} matches the inverted pattern: {{#regex}}',
  'string.pattern.invert.name':
    '{{#label}} with value {:[.]} matches the inverted {{#name}} pattern',
  'string.trim': '{{#label}} must not have leading or trailing whitespace',
  'string.uri': '{{#label}} must be a valid uri',
  'string.uriCustomScheme':
    '{{#label}} must be a valid uri with a scheme matching the {{#scheme}} pattern',
  'string.uriRelativeOnly': '{{#label}} must be a valid relative uri',
  'string.uppercase': '{{#label}} must only contain uppercase characters',
  'string.capitalize': '{{#label}} must be capitalized',
  'string.uncapitalize': '{{#label}} must be uncapitalized',
  'string.transform': '{{#label}} could not be transformed',

  'set.base': '{{#label}} must be either an array or a set',

  'symbol.base': '{{#label}} must be a symbol',
  'symbol.map': '{{#label}} must be one of {{#map}}',

  'union.base': '{{#label}} must be one of {{#types}}',
  'intersection.base': '{{#label}} must match all of {{#types}}',
} as const

export type ZIssueMap = typeof Z_ISSUE_MAP

/* ------------------------------- ZIssueCode ------------------------------- */

export type ZIssueCode<S extends Joi.Schema> = Extract<
  keyof ZIssueMap,
  S extends Joi.AlternativesSchema
    ? `alternatives.${string}`
    : S extends Joi.ArraySchema
    ? `array.${string}`
    : S extends Joi.BinarySchema
    ? `binary.${string}`
    : S extends Joi.BooleanSchema
    ? `boolean.${string}`
    : S extends Joi.DateSchema
    ? `date.${string}`
    : S extends Joi.NumberSchema
    ? `${'nan' | 'number'}.${string}`
    : S extends Joi.ObjectSchema
    ? `${'object' | 'record'}.${string}`
    : S extends Joi.StringSchema
    ? `string.${string}`
    : S extends Joi.SymbolSchema
    ? `symbol.${string}`
    : S extends Joi.AnySchema
    ? `any.${string}`
    : string
>

export type AnyZIssueCode = keyof ZIssueMap

/* ------------------------------ ZIssueContext ----------------------------- */

export type ZIssueLocalCtxTagTypeMap = {
  'error.message': any
  arg: any
  by: string
  cidr: any
  form: any
  key: string | number
  knownMisses: string[]
  label: string
  limit: number
  map: any
  maxDate: Date
  minDate: Date
  missingWithLabels: string[]
  multiple: number
  n: any
  name: string
  order: any
  pattern: string
  peersWithLabels: string[]
  presentWithLabels: string[]
  reason: any
  regex: string
  scheme: any
  type: string
  types: any
  unknownMisses: number
  valids: string[]
  value: any
  version: string
}

export type GetLocalCtxTagOpts = { Extras?: boolean }
export type GetLocalCtxTag<
  IssueCode extends AnyZIssueCode = AnyZIssueCode,
  Opts extends GetLocalCtxTagOpts = { Extras: false }
> =
  | (IssueCode extends 'any.only'
      ? '{{#label}}' | '{{#valids}}'
      : Extract<
          S.Split<ZIssueMap[IssueCode], ' '>[number],
          `${'{' | ''}{${':' | ''}#${string}}${'}' | ''}`
        >)
  | (Opts['Extras'] extends true ? 'key' | 'value' : never)

export type RemoveLocalCtxTagBraces<Tag extends string> = Replace<
  Replace<
    Replace<Replace<Tag, '{', '', { all: true }>, '}', '', { all: true }>,
    ':',
    '',
    { all: true }
  >,
  '#',
  '',
  { all: true }
>

export type ZIssueLocalContextOpts = GetLocalCtxTagOpts & {
  WithBraces?: boolean
}
export type ZIssueLocalContext<
  T extends AnyZIssueCode,
  Opts extends ZIssueLocalContextOpts = { Extras: false; WithBraces: false }
> = {
  [K in T]: {
    [KK in Opts['WithBraces'] extends true
      ? GetLocalCtxTag<K, Opts>
      : RemoveLocalCtxTagBraces<
          GetLocalCtxTag<K, Opts>
        >]: RemoveLocalCtxTagBraces<KK> extends keyof ZIssueLocalCtxTagTypeMap
      ? ZIssueLocalCtxTagTypeMap[RemoveLocalCtxTagBraces<KK>]
      : any
  }
}[T]

export type AnyZIssueLocalContext = ZIssueLocalContext<AnyZIssueCode>
