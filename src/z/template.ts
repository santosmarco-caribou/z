import Joi from 'joi'
import type { S } from 'ts-toolbelt'

import {
  type _ZInput,
  type _ZOutput,
  AnyZEnum,
  AnyZLiteral,
  Z,
  ZBoolean,
  ZFalse,
  ZJoi,
  ZNumber,
  ZString,
  ZTrue,
  ZTuple,
  ZType,
} from '../_internals'
import { generateZHint } from '../utils'

/* -------------------------------------------------------------------------- */
/*                                  ZTemplate                                 */
/* -------------------------------------------------------------------------- */

type AllowedZTemplateParts =
  | ZString
  | AnyZLiteral
  | AnyZEnum
  | ZNumber
  | ZBoolean
  | ZTrue
  | ZFalse

export class ZTemplate<
  T extends readonly [AllowedZTemplateParts, ...AllowedZTemplateParts[]]
> extends Z<{
  Output: S.Join<_ZOutput<ZTuple<T>>>
  Input: S.Join<_ZInput<ZTuple<T>>>
  Schema: Joi.StringSchema
  Elements: T
}> {
  readonly name = ZType.Template
  protected readonly _hint = generateZHint(
    () =>
      `\`${this._props
        .getOne('elements')
        .map(el => {
          switch (el.name) {
            case ZType.String:
              return '${string}'
            case ZType.Literal:
              return el.value
            case ZType.Enum:
              return `\${${el.values.map(v => `'${v}'`).join(' | ')}}`
            case ZType.Number:
              return '${number}'
            case ZType.Boolean:
              return '${true | false}'
            case ZType.True:
              return 'true'
            case ZType.False:
              return 'false'
          }
        })
        .join('')}\``
  )

  /* ------------------------------------------------------------------------ */

  static create = <
    T extends readonly [AllowedZTemplateParts, ...AllowedZTemplateParts[]]
  >(
    elements: T
  ): ZTemplate<T> => {
    const regex = RegExp(
      `^${elements
        .map(el => {
          switch (el.name) {
            case ZType.String:
              return '\\w*'
            case ZType.Literal:
              return el.value
            case ZType.Enum:
              return `(${el.values.join('|')})`
            case ZType.Number:
              return '\\d*'
            case ZType.Boolean:
              return '(true|false)'
            case ZType.True:
              return 'true'
            case ZType.False:
              return 'false'
          }
        })
        .join('')}$`
    )

    return new ZTemplate<T>(
      {
        schema: ZJoi.string().regex(regex),
        manifest: {},
        hooks: {},
      },
      { elements }
    )
  }
}
