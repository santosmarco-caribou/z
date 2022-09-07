import { ZSpec } from '../tests/z-spec'
import { ZSymbol, ZUniqueSymbol } from './z'

const spec = ZSpec.create('ZSymbol', {
  type: ZSymbol,
  typeName: 'ZSymbol',
  typeHint: 'symbol',
  shouldParse: {
    values: ['symbol', 'unique symbol'],
  },
  shouldNotParse: {
    defaultErrorCode: 'symbol.base',
    defaultErrorMessage: '"value" must be a symbol',
    values: [{ value: 'undefined', errorCode: 'any.required', errorMessage: '"value" is required' }],
  },
}).addSpec('.unique() should return an instance of ZUniqueSymbol', z =>
  expect(z.unique(ZSpec.UNIQUE_SYMBOL)).toBeInstanceOf(ZUniqueSymbol)
)

spec
  .child('ZUniqueSymbol', {
    type: { create: () => ZUniqueSymbol.create(ZSpec.UNIQUE_SYMBOL) },
    typeName: 'ZUniqueSymbol',
    typeHint: 'Symbol(Z_SPEC_UNIQUE_SYMBOL)',
    shouldParse: {
      values: ['unique symbol'],
    },
    shouldNotParse: {
      defaultErrorCode: 'symbol.map',
      defaultErrorMessage: '"value" must be one of [Z_SPEC_UNIQUE_SYMBOL -> Symbol(Z_SPEC_UNIQUE_SYMBOL)]',
      values: [
        { value: 'undefined', errorCode: 'any.required', errorMessage: '"value" is required' },
        { value: 'symbol', errorCode: 'any.only', errorMessage: '"value" must be [Symbol(Z_SPEC_UNIQUE_SYMBOL)]' },
      ],
    },
  })
  .addSpec('.symbol should return the symbol', z => expect(z.symbol).toStrictEqual(ZSpec.UNIQUE_SYMBOL))
  .addSpec('should throw an error when the symbol has no description', () =>
    expect(() => ZUniqueSymbol.create(Symbol())).toThrowError('The provided symbol must have a description')
  )

spec.build()
