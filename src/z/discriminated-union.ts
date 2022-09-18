import Joi from 'joi'
import { isUndefined } from 'lodash'
import { Primitive } from 'type-fest'

import {
  _ZInput,
  _ZOutput,
  _zShapeToJoiSchemaMap,
  AnyZObjectShape,
  Z,
  ZJoi,
  ZLiteral,
  ZObject,
  ZType,
} from '../_internals'
import { unionizeHints } from '../utils'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                 ZDiscriminatedUnion                                                */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZDiscriminatedUnionOption<
  Discriminator extends string,
  DiscriminatorValue extends NonNullable<Primitive>
> = ZObject<
  {
    [K in Discriminator]: ZLiteral<DiscriminatorValue>
  } & Omit<AnyZObjectShape, Discriminator>
>

export class ZDiscriminatedUnion<
  Discriminator extends string,
  DiscriminatorValue extends NonNullable<Primitive>,
  Option extends ZDiscriminatedUnionOption<Discriminator, DiscriminatorValue>
> extends Z<{
  Output: _ZOutput<Option>
  Input: _ZInput<Option>
  Schema: Joi.ObjectSchema
  Options: Option[]
}> {
  readonly name = ZType.DiscriminatedUnion
  protected readonly _hint = `${unionizeHints(
    ...this._props.getOne('options').map(o => o.hint)
  )}`

  get options(): Option[] {
    return this._props.getOne('options')
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <
    Discriminator extends string,
    DiscriminatorValue extends NonNullable<Primitive>,
    Types extends [
      ZDiscriminatedUnionOption<Discriminator, DiscriminatorValue>,
      ZDiscriminatedUnionOption<Discriminator, DiscriminatorValue>,
      ...ZDiscriminatedUnionOption<Discriminator, DiscriminatorValue>[]
    ]
  >(
    discriminator: Discriminator,
    types: Types
  ): ZDiscriminatedUnion<Discriminator, DiscriminatorValue, Types[number]> => {
    return new ZDiscriminatedUnion(
      {
        schema: ZJoi.object({
          [String(discriminator)]: ZJoi.any().valid(
            ...types.map(t => t.shape[discriminator].value)
          ),
        }).append(
          ZJoi.alternatives().conditional(ZJoi.ref(String(discriminator)), {
            switch: types
              .filter(t => !isUndefined(t.shape))
              .map(t => ({
                is: ZJoi.any().valid(t.shape?.[discriminator].value),
                then: ZJoi.object(_zShapeToJoiSchemaMap(t['shape'])),
              })),
          })
        ),
        manifest: {},
        hooks: {},
      },
      { options: types }
    )
  }
}
