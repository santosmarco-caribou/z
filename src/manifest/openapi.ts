import j2s from 'joi-to-swagger'
import { includes } from 'lodash'
import type { SchemaObject } from 'openapi3-ts'
import type { Merge } from 'type-fest'

import type {
  _ZOutput,
  AnyZManifestObject,
  BaseZ,
  ZDef,
  ZManifestObject,
} from '../_internals'
import { mergeSafe } from '../utils'

/* -------------------------------------------------------------------------- */
/*                                  ZOpenApi                                  */
/* -------------------------------------------------------------------------- */

const OPEN_API_PROPERTIES: Extract<
  keyof AnyZManifestObject,
  keyof SchemaObject
>[] = [
  'title',
  'description',
  'type',
  'default',
  'format',
  'examples',
  'deprecated',
  'minimum',
  'maximum',
  'multipleOf',
]

export interface ZOpenApi<Def extends ZDef> extends BaseZ<Def> {}
export class ZOpenApi<Def extends ZDef> {
  toOpenApi(): Merge<ZManifestObject<_ZOutput<Def>>, SchemaObject> {
    return mergeSafe(
      Object.fromEntries(
        Object.entries(this._manifest.get()).map(([k, v]) =>
          includes(OPEN_API_PROPERTIES, k) ? [k, v] : [`x-${k}`, v]
        )
      ),
      j2s(this._schema.get()).swagger
    )
  }
}
