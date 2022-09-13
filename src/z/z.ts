// import type { F, U } from 'ts-toolbelt'
// import type { Primitive, Simplify } from 'type-fest'

// import type { AnyZDef, ZDef } from '../def'
// import { type ZCheckOptions, ZType } from '../types'
// import { ZObjectUtils, ZUtils } from '../utils'
// import {
//   type ZAlternativesSchema,
//   type ZAnySchema,
//   type ZArraySchema,
//   type ZBinarySchema,
//   type ZEntriesSchema,
//   type ZFunctionSchema,
//   type ZNumberSchema,
//   type ZObjectSchema,
//   type ZOnlySchema,
//   type ZStringOnlySchema,
//   type ZStringSchema,
//   type ZTupleSchema,
//   ZValidator,
// } from '../validation/validator'

// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /*                                                       ZArray                                                       */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */

// export type ZArrayDef<T extends AnyZ> = ZDef<{ validator: ZArraySchema }, { element: T }>

// /**
//  * @group ZTypes
//  */
// export class ZArray<T extends AnyZ, Arr extends T[] | readonly T[] = T[] | readonly T[]> extends Z<
//   ZUtils.MapToZOutput<Arr>,
//   ZArrayDef<T>,
//   ZUtils.MapToZInput<Arr>
// > {
//   readonly name = ZType.Array
//   readonly hint = `${this._def.element.hint}[]`

//   /**
//    * Retrieves the schema of the array's element.
//    */
//   get element(): T {
//     return this._def.element
//   }

//   /**
//    * Requires the array to be in ascending order.
//    */
//   ascending(options?: ZCheckOptions<'array.sort'>): this {
//     return this._parser.addCheck('array.sort', v => v.sort({ order: 'ascending' }), options)
//   }
//   /**
//    * Requires the array to be in descending order.
//    */
//   descending(options?: ZCheckOptions<'array.sort'>): this {
//     return this._parser.addCheck('array.sort', v => v.sort({ order: 'descending' }), options)
//   }

//   /**
//    * Requires the array to have at least a certain number of elements.
//    *
//    * @param min - The minimum number of elements in the array.
//    */
//   min(min: number, options?: ZCheckOptions<'array.min'>): this {
//     return this._parser.addCheck('array.min', v => v.min(min), options)
//   }
//   /**
//    * Requires the array to have at most a certain number of elements.
//    *
//    * @param max - The maximum number of elements in the array.
//    */
//   max(max: number, options?: ZCheckOptions<'array.max'>): this {
//     return this._parser.addCheck('array.max', v => v.max(max), options)
//   }
//   /**
//    * Requires the array to have an exact number of elements.
//    *
//    * @param length - The number of elements in the array.
//    */
//   length(length: number, options?: ZCheckOptions<'array.length'>): this {
//     return this._parser.addCheck('array.length', v => v.length(length), options)
//   }

//   /**
//    * Requires the array to have at least one element.
//    */
//   nonempty(options?: ZCheckOptions<'array.min'>): ZArray<T, [T, ...T[]]> {
//     return this.min(1, options) as any
//   }

//   readonly(): ZArray<T, Arr extends [T, ...T[]] ? readonly [T, ...T[]] : readonly T[]> {
//     this._parser.addAfterParseHook(Object.freeze)
//     return this as any
//   }

//   /* ---------------------------------------------------------------------------------------------------------------- */

//   static create = <T extends AnyZ, Arr extends T[] = T[]>(element: T): ZArray<T, Arr> =>
//     new ZArray<T, Arr>({ validator: ZValidator.array(element['_validator'].optional()), element })
// }

// /**
//  * @group Type utils
//  */
// export type AnyZArray = ZArray<AnyZ, AnyZ[]>

// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /*                                                       ZBinary                                                      */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */

// export type ZBinaryDef = ZDef<{ validator: ZBinarySchema }>

// /**
//  * @group ZTypes
//  */
// export class ZBinary extends Z<Buffer, ZBinaryDef> {
//   readonly name = ZType.Binary
//   readonly hint = 'Buffer'

//   /**
//    * Sets the string encoding format if a string input is converted to a buffer.
//    *
//    * @param encoding - The encoding format.
//    */
//   encoding(encoding: string): this {
//     return this._parser.addCheck(v => v.encoding(encoding))
//   }

//   /**
//    * Specifies the minimum length of the buffer.
//    *
//    * @param min - The minimum length of the buffer.
//    */
//   min(min: number, options?: ZCheckOptions<'binary.min'>): this {
//     return this._parser.addCheck('binary.min', v => v.min(min), options)
//   }
//   /**
//    * Specifies the maximum length of the buffer.
//    *
//    * @param max - The maximum length of the buffer.
//    */
//   max(max: number, options?: ZCheckOptions<'binary.max'>): this {
//     return this._parser.addCheck('binary.max', v => v.max(max), options)
//   }
//   /**
//    * Specifies the exact length of the buffer.
//    *
//    * @param length - The length of the buffer.
//    */
//   length(length: number, options?: ZCheckOptions<'binary.length'>): this {
//     return this._parser.addCheck('binary.length', v => v.length(length), options)
//   }

//   static create = () => new ZBinary({ validator: ZValidator.binary() })
// }

// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /*                                                        ZEnum                                                       */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */

// export type ZEnumDef<T extends string> = ZDef<{ validator: ZStringOnlySchema }, { values: T[] }>

