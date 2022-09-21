import type { ZDef, ZManifestObject } from '../_internals'

/* -------------------------------------------------------------------------- */
/*                              ZManifestManager                              */
/* -------------------------------------------------------------------------- */

export interface ZManifestManager<Def extends ZDef> {
  get(): ZManifestObject<Def['Output']>
  update<K extends keyof ZManifestObject<Def['Output']>>(
    key: K,
    value: ZManifestObject<Def['Output']>[K]
  ): this
}

export const ZManifestManager = <Def extends ZDef>(
  manifest: ZManifestObject<Def['Output']>
): ZManifestManager<Def> => {
  const $_manifest = manifest

  return {
    get(): ZManifestObject<Def['Output']> {
      return $_manifest
    },
    update<K extends keyof ZManifestObject<Def['Output']>>(
      key: K,
      value: ZManifestObject<Def['Output']>[K]
    ) {
      $_manifest[key] = value
      return this
    },
  }
}
