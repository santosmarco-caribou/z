import type Joi from 'joi'

import { type ZDef, Z, ZSchema, ZType, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZSymbol                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZSymbol extends Z<ZDef<{ Output: symbol; Validator: ZSchema<Joi.SymbolSchema> }>> {
  readonly name = ZType.Symbol
  readonly hint = 'symbol'

  unique<S extends symbol>(symbol: S): ZUniqueSymbol<S> {
    return ZUniqueSymbol.$_create(this, symbol)
  }

  static create = (): ZSymbol => new ZSymbol({ validator: ZValidator.symbol() }, {})
}

/* -------------------------------------------------- ZUniqueSymbol ------------------------------------------------- */

export class ZUniqueSymbol<S extends symbol> extends Z<
  ZDef<{ Output: S; Validator: ZSchema<Joi.SymbolSchema> }, { symbol: S }>
> {
  readonly name = ZType.UniqueSymbol
  readonly hint = this._props.symbol.toString()

  get symbol(): S {
    return this._props.symbol
  }

  static $_create = <S extends symbol>(parent: ZSymbol, symbol: S): ZUniqueSymbol<S> => {
    if (!symbol.description) throw new Error('The provided symbol must have a description')
    return new ZUniqueSymbol<S>({ validator: parent._validator.map({ [symbol.description]: symbol }) }, { symbol })
  }

  static create = <S extends symbol>(symbol: S): ZUniqueSymbol<S> => this.$_create(ZSymbol.create(), symbol)
}

/* ------------------------------------------------------------------------------------------------------------------ */

export type AnyZUniqueSymbol = ZUniqueSymbol<symbol>
