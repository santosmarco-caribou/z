import { merge } from 'lodash'

import type { _ZOutput, AnyZ } from '../z/z'

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

export type ZManifestObject<T> = ManifestBasicInfo & {
  default?: ManifestBasicInfoWithValue<T>
  examples?: ManifestBasicInfoWithValue<T>[]
  tags?: ManifestBasicInfoWithValue<string>[]
  notes?: ManifestBasicInfoWithValue<string>[]
  unit?: string
  deprecated?: boolean
  /* ---------------------------------------------------- OpenAPI --------------------------------------------------- */
  // Strings
  minLength?: number
  maxLength?: number
  pattern?: string
  // Numbers
  minimum?: number
  exclusiveMinimum?: number
  maximum?: number
  exclusiveMaximum?: number
  multipleOf?: number
}

export type AnyZManifestObject = ZManifestObject<any>

export class ZManifest<Z extends AnyZ> {
  private constructor(private readonly _z: Z) {}

  get(): ZManifestObject<_ZOutput<Z>> {
    const metas = this._z._validator.$_terms['metas'] as ZManifestObject<_ZOutput<Z>>[]
    if (!metas[0]) metas[0] = {}
    return metas[0]
  }

  set<K extends keyof AnyZManifestObject>(key: K, value: NonNullable<ZManifestObject<_ZOutput<Z>>[K]>): Z {
    let meta = this.get()
    const prevValue = meta[key]
    meta = merge(meta, {
      [key]: Array.isArray(prevValue) ? [...prevValue, ...(Array.isArray(value) ? value : [value])] : value,
    })
    return this._z
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <Z extends AnyZ>(z: Z): ZManifest<Z> => new ZManifest(z)
}
