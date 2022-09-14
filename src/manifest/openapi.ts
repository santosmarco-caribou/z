import j2s, { SwaggerSchema } from 'joi-to-swagger'
import { Merge } from 'type-fest'

import { AnyZDef, ZManifest, ZManifestObject, ZOutput, ZValidator } from '../_internals'

export interface ZOpenApi<Def extends AnyZDef> extends ZManifest<Def>, ZValidator<Def> {}
export class ZOpenApi<Def extends AnyZDef> {
  toOpenApi(): Merge<SwaggerSchema, ZManifestObject<ZOutput<Def>>> {
    console.log(this.manifest)
    return Object.assign(j2s(this._validator).swagger, this.manifest)
  }
}
