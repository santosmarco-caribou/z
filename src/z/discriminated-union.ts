import Joi from 'joi'

import {
  _ZInput,
  _ZOutput,
  AllowedLiterals,
  AnyZObjectShape,
  Z,
  ZLiteral,
  ZObject,
  ZObjectOptions,
  ZType,
  ZUnion,
} from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                 ZDiscriminatedUnion                                                */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZDiscriminatedUnionOptionShape<
  Discriminator extends string,
  DiscriminatorValue extends AllowedLiterals
> = { [K in Discriminator]: ZLiteral<DiscriminatorValue> } & AnyZObjectShape

export class ZDiscriminatedUnion<
  Discriminator extends string,
  DiscriminatorValue extends AllowedLiterals,
  Options extends [
    ZDiscriminatedUnionOptionShape<Discriminator, DiscriminatorValue>,
    ZDiscriminatedUnionOptionShape<Discriminator, DiscriminatorValue>,
    ...ZDiscriminatedUnionOptionShape<Discriminator, DiscriminatorValue>[]
  ]
> extends Z<{
  Output: _ZOutput<_ToRegularZUnion<Discriminator, DiscriminatorValue, Options>>
  Input: _ZInput<_ToRegularZUnion<Discriminator, DiscriminatorValue, Options>>
  Schema: Joi.AnySchema
  Discriminator: Discriminator
  Options: _ToRegularZUnion<Discriminator, DiscriminatorValue, Options>
}> {
  readonly name = ZType.DiscriminatedUnion
  protected readonly _hint = 's'

  get discriminator(): Discriminator {
    return this._props.getOne('discriminator')
  }

  get options(): _ToRegularZUnion<Discriminator, DiscriminatorValue, Options> {
    return this._props.getOne('options')
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <
    Discriminator extends string,
    DiscriminatorValue extends AllowedLiterals,
    Options extends [
      ZDiscriminatedUnionOptionShape<Discriminator, DiscriminatorValue>,
      ZDiscriminatedUnionOptionShape<Discriminator, DiscriminatorValue>,
      ...ZDiscriminatedUnionOptionShape<Discriminator, DiscriminatorValue>[]
    ]
  >(
    discriminator: Discriminator,
    options: { [K in keyof Options]: ZObject<Options[K], ZObjectOptions> }
  ): ZDiscriminatedUnion<Discriminator, DiscriminatorValue, Options> => {
    const union = ZUnion.create(options)
    return new ZDiscriminatedUnion<Discriminator, DiscriminatorValue, Options>(
      {
        schema: union._schema.get(),
        manifest: {},
        hooks: {},
      },
      { discriminator, options: union }
    )
  }
}

/* -------------------------------------------------------------------------- */

type _ToRegularZUnion<
  Discriminator extends string,
  DiscriminatorValue extends AllowedLiterals,
  Options extends [
    ZDiscriminatedUnionOptionShape<Discriminator, DiscriminatorValue>,
    ZDiscriminatedUnionOptionShape<Discriminator, DiscriminatorValue>,
    ...ZDiscriminatedUnionOptionShape<Discriminator, DiscriminatorValue>[]
  ]
> = ZUnion<{ [K in keyof Options]: ZObject<Options[K], ZObjectOptions> }>
