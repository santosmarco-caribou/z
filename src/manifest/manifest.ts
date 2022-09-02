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

export type ManifestFormat =
  | 'alphanumeric'
  | 'data-uri'
  | 'date-time'
  | 'email'
  | 'hexadecimal'
  | 'port'
  | 'uri'
  | 'uuid'

export type ZManifestObject<T> = ManifestBasicInfo & {
  format?: ManifestFormat
  default?: ManifestBasicInfoWithValue<T>
  examples?: ManifestBasicInfoWithValue<T>[]
  tags?: ManifestBasicInfoWithValue<string>[]
  notes?: ManifestBasicInfoWithValue<string>[]
  unit?: string
  deprecated?: boolean
}

export type AnyZManifestObject = ZManifestObject<any>

export class ZManifest<Z extends AnyZ> {
  private constructor(private readonly _z: Z) {}

  get(): ZManifestObject<_ZOutput<Z>> {
    const metas = this._z._validator.$_terms['metas'] as { swagger: ZManifestObject<_ZOutput<Z>> }[]
    if (!metas[0]) metas[0] = { swagger: {} }
    return metas[0].swagger
  }

  set<K extends keyof ZManifestObject<_ZOutput<Z>>>(key: K, value: NonNullable<ZManifestObject<_ZOutput<Z>>[K]>): Z {
    const meta = this.get()
    const prevValue = meta[key]
    merge(this.get(), {
      [key]: Array.isArray(prevValue) ? [...prevValue, ...(Array.isArray(value) ? value : [value])] : value,
    })
    return this._z
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <Z extends AnyZ>(z: Z): ZManifest<Z> => new ZManifest(z)
}