// /**
//  * @group ZTypes
//  */
// export class ZEnum<T extends string> extends Z<T, ZEnumDef<T>> {
//   readonly name = ZType.Enum
//   readonly hint = ZUtils.unionizeHints(...this._def.values.map(value => `'${value}'`).sort())

//   get values(): T[] {
//     return this._def.values
//   }

//   static create: {
//     <T extends string>(values: F.Narrow<T>[]): ZEnum<T>
//     <T extends string>(...values: F.Narrow<T>[]): ZEnum<T>
//   } = <T extends string>(...values: T[] | [T[]]): ZEnum<T> => {
//     const _values = (Array.isArray(values[0]) ? values[0] : values) as T[]
//     return new ZEnum({ validator: ZValidator.string.only(..._values), values: _values })
//   }
// }

// /**
//  * @group Type utils
//  */
// export type AnyZEnum = ZEnum<string>

// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /*                                                      ZFunction                                                     */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */

// export type ZFunctionDef<P extends AnyZ[], R extends AnyZ> = ZDef<
//   { validator: ZFunctionSchema },
//   { parameters: ZTuple<P>; returnType: R }
// >

// /**
//  * @group ZTypes
//  */
// export class ZFunction<P extends AnyZ[], R extends AnyZ> extends Z<
//   ZUtils.Function<ZUtils.MapToZInput<P>, _ZOutput<R>>,
//   ZFunctionDef<P, R>,
//   ZUtils.Function<ZUtils.MapToZOutput<P>, _ZInput<R>>
// > {
//   readonly name = ZType.Function
//   readonly hint = `(${this._def.parameters.elements.map((z, idx) => `args_${idx}: ${z.hint}`).join(', ')}) => ${
//     this._def.returnType.hint
//   }`

//   get parameters(): ZTuple<P> {
//     return this._def.parameters
//   }
//   get returnType(): R {
//     return this._def.returnType
//   }

//   /**
//    * Requires the function to have a certain set of parameters.
//    *
//    * @param parameters - parameters The schemas of the function's parameters.
//    */
//   arguments<T extends AnyZ[]>(parameters: F.Narrow<T>): ZFunction<T, R> {
//     return new ZFunction({ ...this._def, validator: this._validator, parameters: ZTuple.create(parameters) })
//   }
//   /**
//    * {@inheritDoc ZFunction#arguments}
//    */
//   args<T extends AnyZ[]>(parameters: F.Narrow<T>): ZFunction<T, R> {
//     return this.arguments(parameters)
//   }

//   /**
//    * Requires the function to return a certain type.
//    *
//    * @param returnType - The schema of the function's return type.
//    */
//   returns<T extends AnyZ>(returnType: T): ZFunction<P, T> {
//     return new ZFunction({ ...this._def, validator: this._validator, returnType })
//   }

//   implement(fn: _ZOutput<this>): (...args: ZUtils.MapToZInput<P>) => _ZOutput<R> {
//     const validatedFn = this.parse(fn)
//     return validatedFn
//   }

//   /* ---------------------------------------------------------------------------------------------------------------- */

//   static create: {
//     <P extends AnyZ[], R extends AnyZ>(parameters: F.Narrow<P>, returnType: R): ZFunction<P, R>
//     (): ZFunction<[], ZUnknown>
//   } = <P extends AnyZ[], R extends AnyZ>(
//     parameters?: F.Narrow<P>,
//     returnType?: R
//   ): ZFunction<P, R> | ZFunction<[], ZUnknown> => {
//     const validator = ZValidator.function()
//     if (parameters && returnType) {
//       return new ZFunction({ validator, parameters: ZTuple.create(parameters), returnType: returnType })
//     }
//     return new ZFunction({ validator, parameters: ZTuple.create([]), returnType: ZUnknown.create() })
//   }
// }

// /**
//  * @group Type utils
//  */
// export type AnyZFunction = ZFunction<AnyZ[], AnyZ>

// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /*                                                     ZInstanceOf                                                    */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */

// export type ZInstanceOfDef<T extends new (...args: any[]) => any> = ZDef<{ validator: ZAnySchema }, { type: T }>

// /**
//  * @group ZTypes
//  */
// export class ZInstanceOf<T extends new (...args: any[]) => any> extends Z<InstanceType<T>, ZInstanceOfDef<T>> {
//   readonly name = ZType.InstanceOf
//   readonly hint = `instanceof ${this._def.type.name}`

//   /* ---------------------------------------------------------------------------------------------------------------- */

//   static create = <T extends new (...args: any[]) => any>(type: T): ZInstanceOf<T> =>
//     new ZInstanceOf({
//       validator: ZValidator.custom(ZValidator.any(), (value, { OK, FAIL }) =>
//         value instanceof type ? OK(value) : FAIL('instanceof.base', { type: type.name })
//       ),
//       type,
//     })
// }

// /**
//  * @group Type utils
//  */
// export type AnyZInstanceOf = ZInstanceOf<new (...args: any[]) => any>

// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /*                                                    ZIntersection                                                   */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */

// export type ZIntersectionDef<T extends AnyZ[]> = ZDef<{ validator: ZAlternativesSchema }, { components: T }>

// /**
//  * @group ZTypes
//  */
// export class ZIntersection<T extends AnyZ[]> extends Z<
//   U.IntersectOf<_ZOutput<T[number]>>,
//   ZIntersectionDef<T>,
//   U.IntersectOf<_ZInput<T[number]>>
// > {
//   readonly name = ZType.Intersection
//   readonly hint = this._def.components.map(z => z.hint).join(' & ')

