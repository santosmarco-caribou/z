import { merge } from 'lodash'

import type { AnyZ, ZOutput } from './z/z'

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
}

export type AnyZManifestObject = ZManifestObject<any>

export class ZManifest<Z extends AnyZ> {
  private constructor(private readonly _z: Z) {}

  get(): ZManifestObject<ZOutput<Z>> {
    if (!this._z._validator.$_terms['metas'][0]) {
      this._z._validator = this._z._validator.meta({})
    }
    return this._z._validator.$_terms['metas'][0]
  }

  set<K extends keyof AnyZManifestObject>(key: K, value: NonNullable<ZManifestObject<ZOutput<Z>>[K]>): Z {
    const prevValue = this.get()[key]
    this._z._validator.$_terms['metas'][0] = merge(this.get(), {
      [key]: Array.isArray(prevValue) ? [...prevValue, ...(Array.isArray(value) ? value : [value])] : value,
    })
    return this._z
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <Z extends AnyZ>(z: Z): ZManifest<Z> => {
    return new ZManifest(z)
  }
}
