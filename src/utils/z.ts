import type {
  AnyZ,
  AnyZOptional,
  AnyZRequired,
  ZArray,
  ZNullable,
  ZObject,
  ZOptional,
  ZRequired,
  ZTuple,
} from '../_internals'

export namespace ZUtils {
  export type ToZOptional<T> = T extends AnyZ
    ? T extends AnyZOptional
      ? T
      : ZOptional<T>
    : never

  export type ToZRequired<T> = T extends AnyZ
    ? T extends AnyZRequired
      ? T
      : ZRequired<T>
    : never

  export type ToZOptionalDeep<T> = T extends AnyZ
    ? T extends ZObject<infer Shape, infer Opts>
      ? ToZOptional<
          ZObject<
            {
              [K in keyof Shape]: ToZOptionalDeep<Shape[K]>
            },
            Opts
          >
        >
      : T extends ZArray<infer Element, infer Card>
      ? ToZOptional<ZArray<ToZOptionalDeep<Element>, Card>>
      : T extends ZOptional<infer I>
      ? ToZOptional<ToZOptionalDeep<I>>
      : T extends ZNullable<infer I>
      ? ToZOptional<ZNullable<ToZOptionalDeep<I>>>
      : T extends ZTuple<infer TItems, infer TRest>
      ? {
          [K in keyof TItems]: TItems[K] extends AnyZ
            ? ToZOptionalDeep<TItems[K]>
            : never
        } extends infer NewTItems
        ? NewTItems extends [AnyZ, ...AnyZ[]]
          ? ToZOptional<
              ZTuple<
                NewTItems,
                TRest extends AnyZ ? ToZOptional<ToZOptionalDeep<TRest>> : TRest
              >
            >
          : never
        : never
      : ToZOptional<T>
    : never

  export type ToZRequiredDeep<T> = T extends AnyZ
    ? T extends ZObject<infer Shape, infer Opts>
      ? ToZRequired<
          ZObject<
            {
              [K in keyof Shape]: ToZRequiredDeep<Shape[K]>
            },
            Opts
          >
        >
      : T extends ZArray<infer Element, infer Card>
      ? ToZRequired<ZArray<ToZRequiredDeep<Element>, Card>>
      : T extends ZRequired<infer I>
      ? ToZRequired<ToZRequiredDeep<I>>
      : T extends ZNullable<infer I>
      ? ToZRequired<ZNullable<ToZRequiredDeep<I>>>
      : T extends ZTuple<infer TItems, infer TRest>
      ? {
          [K in keyof TItems]: TItems[K] extends AnyZ
            ? ToZRequiredDeep<TItems[K]>
            : never
        } extends infer NewTItems
        ? NewTItems extends [AnyZ, ...AnyZ[]]
          ? ToZRequired<
              ZTuple<
                NewTItems,
                TRest extends AnyZ ? ToZRequired<ToZRequiredDeep<TRest>> : TRest
              >
            >
          : never
        : never
      : ToZRequired<T>
    : never
}
