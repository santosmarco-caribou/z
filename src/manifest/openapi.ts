import j2s from 'joi-to-swagger'
import type { OpenAPIV3 } from 'openapi-types'

import type { AnyZ } from '../z/z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZOpenApi                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZOpenApi<Z extends AnyZ> {
  private constructor(private readonly _z: Z) {}

  generate(): OpenAPIV3.SchemaObject {
    return Object.assign(j2s(this._z._validator).swagger, this._z.manifest)
  }

  static create = <Z extends AnyZ>(z: Z): ZOpenApi<Z> => new ZOpenApi(z)
}