//   get components(): T {
//     return this._def.components
//   }

//   static create = <T extends AnyZ[]>(...components: F.Narrow<T>): ZIntersection<T> => {
//     const optAlreadyAlt = components.find(opt => opt._validator.type === 'alternatives')

//     return new ZIntersection({
//       validator: (optAlreadyAlt
//         ? (optAlreadyAlt._validator as ZAlternativesSchema).concat(
//             ZValidator.alternatives(
//               ...components.filter(opt => opt._id !== optAlreadyAlt._id).map(option => option['_validator'])
//             )
//           )
//         : ZValidator.alternatives(...components.map(option => option['_validator']))
//       ).match('all'),
//       components: components as T,
//     })
//   }
// }

// /**
//  * @group Type utils
//  */
// export type AnyZIntersection = ZIntersection<AnyZ[]>

// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /*                                                      ZLiteral                                                      */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */

// export type ZLiteralDef<T extends Primitive> = ZDef<{ validator: ZOnlySchema<T> }, { value: T }>

// /**
//  * @group ZTypes
//  */
// export class ZLiteral<T extends Primitive> extends Z<T, ZLiteralDef<T>> {
//   readonly name = ZType.Literal
//   readonly hint = typeof this._def.value === 'string' ? `'${this._def.value}'` : String(this._def.value)

//   get value(): T {
//     return this._def.value
//   }

//   static create = <T extends Primitive>(value: F.Narrow<T>): ZLiteral<T> =>
//     new ZLiteral({ validator: ZValidator.only(value), value: value as T })
// }

// /**
//  * @group Type utils
//  */
// export type AnyZLiteral = ZLiteral<Primitive>

// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /*                                                        ZMap                                                        */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */

// export type ZMapDef<K extends AnyZ, V extends AnyZ> = ZDef<{ validator: ZEntriesSchema }, { keyType: K; valueType: V }>

// /**
//  * @group ZTypes
//  */
// export class ZMap<K extends AnyZ, V extends AnyZ> extends Z<
//   Map<_ZOutput<K>, _ZOutput<V>>,
//   ZMapDef<K, V>,
//   Map<_ZInput<K>, _ZInput<V>>
// > {
//   readonly name = ZType.Map
//   readonly hint = `Map<${this._def.keyType.hint}, ${this._def.valueType.hint}>`

//   get keyType(): K {
//     return this._def.keyType
//   }
//   get valueType(): V {
//     return this._def.valueType
//   }

//   entries(): ZTuple<[K, V]> {
//     return this.transferDependencies(ZTuple.create([this._def.keyType, this._def.valueType]))
//   }

//   static create = <K extends AnyZ, V extends AnyZ>(keyType: K, valueType: V): ZMap<K, V> =>
//     new ZMap({
//       validator: ZValidator.entries(
//         keyType,
//         valueType,
//         (value, FAIL) => (value instanceof Map ? { entries: [...value.entries()] } : { error: FAIL('map.base') }),
//         FAIL => FAIL('map.key.base', { type: keyType.hint }),
//         FAIL => FAIL('map.value.base', { type: valueType.hint })
//       ),
//       keyType,
//       valueType,
//     })
// }

// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /*                                                       ZNumber                                                      */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */

// export type ZNumberPrecisionOptions = {
//   strict?: boolean
// } & ZCheckOptions<'number.precision'>

// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */

// export type ZNumberDef = ZDef<{ validator: ZNumberSchema }>

// /**
//  * @group ZTypes
//  */
// export class ZNumber extends Z<number, ZNumberDef> {
//   readonly name = ZType.Number
//   readonly hint = 'number'

//   /**
//    * Requires the number to be an integer (no floating point).
//    */
//   integer(options?: ZCheckOptions<'number.integer'>): this {
//     return this._parser.addCheck('number.integer', v => v.integer(), options)
//   }
//   /**
//    * {@inheritDoc ZNumber#integer}
//    */
//   int(options?: ZCheckOptions<'number.integer'>): this {
//     return this.integer(options)
//   }

//   /**
//    * Requires the number to have a maximum precision, i.e., a maximum number of decimal places.
//    *
//    * @remarks
//    * By default, this check will round the number to the specified precision.
//    * If you want to strictly parse the value, though, and throw an error instead, set the `strict` option to `true`.
//    *
//    * @example Default behavior
//    * ```ts
//    * z.number().precision(2).parse(1.234) // => 1.23
//    * ```
//    *
//    * @example Strict behavior
//    * ```ts
//    * z.number().precision(2, { strict: true }).parse(1.234) // => throws
//    * ```
//    *
//    * @param precision - The maximum number of decimal places allowed.
//    */
//   precision(precision: number, options?: ZNumberPrecisionOptions): this {
//     return this._parser.addCheck(
//       'number.precision',
//       v => {
//         const baseCheck = v.precision(precision)
//         if (options?.strict) return baseCheck.strict()
//         return baseCheck
//       },
//       { message: options?.message }
//     )
//   }

//   /**
//    * Requires the number to be positive.
//    */
//   positive(options?: ZCheckOptions<'number.positive'>): this {
//     return this._parser.addCheck('number.positive', v => v.positive(), options)
//   }
//   /**
//    * Requires the number to be less than or equal to 0.
//    */
//   nonpositive(): this {
//     return this.max(0)
//   }

