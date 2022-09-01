import type { OpenAPIV3 } from 'openapi-types'

import type { AnyZ } from '../z/z'

export class ZOpenApi<Z extends AnyZ> {
  private constructor(private readonly _z: Z) {}

  generateV3(): OpenAPIV3.SchemaObject {
    return {}
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <Z extends AnyZ>(z: Z): ZOpenApi<Z> => new ZOpenApi(z)
}
