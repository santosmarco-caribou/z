import j2s, { type SwaggerSchema } from 'joi-to-swagger'
import type { Merge } from 'type-fest'

import type { _ZOutput, BaseZ, ZDef, ZManifestObject } from '../_internals'
import { mergeSafe } from '../utils'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ZOpenApi<Def extends ZDef> extends BaseZ<Def> {}
export class ZOpenApi<Def extends ZDef> {
  toOpenApi(): Merge<SwaggerSchema, ZManifestObject<_ZOutput<Def>>> {
    return mergeSafe(
      Object.fromEntries(Object.entries(this.$_manifest).map(([k, v]) => [`x-${k}`, v])),
      j2s(this.$_schema).swagger
    )
  }
}
