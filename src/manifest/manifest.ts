import { merge } from 'lodash'
import type { O } from 'ts-toolbelt'

import type { AnyZDef, BaseZ, ZInput, ZOutput, ZValidator } from '../_internals'
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

export type ManifestFormat =
  | 'alphanumeric'
  | 'data-uri'
  | 'date-time'
  | 'email'
  | 'hexadecimal'
  | 'port'
  | 'uri'
  | 'uuid'

/* ------------------------------------------------- ZManifestObject ------------------------------------------------ */

export type ZManifestObject<T> = ManifestBasicInfo & {
  label?: string
  format?: ManifestFormat
  default?: ManifestBasicInfoWithValue<T>
  examples?: ManifestBasicInfoWithValue<T>[]
  tags?: ManifestBasicInfoWithValue<string>[]
  notes?: ManifestBasicInfoWithValue<string>[]
  unit?: string
  deprecated?: boolean
}

export type AnyZManifestObject = ZManifestObject<any>

export type ZManifestsObject<Def extends AnyZDef> = {
  output: ZManifestObject<ZOutput<Def>>
  input: ZManifestObject<ZInput<Def>>
}

/* ------------------------------------------------------------------------------------------------------------------ */

export interface ZManifest<Def extends AnyZDef> extends BaseZ<Def>, ZValidator<Def> {}

export class ZManifest<Def extends AnyZDef> {
  private _manifests: ZManifestsObject<Def> = {
    output: {},
    input: {},
  }

  protected _init(): void {
    this._prepareManifests()
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  get manifest(): O.Readonly<ZManifestsObject<Def>['output'], 'deep'> {
    return this._manifests.output
  }

  /**
   * Overrides the key name in error messages.
   *
   * @param label - The name of the key.
   */
  label(label: string): this {
    this._updateValidator(v => v.label(label))
    this._updateManifest('output', 'label', label)
    return this
  }

  /**
   * Annotates the schema with a title.
   *
   * @param title - The schema's title.
   */
  title(title: string): this {
    this._updateManifest('output', 'title', title)
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
    this._updateManifest('output', 'summary', summary)
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
    this._updateManifest('output', 'description', description)
    return this
  }

  /**
   * Annotates the schema with a default value.
   */
  default(value: ZOutput<Def> | ManifestBasicInfoWithValue<ZOutput<Def>>): this {
    this._updateManifest('output', 'default', hasProp(value, 'value') ? value : { value: value })
    return this
  }

  /**
   * Adds one or more examples to the schema's manifest.
   */
  examples(...examples: Array<ZOutput<Def> | ManifestBasicInfoWithValue<ZOutput<Def>>>): this {
    const exampleObjects = examples.map((example): { value: any } =>
      hasProp(example, 'value') ? example : { value: example }
    )
    this._updateValidator(v => v.example(exampleObjects.map(example => example.value)))
    this._updateManifest('output', 'examples', exampleObjects)
    return this
  }
  /**
   * Adds an example to the schema's manifest.
   */
  example(example: ZOutput<Def> | ManifestBasicInfoWithValue<ZOutput<Def>>): this {
    return this.examples(example)
  }

  /**
   * Adds one or more tags to the schema's manifest.
   */
  tags(...tags: (string | ManifestBasicInfoWithValue<string>)[]): this {
    const tagObjects = tags.map(tag => (typeof tag === 'string' ? { value: tag } : tag))
    this._updateValidator(v => v.tag(...tagObjects.map(tag => tag.value)))
    this._updateManifest('output', 'tags', tagObjects)
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
    this._updateManifest('output', 'notes', noteObjects)
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
    this._updateManifest('output', 'unit', unit)
    return this
  }

  /**
   * Marks the schema as deprecated.
   */
  deprecated(deprecated: boolean): this {
    this._updateManifest('output', 'deprecated', deprecated)
    return this
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  protected _updateManifest<T extends 'output' | 'input', K extends keyof AnyZManifestObject>(
    type: T,
    key: K,
    value: NonNullable<ZManifestObject<T extends 'output' ? ZOutput<Def> : ZInput<Def>>[K]>
  ): this {
    const prevValue = this._manifests[type][key]
    merge(this._manifests[type], {
      [key]: isArray(value) ? [...(isArray(prevValue) ? prevValue : []), ...value] : value,
    })
    return this
  }

  private _prepareManifests(): void {
    const metaObjs = this._validator.$_terms['metas'] as Array<{ swagger: ZManifestObject<ZOutput<Def>> }>
    if (!metaObjs[0]) metaObjs[0] = { swagger: {} } // Output manifest
    if (!metaObjs[1]) metaObjs[1] = { swagger: {} } // Input manifest
    this._manifests = { output: metaObjs[0].swagger, input: metaObjs[1].swagger }
  }
}
