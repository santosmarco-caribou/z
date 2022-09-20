export namespace TypeUtils {
  /* ------------------------------ Basic types ----------------------------- */

  export type AnyObject = Record<PropertyKey, any>
  export type AnyArray = any[] | readonly any[]

  /* -------------------------------- Branded ------------------------------- */

  declare const _tag: unique symbol
  export type Branded<Type, Brand> = Type & { readonly [_tag]: Brand }

  /* -------------------------------- Errors -------------------------------- */

  export type Error<Msg extends string> = `TypeError: ${Msg}`
}
