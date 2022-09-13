import { AnyZ, TypeOf, ZInput, ZNullable, ZOptional, ZOutput, ZString } from './_internals'

const nullableType = ZNullable.create
const optionalType = ZOptional.create
const stringType = ZString.create

export { nullableType as nullable, optionalType as optional, stringType as string }

export type input<T extends AnyZ> = ZInput<T>
export type output<T extends AnyZ> = ZOutput<T>
export type infer<T extends AnyZ> = TypeOf<T>
