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

// /**
//  * @group Type utils
//  */
// export type AnyZArray = ZArray<AnyZ, AnyZ[]>

//

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
//   protected readonly _hint = `(${this._def.parameters.elements.map((z, idx) => `args_${idx}: ${z.hint}`).join(', ')}) => ${
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

// /* --
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
//   protected readonly _hint = this._def.components.map(z => z.hint).join(' & ')

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
//   protected readonly _hint = `Map<${this._def.keyType.hint}, ${this._def.valueType.hint}>`

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
//   protected readonly _hint = ZUtils.generateZObjectHint(this._def.shape)

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
//   protected readonly _hint = `{ [k: ${this._def.keyType.hint}]: ${this._def.valueType.hint} }`

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
//   protected readonly _hint = `Set<${this._def.element.hint}>`

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