//   /**
//    * Requires the number to be negative.
//    */
//   negative(options?: ZCheckOptions<'number.negative'>): this {
//     return this._parser.addCheck('number.negative', v => v.negative(), options)
//   }
//   /**
//    * Requires the number to be greater than or equal to 0.
//    */
//   nonnegative(options?: ZCheckOptions<'number.min'>): this {
//     return this.min(0, options)
//   }

//   /**
//    * Requires the number to be greater than or equal to a certain value.
//    *
//    * @param value - The minimum value allowed.
//    */
//   min(value: number, options?: ZCheckOptions<'number.min'>): this {
//     return this._parser.addCheck('number.min', v => v.min(value), options)
//   }
//   /**
//    * {@inheritDoc ZNumber#min}
//    */
//   gte(value: number, options?: ZCheckOptions<'number.min'>): this {
//     return this.min(value, options)
//   }

//   /**
//    * Requires the number to be greater than (but not equal to) a certain value.
//    *
//    * @param value - The minimum value allowed (exclusive).
//    */
//   greater(value: number, options?: ZCheckOptions<'number.greater'>): this {
//     return this._parser.addCheck('number.greater', v => v.greater(value), options)
//   }
//   /**
//    * {@inheritDoc ZNumber#greater}
//    */
//   gt(value: number, options?: ZCheckOptions<'number.greater'>): this {
//     return this.greater(value, options)
//   }

//   /**
//    * Requires the number to be less than or equal to a certain value.
//    *
//    * @param value - The maximum value allowed.
//    */
//   max(value: number, options?: ZCheckOptions<'number.max'>): this {
//     return this._parser.addCheck('number.max', v => v.max(value), options)
//   }
//   /**
//    * {@inheritDoc ZNumber#max}
//    */
//   lte(value: number, options?: ZCheckOptions<'number.max'>): this {
//     return this.max(value, options)
//   }

//   /**
//    * Requires the number to be less than (but not equal to) a certain value.
//    *
//    * @param value - The maximum value allowed (exclusive).
//    */
//   less(value: number, options?: ZCheckOptions<'number.less'>): this {
//     return this._parser.addCheck('number.less', v => v.less(value), options)
//   }
//   /**
//    * {@inheritDoc ZNumber#less}
//    */
//   lt(value: number, options?: ZCheckOptions<'number.less'>): this {
//     return this.less(value, options)
//   }

//   /**
//    * Requires the number to be a multiple of a certain value.
//    *
//    * @param value - The value of which the number must be a multiple.
//    */
//   multiple(value: number, options?: ZCheckOptions<'number.multiple'>): this {
//     return this._parser.addCheck('number.multiple', v => v.multiple(value), options)
//   }

//   /**
//    * Requires the number to be a TCP port, i.e., between `0` and `65535`.
//    */
//   port(options?: ZCheckOptions<'number.port'>): this {
//     this._parser.addCheck('number.port', v => v.port(), options)
//     this._manifest.setKey('format', 'port')
//     return this
//   }

//   /* ---------------------------------------------------------------------------------------------------------------- */

//   static create = (): ZNumber => new ZNumber({ validator: ZValidator.number() })
// }

// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /*                                                       ZObject                                                      */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */

// /**
//  * @group Type utils
//  */
// export type AnyZObjectShape = Record<string, AnyZ>

// export type ZObjectOptions = { mode: 'passthrough' | 'strip' | 'strict' }
// const DEFAULT_Z_OBJECT_OPTIONS: ZObjectOptions = { mode: 'strip' }

// export type ZObjectDef<Shape extends AnyZObjectShape> = ZDef<
//   { validator: ZObjectSchema },
//   { shape: Shape; options: ZObjectOptions; catchall: AnyZ }
// >

// /**
//  * @group ZTypes
//  */
// export class ZObject<Shape extends AnyZObjectShape> extends Z<
//   ZUtils.WithQuestionMarks<ZUtils.MapToZOutput<Shape>>,
//   ZObjectDef<Shape>,
//   ZUtils.WithQuestionMarks<ZUtils.MapToZInput<Shape>>
// > {
//   readonly name = ZType.Object
//   readonly hint = ZUtils.generateZObjectHint(this._def.shape)

//   get shape(): Shape {
//     return this._def.shape
//   }

//   keyof(): ZEnum<Extract<keyof Shape, string>> {
//     return ZEnum.create<Extract<keyof Shape, string>>(
//       ...(Object.keys(this._def.shape) as F.Narrow<Extract<keyof Shape, string>>[])
//     )
//   }

//   pick<K extends keyof Shape>(keys: K[]): ZObject<Simplify<Pick<Shape, K>>> {
//     return this.transferDependencies(
//       ZObject.$_create(ZUtils.pick(this._def.shape, keys), this._def.options, this._def.catchall)
//     )
//   }

//   omit<K extends keyof Shape>(keys: K[]): ZObject<Simplify<Omit<Shape, K>>> {
//     return this.transferDependencies(
//       ZObject.$_create(ZUtils.omit(this._def.shape, keys), this._def.options, this._def.catchall)
//     )
//   }

//   extend<S extends AnyZObjectShape>(incomingShape: S): ZObject<Simplify<Shape & S>> {
//     return this.transferDependencies(
//       ZObject.$_create(ZUtils.merge(this._def.shape, incomingShape), this._def.options, this._def.catchall)
//     )
//   }

//   merge<S extends AnyZObjectShape>(incomingSchema: ZObject<S>): ZObject<Simplify<Shape & S>> {
//     return this.extend(incomingSchema.shape)
//   }

