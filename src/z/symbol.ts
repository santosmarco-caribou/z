import type Joi from 'joi'

import { Z, ZJoi, ZManifestObject, ZType } from '../_internals'

/* -------------------------------------------------------------------------- */
/*                                   ZSymbol                                  */
/* -------------------------------------------------------------------------- */

export class ZSymbol extends Z<{
  Output: symbol
  Input: symbol
  Schema: Joi.SymbolSchema
}> {
  readonly name = ZType.Symbol
  protected readonly _hint = 'symbol'

  unique<S extends symbol>(symbol: S): ZUniqueSymbol<S> {
    return ZUniqueSymbol.$_create(this, symbol)
  }

  /* ------------------------------------------------------------------------ */

  static create = (): ZSymbol =>
    new ZSymbol(
      {
        schema: ZJoi.symbol(),
        manifest: {},
        hooks: {},
      },
      {}
    )
}

/* ------------------------------ ZUniqueSymbol ----------------------------- */

export class ZUniqueSymbol<S extends symbol> extends Z<{
  Output: S
  Input: S
  Schema: Joi.SymbolSchema
  Symbol: S
}> {
  readonly name = ZType.UniqueSymbol
  protected readonly _hint = this._props.getOne('symbol').toString()

  get symbol(): S {
    return this._props.getOne('symbol')
  }

  /* ------------------------------------------------------------------------ */

  static $_create = <S extends symbol>(
    parent: ZSymbol,
    symbol: S
  ): ZUniqueSymbol<S> => {
    if (!symbol.description) {
      throw new Error('The provided symbol must have a description')
    }
    return new ZUniqueSymbol<S>(
      {
        schema: parent._schema.get().map({ [symbol.description]: symbol }),
        manifest: parent._manifest.get() as ZManifestObject<S>,
        hooks: parent._hooks.get(),
      },
      { symbol }
    )
  }

  static create = <S extends symbol>(symbol: S): ZUniqueSymbol<S> =>
    this.$_create(ZSymbol.create(), symbol)
}

/* -------------------------------------------------------------------------- */

export type AnyZUniqueSymbol = ZUniqueSymbol<symbol>
