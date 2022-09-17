import j2s, { SwaggerSchema } from 'joi-to-swagger'
import { Merge } from 'type-fest'

import { _ZOutput, ZDef, ZManifest, ZManifestObject, ZValidator } from '../_internals'

export interface ZOpenApi<Def extends ZDef> extends ZManifest<Def>, ZValidator<Def> {}
export class ZOpenApi<Def extends ZDef> {
  toOpenApi(): Merge<SwaggerSchema, ZManifestObject<_ZOutput<Def>>> {
    console.log(this.manifest)
    return Object.assign(j2s(this.$_schema).swagger, this.manifest)
  }
}
