import type Joi from 'joi'

import { type ZCheckOptions, Z, ZJoi, ZType } from '../_internals'
import type { MaybeArray } from '../utils'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZString                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZStringBase64BaseOptions = {
  paddingRequired?: boolean
}

export type ZStringDomainTldsOptions = {
  allow?: string[] | boolean
  deny?: string[]
}

export type ZStringBase64Options = ZCheckOptions<
  'string.base64',
  ZStringBase64BaseOptions & {
    urlSafe?: boolean
  }
>

export type ZStringHexadecimalOptions = ZCheckOptions<
  'string.hex',
  {
    /**
     * Whether to require the input to be byte aligned.
     *
     * @default false
     */
    byteAligned?: boolean
  }
>

export type ZStringDomainOptions = ZCheckOptions<
  'string.domain',
  {
    /**
     * Whether to allow domains ending with a `.` character.
     *
     * @default false
     */
    allowFullyQualified?: boolean
    /**
     * Whether to allow Unicode characters.
     *
     * @default true
     */
    allowUnicode?: boolean
    /**
     * Minimum number of segments required for the domain.
     *
     * @default 2
     */
    minDomainSegments?: number
    /**
     * Options for TLD (top-level domain) validation.
     * By default, the TLD must be a valid name listed on the [IANA registry](http://data.iana.org/TLD/tlds-alpha-by-domain.txt).
     *
     * @default { allow: true }
     */
    tlds?: ZStringDomainTldsOptions | false
  }
>

export type ZStringIpOptions = ZCheckOptions<
  'string.ip',
  {
    version?: MaybeArray<'ipv4' | 'ipv6' | 'ipvfuture'>
    cidr?: 'optional' | 'required' | 'forbidden'
  }
>

export type ZStringUriOptions = ZCheckOptions<
  'string.uri',
  {
    allowQuerySquareBrackets?: boolean
    allowRelative?: boolean
    domain?: ZStringDomainOptions
    relativeOnly?: boolean
    scheme?: MaybeArray<string | RegExp>
  }
>

export type ZStringDataUriOptions = ZCheckOptions<'string.dataUri', ZStringBase64BaseOptions>

export type ZStringEmailOptions = ZCheckOptions<
  'string.email',
  ZStringDomainOptions & {
    ignoreLength?: boolean
    multiple?: boolean
    separator?: MaybeArray<string>
  }
>

export type ZStringUuidOptions = ZCheckOptions<
  'string.guid',
  {
    version?: MaybeArray<'uuidv1' | 'uuidv2' | 'uuidv3' | 'uuidv4' | 'uuidv5'>
    separator?: '-' | ':' | boolean
  }
>

export type ZStringPatternOptions = ZCheckOptions<
  'string.pattern.base' | 'string.pattern.name' | 'string.pattern.invert.base' | 'string.pattern.invert.name',
  {
    name?: string
    invert?: boolean
  }
>

/* ------------------------------------------------------------------------------------------------------------------ */