//   /**
//    * Inspired by the built-in TypeScript utility type {@link https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype | `Partial`},
//    * the `.partial()` method makes all properties optional.
//    *
//    * @example Starting from this object:
//    * ```ts
//    * const user = z.object({
//    *   email: z.string()
//    *   username: z.string(),
//    * })
//    * // { email: string; username: string }
//    * ```
//    *
//    * We can create a partial version:
//    *
//    * ```ts
//    * const partialUser = user.partial()
//    * // { email?: string | undefined; username?: string | undefined }
//    * ```
//    */
//   partial(): ZObject<ZObjectUtils.ToPartialZObjectShape<Shape>> {
//     return this.transferDependencies(
//       ZObject.$_create(
//         Object.fromEntries(
//           Object.entries(this._def.shape).map(([key, z]) => [key, z.optional()])
//         ) as ZObjectUtils.ToPartialZObjectShape<Shape>,
//         this._def.options,
//         this._def.catchall
//       )
//     )
//   }

//   /**
//    * The `.partial()` method is shallow—it only applies one level deep. There is also a "deep" version:
//    *
//    * @example
//    * ```ts
//    * const user = z.object({
//    *   username: z.string(),
//    *   location: z.object({
//    *     latitude: z.number(),
//    *     longitude: z.number(),
//    *   }),
//    *   strings: z.array(z.object({ value: z.string() })),
//    * })
//    *
//    * const deepPartialUser = user.deepPartial()
//    * ```
//    *
//    * The result on type inference is:
//    *
//    * ```ts
//    * {
//    *   username?: string | undefined,
//    *   location?: {
//    *     latitude?: number | undefined;
//    *     longitude?: number | undefined;
//    *   } | undefined,
//    *   strings?: { value?: string}[]
//    * }
//    * ```
//    */
//   deepPartial(): ZObject<ZObjectUtils.ToPartialZObjectShape<Shape, 'deep'>> {
//     return this.transferDependencies(
//       ZObject.$_create(
//         Object.fromEntries(
//           Object.entries(this._def.shape).map(([key, z]) => [
//             key,
//             z instanceof ZObject ? z.deepPartial().optional() : z.optional(),
//           ])
//         ) as ZObjectUtils.ToPartialZObjectShape<Shape, 'deep'>,
//         this._def.options,
//         this._def.catchall
//       )
//     )
//   }

//   readonly(): ZObject<ZObjectUtils.ToReadonlyZObjectShape<Shape>> {
//     this._parser.addAfterParseHook(Object.freeze)
//     return this
//   }

//   deepReadonly(): ZObject<ZObjectUtils.ToReadonlyZObjectShape<Shape, 'deep'>> {
//     this._parser.addAfterParseHook(ZObjectUtils.deepFreeze)
//     return this as any
//   }

//   /* ------------------------------------------------- Configuration ------------------------------------------------ */

//   /**
//    * By default `ZObject`s strip out unrecognized keys during parsing.
//    *
//    * @example
//    * ```ts
//    * const person = z.object({
//    *   name: z.string(),
//    * })
//    *
//    * person.parse({
//    *   name: "Bob Dylan",
//    *   extraKey: 61,
//    * })
//    * // => { name: "Bob Dylan" }
//    * // `extraKey` has been stripped
//    * ```
//    *
//    * Instead, if you want to pass through unknown keys, use `.passthrough()`.
//    *
//    * @example
//    * ```ts
//    * person.passthrough().parse({
//    *   name: "Bob Dylan",
//    *   extraKey: 61,
//    * })
//    * // => { name: "Bob Dylan", extraKey: 61 }
//    * ```
//    */
//   passthrough(): this {
//     this._def.options = { mode: 'passthrough' }
//     return this
//   }

//   /**
//    * By default `ZObject`s strip out unrecognized keys during parsing. You can _disallow_ unknown keys with `.strict()`.
//    * If there are any unknown keys in the input, `Z` will throw an error.
//    *
//    * @example
//    * ```ts
//    * const person = z
//    *   .object({
//    *     name: z.string(),
//    *   })
//    *   .strict()
//    *
//    * person.parse({
//    *   name: "Bob Dylan",
//    *   extraKey: 61,
//    * })
//    * // => throws ZError
//    * ```
//    */
//   strict(): this {
//     this._def.options = { mode: 'strict' }
//     return this
//   }

//   /**
//    * You can use the `.strip()` method to reset an `ZObject` to the default behavior (stripping unrecognized keys).
//    */
//   strip(): this {
//     this._def.options = { mode: 'strip' }
//     return this
//   }

//   /**
//    * You can pass a "catchall" `ZType` into a `ZObject`. All unknown keys will be validated against it.
//    *
//    * @example
//    * ```ts
//    * const person = z
//    *   .object({
//    *     name: z.string(),
//    *   })
//    *   .catchall(z.number())
//    *
//    * person.parse({
//    *   name: "Bob Dylan",
//    *   validExtraKey: 61, // works fine
//    * })
//    *
//    * person.parse({
//    *   name: "Bob Dylan",
//    *   validExtraKey: false, // fails
//    * })
//    * // => throws ZError
//    * ```
//    *
//    * _Note:_ Using `.catchall()` obviates `.passthrough()`, `.strip()`, and `.strict()`—All keys are now considered "known".
//    */
//   catchall(z: AnyZ): this {
//     this._def.catchall = z
//     return this
//   }

