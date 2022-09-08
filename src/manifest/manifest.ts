import type { ZManifestObject } from '../types'
import { ZObjectUtils } from '../utils'
import type { _ZOutput, AnyZ } from '../z/z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZManifest                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZManifest<Z extends AnyZ> {
  private constructor(private readonly _z: Z) {}

  get(): ZManifestObject<_ZOutput<Z>> {
    const metas = this._z._validator.$_terms['metas'] as { swagger: ZManifestObject<_ZOutput<Z>> }[]
    if (!metas[0]) metas[0] = { swagger: {} }
    return metas[0].swagger
  }

  setKey<K extends keyof ZManifestObject<_ZOutput<Z>>>(key: K, value: NonNullable<ZManifestObject<_ZOutput<Z>>[K]>): Z {
    const meta = this.get()
    const prevValue = meta[key]
    ZObjectUtils.merge(this.get(), {
      [key]: Array.isArray(prevValue) ? [...prevValue, ...(Array.isArray(value) ? value : [value])] : value,
    })
    return this._z
  }

  copyAndReturn<Z extends AnyZ>(receiving: Z): Z {
    ZObjectUtils.merge(receiving.manifest, this.get())
    return receiving
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <Z extends AnyZ>(z: Z): ZManifest<Z> => new ZManifest(z)
}