export class ZString extends Z<{
  Output: string
  Input: string
  Schema: Joi.StringSchema
}> {
  readonly name = ZType.String
  protected readonly _hint = 'string'

  /**
   * Requires the input to only contain `a-z`, `A-Z`, and `0-9`.
   */
  alphanumeric(options?: ZCheckOptions<'string.alphanum'>): this {
    this._addCheck('string.alphanum', v => v.alphanum(), {
      message: options?.message,
    })
    this._updateManifest('format', 'alphanumeric')
    return this
  }
  /**
   * {@inheritDoc ZString#alphanumeric}
   */
  alphanum(options?: ZCheckOptions<'string.alphanum'>): this {
    return this.alphanumeric(options)
  }

  /**
   * Requires the input to be a valid `base64` string.
   */
  base64(options?: ZStringBase64Options): this {
    this._addCheck('string.base64', v => v.base64(options), {
      message: options?.message,
    })
    this._updateManifest('format', 'base64')
    return this
  }

  /**
   * Requires the input to be a valid hexadecimal string.
   */
  hexadecimal(options?: ZStringHexadecimalOptions): this {
    this._addCheck('string.hex', v => v.hex(options), {
      message: options?.message,
    })
    this._updateManifest('format', 'hexadecimal')
    return this
  }
  /**
   * {@inheritDoc ZString#hexadecimal}
   */
  hex(options?: ZStringHexadecimalOptions): this {
    return this.hexadecimal(options)
  }

  /**
   * Requires the input to be a valid domain string.
   */
  domain(options?: ZStringDomainOptions): this {
    return this._addCheck('string.domain', v => v.domain(options), {
      message: options?.message,
    })
  }

  /**
   * Requires the input to be a valid hostname string as per RFC1123.
   */
  hostname(options?: ZCheckOptions<'string.hostname'>): this {
    return this._addCheck('string.hostname', v => v.hostname(), {
      message: options?.message,
    })
  }

  /**
   * Requires the input to be a valid IP address.
   */
  ip(options?: ZStringIpOptions): this {
    this._addCheck('string.ip', v => v.ip(options), {
      message: options?.message,
    })
    this._updateManifest('format', 'ip')
    return this
  }

  /**
   * Requires the input to be a valid RFC 3986 URI string.
   */
  uri(options?: ZStringUriOptions): this {
    this._addCheck('string.uri', v => v.uri(options), {
      message: options?.message,
    })
    this._updateManifest('format', 'uri')
    return this
  }

  /**
   * Requires the input to be a valid data URI string.
   */
  dataUri(options?: ZStringDataUriOptions): this {
    this._addCheck('string.dataUri', v => v.dataUri(options), {
      message: options?.message,
    })
    this._updateManifest('format', 'data-uri')
    return this
  }

  /**
   * Requires the input to be a valid email address.
   */
  email(options?: ZStringEmailOptions): this {
    this._addCheck('string.email', v => v.email(options), {
      message: options?.message,
    })
    this._updateManifest('format', 'email')
    return this
  }

  /**
   * Requires the input to be a valid UUID/GUID.
   *
   * @param options - Rule options
   */
  uuid(options?: ZStringUuidOptions): this {
    this._addCheck('string.guid', v => v.uuid(options), {
      message: options?.message,
    })
    this._updateManifest('format', 'uuid')
    return this
  }
  /**
   * {@inheritDoc ZString#uuid}
   */
  guid(options?: ZStringUuidOptions): this {
    return this.uuid(options)
  }

  isoDate(options?: ZCheckOptions<'string.isoDate'>): this {
    this._addCheck('string.isoDate', v => v.isoDate(), {
      message: options?.message,
    })
    this._updateManifest('format', 'date-time')
    return this
  }

  isoDuration(options?: ZCheckOptions<'string.isoDuration'>): this {
    return this._addCheck('string.isoDuration', v => v.isoDuration(), {
      message: options?.message,
    })
  }

  creditCard(options?: ZCheckOptions<'string.creditCard'>): this {
    return this._addCheck('string.creditCard', v => v.creditCard(), {
      message: options?.message,
    })
  }

  min(min: number, options?: ZCheckOptions<'string.min'>): this {
    return this._addCheck('string.min', v => v.min(min), {
      message: options?.message,
    })
  }

  max(max: number, options?: ZCheckOptions<'string.max'>): this {
    return this._addCheck('string.max', v => v.max(max), {
      message: options?.message,
    })
  }

  length(length: number, options?: ZCheckOptions<'string.length'>): this {
    return this._addCheck('string.length', v => v.length(length), {
      message: options?.message,
    })
  }

  /**
   * Requires the input to match a certain pattern.
   *
   * @param regex - The regular expression against which to match the string.
   * @param options - Rule options
   */
  pattern(regex: RegExp, options?: ZStringPatternOptions): this {
    if (!options || (!options.invert && !options.name))
      return this._addCheck('string.pattern.base', v => v.pattern(regex), {
        message: options?.message,
      })
    else if (options.name && options.invert)
      return this._addCheck('string.pattern.invert.name', v => v.pattern(regex, { invert: true }), {
        message: options?.message,
      })
    else if (options.name)
      return this._addCheck('string.pattern.name', v => v.pattern(regex), {
        message: options?.message,
      })
    else
      return this._addCheck('string.pattern.invert.base', v => v.pattern(regex, { invert: true }), {
        message: options?.message,
      })
  }
  /**
   * {@inheritDoc ZString#pattern}
   */
  regex(regex: RegExp, options?: ZStringPatternOptions): this {
    return this.pattern(regex, options)
  }

  /* -------------------------------------------------- Transforms -------------------------------------------------- */

  lowercase(options?: ZCheckOptions<'string.lowercase'>): this {
    return this._addCheck('string.lowercase', v => v.lowercase(), {
      message: options?.message,
    })
  }

  uppercase(options?: ZCheckOptions<'string.uppercase'>): this {
    return this._addCheck('string.uppercase', v => v.uppercase(), {
      message: options?.message,
    })
  }

  insensitive(): this {
    return this._addCheck(v => v.insensitive())
  }

  trim(options?: ZCheckOptions<'string.trim'>): this {
    return this._addCheck('string.trim', v => v.trim(), {
      message: options?.message,
    })
  }

  replace(pattern: string | RegExp, replacement: string): this {
    return this._addCheck(v => v.replace(pattern, replacement))
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = (): ZString =>
    new ZString(
      {
        schema: ZJoi.string(),
        manifest: {
          type: 'string',
        },
        hooks: {},
      },
      {}
    )
}