//   /* ---------------------------------------------------------------------------------------------------------------- */

//   /**
//    * @internal
//    */
//   static $_create = <Shape extends AnyZObjectShape>(
//     shape: Shape,
//     options: ZObjectOptions,
//     catchall: AnyZ
//   ): ZObject<Shape> => {
//     if (catchall) options.mode = 'passthrough'

//     const baseValidator = ZValidator.object(ZObjectUtils.zShapeToJoiSchema(shape)).preferences(
//       {
//         passthrough: { allowUnknown: true, stripUnknown: false },
//         strict: { allowUnknown: false, stripUnknown: false },
//         strip: { allowUnknown: true, stripUnknown: true },
//       }[options.mode]
//     )

//     const zObject = new ZObject({
//       validator: catchall ? baseValidator.pattern(/./, catchall['_validator']) : baseValidator,
//       shape: shape,
//       options,
//       catchall,
//     })

//     zObject._manifest.setKey('keys', ZObjectUtils.getZObjectManifestDeep(zObject.shape))

//     return zObject
//   }

//   static create = <Shape extends AnyZObjectShape>(shape: Shape): ZObject<Shape> =>
//     this.$_create(shape, DEFAULT_Z_OBJECT_OPTIONS, ZAny.create())
// }

// /**
//  * @group Type utils
//  */
// export type AnyZObject = ZObject<AnyZObjectShape>

// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /*                                                       ZRecord                                                      */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */

// export type ZRecordDef<K extends Z<PropertyKey, AnyZDef>, V extends AnyZ> = ZDef<
//   { validator: ZEntriesSchema },
//   { keyType: K; valueType: V }
// >

// /**
//  * @group ZTypes
//  */
// export class ZRecord<K extends Z<PropertyKey, AnyZDef>, V extends AnyZ> extends Z<
//   Record<_ZOutput<K>, _ZOutput<V>>,
//   ZRecordDef<K, V>,
//   Record<_ZInput<K>, _ZInput<V>>
// > {
//   readonly name = ZType.Record
//   readonly hint = `{ [k: ${this._def.keyType.hint}]: ${this._def.valueType.hint} }`

//   get keyType(): K {
//     return this._def.keyType
//   }
//   get valueType(): V {
//     return this._def.valueType
//   }

//   entries(): ZTuple<[K, V]> {
//     return this.transferDependencies(ZTuple.create([this._def.keyType, this._def.valueType]))
//   }

//   static create: {
//     <V extends AnyZ>(valueType: V): ZRecord<ZString, V>
//     <K extends Z<PropertyKey, AnyZDef>, V extends AnyZ>(keyType: K, valueType: V): ZRecord<K, V>
//   } = <K extends Z<PropertyKey, AnyZDef>, V extends AnyZ>(
//     valueTypeOrKeyType: V | K,
//     valueType?: V
//   ): ZRecord<ZString, V> | ZRecord<K, V> => {
//     const buildValidator = (keyType: Z<PropertyKey, AnyZDef>, valueType: AnyZ) =>
//       ZValidator.entries(
//         keyType,
//         valueType,
//         (value, FAIL) =>
//           ZObjectUtils.isPlainObject(value) ? { entries: Object.entries(value) } : { error: FAIL('record.base') },
//         FAIL => FAIL('record.key.base', { type: keyType.hint }),
//         FAIL => FAIL('record.value.base', { type: valueType.hint })
//       )

//     if (valueType)
//       /* `valueTypeOrKeyType` is keyType */
//       return new ZRecord<K, V>({
//         validator: buildValidator(valueTypeOrKeyType, valueType),
//         keyType: valueTypeOrKeyType as K,
//         valueType,
//       })
//     else
//       return new ZRecord<ZString, V>({
//         validator: buildValidator(ZString.create(), valueTypeOrKeyType),
//         keyType: ZString.create(),
//         valueType: valueTypeOrKeyType as V,
//       })
//   }
// }

// /**
//  * @group Type utils
//  */
// export type AnyZRecord = ZRecord<Z<PropertyKey, AnyZDef>, AnyZ>

// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /*                                                        ZSet                                                        */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */

// export type ZSetDef<T extends AnyZ> = ZDef<{ validator: ZArraySchema }, { element: T }>

// /**
//  * @group ZTypes
//  */
// export class ZSet<T extends AnyZ> extends Z<Set<_ZOutput<T>>, ZSetDef<T>, Set<_ZInput<T>>> {
//   readonly name = ZType.Set
//   readonly hint = `Set<${this._def.element.hint}>`

//   get element(): T {
//     return this._def.element
//   }

//   /**
//    * Requires the Set to have at least a certain number of elements.
//    *
//    * @param min - The minimum number of elements in the Set.
//    */
//   min(min: number, options?: ZCheckOptions<'array.min'>): this {
//     return this._parser.addCheck('array.min', v => v.min(min), options)
//   }
//   /**
//    * Requires the Set to have at most a certain number of elements.
//    *
//    * @param max - The maximum number of elements in the Set.
//    */
//   max(max: number, options?: ZCheckOptions<'array.max'>): this {
//     return this._parser.addCheck('array.max', v => v.max(max), options)
//   }
//   /**
//    * Requires the Set to have a certain size.
//    *
//    * @param size - The exact number of elements in the Set.
//    */
//   size(size: number, options?: ZCheckOptions<'array.length'>): this {
//     return this._parser.addCheck('array.length', v => v.length(size), options)
//   }

