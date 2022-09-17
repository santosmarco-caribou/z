import { mergeWith } from 'lodash'

import type { _ZOutput, BaseZ, ZDef, ZValidator } from '../_internals'
import { hasProp, isArray } from '../utils'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZManifest                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ManifestBasicInfo = {
  title?: string
  summary?: string
  description?: string
}

export type ManifestBasicInfoWithValue<T> = ManifestBasicInfo & {
  value: T
}

export type ManifestType = 'string' | 'number' | 'boolean'

export type ManifestFormat =
  | 'alphanumeric'
  | 'base64'
  | 'bigint'
  | 'data-uri'
  | 'date-time'
  | 'email'
  | 'hexadecimal'
  | 'integer'
  | 'ip'
  | 'port'
  | 'uri'
  | 'uuid'

/* ------------------------------------------------- ZManifestObject ------------------------------------------------ */

export type ZManifestObject<T> = ManifestBasicInfo & {
  type?: ManifestType
  format?: ManifestFormat
  label?: string
  default?: ManifestBasicInfoWithValue<T>
  examples?: ManifestBasicInfoWithValue<T>[]
  tags?: ManifestBasicInfoWithValue<string>[]
  notes?: ManifestBasicInfoWithValue<string>[]
  unit?: string
  deprecated?: boolean
  // ZNumber
  minimum?: number
  maximum?: number
  multipleOf?: number
  // ZArray, ZSet
  element?: AnyZManifestObject
  // ZTuple
  elements?: AnyZManifestObject[]
  rest?: AnyZManifestObject
  // ZRecord
  keys?: AnyZManifestObject
  values?: AnyZManifestObject
}

export type AnyZManifestObject = ZManifestObject<any>

/* ------------------------------------------------------------------------------------------------------------------ */

export interface ZManifest<Def extends ZDef> extends BaseZ<Def>, ZValidator<Def> {}

export class ZManifest<Def extends ZDef> {
  /**
   * Overrides the key name in error messages.
   *
   * @param label - The name of the key.
   */
  label(label: string): this {
    this._updateValidator(v => v.label(label))
    this._updateManifest('label', label)
    return this
  }

  /**
   * Annotates the schema with a title.
   *
   * @param title - The schema's title.
   */
  title(title: string): this {
    this._updateManifest('title', title)
    return this
  }

  /**
   * Annotates the schema with a brief summary.
   *
   * @remarks
   * The summary should be short and concise. For longer explanations, see {@link Z#description}.
   *
   * @param summary - The schema's summary.
   *
   * @example
   * ```ts
   * z.any().summary('A brief summary')
   * ```
   */
  summary(summary: string): this {
    this._updateManifest('summary', summary)
    return this
  }

  /**
   * Annotates the schema with a description.
   *
   * @remarks
   * The description should be a longer and more descriptive explanation of the schema.
   * For shorter and more concise ones, prefer {@link Z#summary} instead.
   *
   * @param description - The schema's description.
   *
   * @example
   * ```ts
   * z.any().description('A long, detailed description of the schema')
   * ```
   */
  description(description: string): this {
    this._updateValidator(v => v.description(description))
    this._updateManifest('description', description)
    return this
  }

  /**
   * Annotates the schema with a default value.
   */
  default(value: _ZOutput<Def> | ManifestBasicInfoWithValue<_ZOutput<Def>>): this {
    this._updateManifest('default', hasProp(value, 'value') ? value : { value: value })
    return this
  }

  /**
   * Adds one or more examples to the schema's manifest.
   */
  examples(...examples: Array<_ZOutput<Def> | ManifestBasicInfoWithValue<_ZOutput<Def>>>): this {
    const exampleObjects = examples.map((example): { value: any } =>
      hasProp(example, 'value') ? example : { value: example }
    )
    this._updateValidator(v => v.example(exampleObjects.map(example => example.value)))
    this._updateManifest('examples', exampleObjects)
    return this
  }
  /**
   * Adds an example to the schema's manifest.
   */
  example(example: _ZOutput<Def> | ManifestBasicInfoWithValue<_ZOutput<Def>>): this {
    return this.examples(example)
  }

  /**
   * Adds one or more tags to the schema's manifest.
   */
  tags(...tags: (string | ManifestBasicInfoWithValue<string>)[]): this {
    const tagObjects = tags.map(tag => (typeof tag === 'string' ? { value: tag } : tag))
    this._updateValidator(v => v.tag(...tagObjects.map(tag => tag.value)))
    this._updateManifest('tags', tagObjects)
    return this
  }
  /**
   * Adds a tag to the schema's manifest.
   */
  tag(tag: string | ManifestBasicInfoWithValue<string>): this {
    return this.tags(tag)
  }

  /**
   * Adds one or more notes to the schema's manifest.
   */
  notes(...notes: (string | ManifestBasicInfoWithValue<string>)[]): this {
    const noteObjects = notes.map(note => (typeof note === 'string' ? { value: note } : note))
    this._updateValidator(v => v.note(...noteObjects.map(note => note.value)))
    this._updateManifest('notes', noteObjects)
    return this
  }
  /**
   * Adds a note to the schema's manifest.
   */
  note(note: string | ManifestBasicInfoWithValue<string>): this {
    return this.notes(note)
  }

  /**
   * Annotates the schema with a unit.
   */
  unit(unit: string): this {
    this._updateValidator(v => v.unit(unit))
    this._updateManifest('unit', unit)
    return this
  }

  /**
   * Marks the schema as deprecated.
   */
  deprecated(deprecated: boolean): this {
    this._updateManifest('deprecated', deprecated)
    return this
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  protected _updateManifest<K extends keyof AnyZManifestObject>(
    key: K,
    value: NonNullable<ZManifestObject<_ZOutput<Def>>[K]>
  ): this {
    mergeWith(this.$_manifest, { [key]: value }, (objValue, srcValue) =>
      isArray(objValue) ? objValue.concat(srcValue) : undefined
    )
    return this
  }
}