//   /**
//    * Requires the Set to have at least one element.
//    */
//   nonempty(options?: ZCheckOptions<'array.min'>): this {
//     return this.min(1, options)
//   }

//   static create = <T extends AnyZ>(element: T): ZSet<T> =>
//     new ZSet({ validator: ZValidator.array(element['_validator']).unique().cast('set'), element })
// }

// /**
//  * @group Type utils
//  */
// export type AnyZSet = ZSet<AnyZ>

// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /*                                                       ZString                                                      */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */

// /**
//  * @group ZString options
//  */
// export type ZStringDomainTldsOptions = {
//   allow?: string[] | boolean
//   deny?: string[]
// }

// /**
//  * @group ZString options
//  */
// export type ZStringDomainOptions = {
//   allowFullyQualified?: boolean
//   allowUnicode?: boolean
//   minDomainSegments?: number
//   tlds?: ZStringDomainTldsOptions | false
// } & ZCheckOptions<'string.domain'>

// /**
//  * @group ZString options
//  */
// export type ZStringIpOptions = {
//   version?: ZUtils.MaybeArray<'ipv4' | 'ipv6' | 'ipvfuture'>
//   cidr?: 'optional' | 'required' | 'forbidden'
// } & ZCheckOptions<'string.ip'>

// /**
//  * @group ZString options
//  */
// export type ZStringUriOptions = {
//   allowQuerySquareBrackets?: boolean
//   allowRelative?: boolean
//   domain?: ZStringDomainOptions
//   relativeOnly?: boolean
//   scheme?: ZUtils.MaybeArray<string | RegExp>
// } & ZCheckOptions<'string.uri'>

// /**
//  * @group ZString options
//  */
// export type ZStringEmailOptions = ZStringDomainOptions & {
//   ignoreLength?: boolean
//   multiple?: boolean
//   separator?: ZUtils.MaybeArray<string>
// } & ZCheckOptions<'string.email'>

// /**
//  * @group ZString options
//  */
// export type ZStringUuidOptions = {
//   version?: ZUtils.MaybeArray<'uuidv1' | 'uuidv2' | 'uuidv3' | 'uuidv4' | 'uuidv5'>
//   separator?: '-' | ':' | boolean
// } & ZCheckOptions<'string.guid'>

// /**
//  * @group ZString options
//  */
// export type ZStringPatternOptions = { name?: string; invert?: boolean } & ZCheckOptions<
//   'string.pattern.base' | 'string.pattern.name' | 'string.pattern.invert.base' | 'string.pattern.invert.name'
// >

// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */

// export type ZStringDef = ZDef<{ validator: ZStringSchema }>

// /**
//  * @group ZTypes
//  */
// export class ZString extends Z<string, ZStringDef> {
//   readonly name = ZType.String
//   readonly hint = 'string'

// /**
//  * Requires the string to only contain `a-z`, `A-Z`, and `0-9`.
//  */
// alphanumeric(options?: ZCheckOptions<'string.alphanum'>): this {
//   this._parser.addCheck('string.alphanum', v => v.alphanum(), options)
//   this._manifest.setKey('format', 'alphanumeric')
//   return this
// }
// /**
//  * {@inheritDoc ZString#alphanumeric}
//  */
// alphanum(options?: ZCheckOptions<'string.alphanum'>): this {
//   return this.alphanumeric(options)
// }

// /**
//  * Requires the string to be a valid `base64` string.
//  */
// base64(options?: ZCheckOptions<'string.base64'>): this {
//   return this._parser.addCheck('string.base64', v => v.base64(), options)
// }

// /**
//  * Requires the string to be a valid hexadecimal string.
//  */
// hexadecimal(options?: ZCheckOptions<'string.hex'>): this {
//   this._parser.addCheck('string.hex', v => v.hex(), options)
//   this._manifest.setKey('format', 'hexadecimal')
//   return this
// }
// /**
//  * {@inheritDoc ZString#hexadecimal}
//  */
// hex(options?: ZCheckOptions<'string.hex'>): this {
//   return this.hexadecimal(options)
// }

// domain(options?: ZStringDomainOptions): this {
//   return this._parser.addCheck('string.domain', v => v.domain(options), { message: options?.message })
// }

// hostname(options?: ZCheckOptions<'string.hostname'>): this {
//   return this._parser.addCheck('string.hostname', v => v.hostname(), options)
// }

// ip(options?: ZStringIpOptions): this {
//   return this._parser.addCheck('string.ip', v => v.ip(options), { message: options?.message })
// }

// uri(options?: ZStringUriOptions): this {
//   this._parser.addCheck('string.uri', v => v.uri(options), { message: options?.message })
//   this._manifest.setKey('format', 'uri')
//   return this
// }

// dataUri(options?: ZCheckOptions<'string.dataUri'>): this {
//   this._parser.addCheck('string.dataUri', v => v.dataUri(), options)
//   this._manifest.setKey('format', 'data-uri')
//   return this
// }

// email(options?: ZStringEmailOptions): this {
//   this._parser.addCheck('string.email', v => v.email(options), { message: options?.message })
//   this._manifest.setKey('format', 'email')
//   return this
// }

// /**
//  * Requires the string to be a valid UUID/GUID.
//  *
//  * @param options - Rule options
//  */
// uuid(options?: ZStringUuidOptions): this {
//   this._parser.addCheck('string.guid', v => v.uuid(options), { message: options?.message })
//   this._manifest.setKey('format', 'uuid')
//   return this
// }
// /**
//  * {@inheritDoc ZString#uuid}
//  */
// guid(options?: ZStringUuidOptions): this {
//   return this.uuid(options)
// }

// isoDate(options?: ZCheckOptions<'string.isoDate'>): this {
//   this._parser.addCheck('string.isoDate', v => v.isoDate(), options)
//   this._manifest.setKey('format', 'date-time')
//   return this
// }

// isoDuration(options?: ZCheckOptions<'string.isoDuration'>): this {
//   return this._parser.addCheck('string.isoDuration', v => v.isoDuration(), options)
// }

// creditCard(options?: ZCheckOptions<'string.creditCard'>): this {
//   return this._parser.addCheck('string.creditCard', v => v.creditCard(), options)
// }

// min(min: number, options?: ZCheckOptions<'string.min'>): this {
//   return this._parser.addCheck('string.min', v => v.min(min), options)
// }

// max(max: number, options?: ZCheckOptions<'string.max'>): this {
//   return this._parser.addCheck('string.max', v => v.max(max), options)
// }

// length(length: number, options?: ZCheckOptions<'string.length'>): this {
//   return this._parser.addCheck('string.length', v => v.length(length), options)
// }

// /**
//  * Requires the string to match a certain pattern.
//  *
//  * @param regex - The regular expression against which to match the string.
//  * @param options - Rule options
//  */
// pattern(regex: RegExp, options?: ZStringPatternOptions): this {
//   if (!options || (!options.invert && !options.name))
//     return this._parser.addCheck('string.pattern.base', v => v.pattern(regex), options)
//   else if (options.name && options.invert)
//     return this._parser.addCheck('string.pattern.invert.name', v => v.pattern(regex, { invert: true }), options)
//   else if (options.name) return this._parser.addCheck('string.pattern.name', v => v.pattern(regex), options)
//   else return this._parser.addCheck('string.pattern.invert.base', v => v.pattern(regex, { invert: true }), options)
// }
// /**
//  * {@inheritDoc ZString#pattern}
//  */
// regex(regex: RegExp, options?: ZStringPatternOptions): this {
//   return this.pattern(regex, options)
// }

// /* -------------------------------------------------- Transforms -------------------------------------------------- */

// lowercase(options?: ZCheckOptions<'string.lowercase'>): this {
//   return this._parser.addCheck('string.lowercase', v => v.lowercase(), options)
// }

// uppercase(options?: ZCheckOptions<'string.uppercase'>): this {
//   return this._parser.addCheck('string.uppercase', v => v.uppercase(), options)
// }

// insensitive(): this {
//   return this._parser.addCheck(v => v.insensitive())
// }

// trim(options?: ZCheckOptions<'string.trim'>): this {
//   return this._parser.addCheck('string.trim', v => v.trim(), options)
// }

// replace(pattern: string | RegExp, replacement: string): this {
//   return this._parser.addCheck(v => v.replace(pattern, replacement))
// }

//   /* ---------------------------------------------------------------------------------------------------------------- */

//   static create = (): ZString => new ZString({ validator: ZValidator.string() })
// }

// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /*                                                       ZTuple                                                       */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* --------------------------class ZOPtiona---------------------------------------------------------------------------------------- */

// export type ZTupleDef<T extends AnyZ[]> = ZDef<{ validator: ZTupleSchema }, { elements: T }>

// /**
//  * @group ZTypes
//  */
// export class ZTuple<T extends AnyZ[]> extends Z<ZUtils.MapToZOutput<T>, ZTupleDef<T>, ZUtils.MapToZInput<T>> {
//   readonly name = ZType.Tuple
//   readonly hint = `[${this._def.elements.map(element => element.hint).join(', ')}]`

//   /**
//    * Retrieves the schemas of the tuple's elements.
//    */
//   get elements(): T {
//     return this._def.elements
//   }

//   static create = <T extends AnyZ[]>(elements: F.Narrow<T>): ZTuple<T> =>
//     new ZTuple({
//       validator: ZValidator.tuple(...elements.map(v => (v as AnyZ)['_validator'])),
//       elements: elements as T,
//     })
// }

// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /*                                                       ZUnion                                                       */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */
// /* ------------------------------------------------------------------------------------------------------------------ */

// export type ZUnionDef<T extends AnyZ[]> = ZDef<{ validator: ZAlternativesSchema }, { options: T }>

// /**
//  * @group ZTypes
//  */
// export class ZUnion<T extends AnyZ[]> extends Z<_ZOutput<T[number]>, ZUnionDef<T>, _ZInput<T[number]>> {
//   readonly name = ZType.Union
//   readonly hint = ZUtils.unionizeHints(...this._def.options.map(option => option.hint))

//   get options(): T {
//     return this._def.options
//   }

//   static create = <T extends AnyZ[]>(...options: F.Narrow<T>): ZUnion<T> => {
//     const optAlreadyAlt = options.find(opt => opt._validator.type === 'alternatives')

//     return new ZUnion({
//       validator: optAlreadyAlt
//         ? (optAlreadyAlt._validator as ZAlternativesSchema).concat(
//             ZValidator.alternatives(
//               ...options.filter(opt => opt._id !== optAlreadyAlt._id).map(option => option['_validator'])
//             )
//           )
//         : ZValidator.alternatives(...options.map(option => option['_validator'])),
//       options: options as T,
//     })
//   }
// }
