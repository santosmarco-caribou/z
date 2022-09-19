import type Joi from 'joi'
import { NonNegativeInteger } from 'type-fest'

import {
  type ZCheckOptions,
  type ZHooksObject,
  type ZManifestObject,
  ManifestFormat,
  Z,
  ZJoi,
  ZType,
} from '../_internals'
import { type MaybeArray, capitalize, uncapitalize } from '../utils'

/* -------------------------------------------------------------------------- */
/*                                   ZString                                  */
/* -------------------------------------------------------------------------- */

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
     * By default, the TLD must be a valid name listed on the
     * [IANA registry](http://data.iana.org/TLD/tlds-alpha-by-domain.txt).
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

export type ZStringDataUriOptions = ZCheckOptions<
  'string.dataUri',
  ZStringBase64BaseOptions
>

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
  | 'string.pattern.base'
  | 'string.pattern.name'
  | 'string.pattern.invert.base'
  | 'string.pattern.invert.name',
  {
    name?: string
    invert?: boolean
  }
>

export type ZStringCasingBaseOptions = {
  convert?: boolean
}

export type ZStringLowercaseOptions = ZCheckOptions<
  'string.lowercase',
  ZStringCasingBaseOptions
>
export type ZStringUppercaseOptions = ZCheckOptions<
  'string.uppercase',
  ZStringCasingBaseOptions
>
export type ZStringCapitalizeOptions = ZCheckOptions<
  'string.capitalize',
  ZStringCasingBaseOptions
>
export type ZStringUncapitalizeOptions = ZCheckOptions<
  'string.uncapitalize',
  ZStringCasingBaseOptions
>

/* -------------------------------------------------------------------------- */

export type ZStringOptions = {
  transform:
    | 'lowercase'
    | 'uppercase'
    | 'capitalize'
    | 'uncapitalize'
    | undefined
  convert: boolean
}

type ZStringDef<Opts extends ZStringOptions> = {
  Output: Opts['transform'] extends string
    ? Opts['convert'] extends true
      ? {
          lowercase: `${Lowercase<string>}`
          uppercase: `${Uppercase<string>}`
          capitalize: `${Capitalize<string>}`
          uncapitalize: `${Uncapitalize<string>}`
        }[Opts['transform']]
      : string
    : string
} & {
  Input: string
  Schema: Joi.StringSchema
  Options: Opts
}

export class ZString<
  Opts extends ZStringOptions = {
    transform: undefined
    convert: true
  }
> extends Z<ZStringDef<Opts>> {
  readonly name = ZType.String
  protected readonly _hint = 'string'

  /**
   * Requires the input to only contain `a-z`, `A-Z`, and `0-9`.
   */
  alphanumeric(options?: ZCheckOptions<'string.alphanum'>): this {
    this._addCheck('string.alphanum', v => v.alphanum(), {
      message: options?.message,
    })
    this._updateFormat('alphanumeric')
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
    this._updateFormat('base64')
    return this
  }

  /**
   * Requires the input to be a valid hexadecimal string.
   */
  hexadecimal(options?: ZStringHexadecimalOptions): this {
    this._addCheck('string.hex', v => v.hex(options), {
      message: options?.message,
    })
    this._updateFormat('hexadecimal')
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
    this._updateFormat('ip')
    return this
  }

  /**
   * Requires the input to be a valid RFC 3986 URI string.
   */
  uri(options?: ZStringUriOptions): this {
    this._addCheck('string.uri', v => v.uri(options), {
      message: options?.message,
    })
    this._updateFormat('uri')
    return this
  }
  /**
   * Requires the input to be a valid data URI string.
   */
  dataUri(options?: ZStringDataUriOptions): this {
    this._addCheck('string.dataUri', v => v.dataUri(options), {
      message: options?.message,
    })
    this._updateFormat('data-uri')
    return this
  }

  /**
   * Requires the input to be a valid email address.
   */
  email(options?: ZStringEmailOptions): this {
    this._addCheck('string.email', v => v.email(options), {
      message: options?.message,
    })
    this._updateFormat('email')
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
    this._updateFormat('uuid')
    return this
  }
  /**
   * {@inheritDoc ZString#uuid}
   */
  guid(options?: ZStringUuidOptions): this {
    return this.uuid(options)
  }

  /**
   * Requires the input to be a valid ISO 8601 date.
   */
  isoDate(options?: ZCheckOptions<'string.isoDate'>): this {
    this._addCheck('string.isoDate', v => v.isoDate(), {
      message: options?.message,
    })
    this._updateFormat('date-time')
    return this
  }
  /**
   * Requires the input to be a valid ISO 8601 duration.
   */
  isoDuration(options?: ZCheckOptions<'string.isoDuration'>): this {
    return this._addCheck('string.isoDuration', v => v.isoDuration(), {
      message: options?.message,
    })
  }

  /**
   * Requires the input to be a valid credit card number.
   */
  creditCard(options?: ZCheckOptions<'string.creditCard'>): this {
    return this._addCheck('string.creditCard', v => v.creditCard(), {
      message: options?.message,
    })
  }

  /**
   * Requires the input to have at least a certain number of characters.
   *
   * @param min - The minimum number of characters in the string.
   */
  min<T extends number>(
    min: NonNegativeInteger<T>,
    options?: ZCheckOptions<'string.min'>
  ): this {
    return this._addCheck('string.min', v => v.min(min), {
      message: options?.message,
    })
  }
  /**
   * Requires the input to have at most a certain number of characters.
   *
   * @param max - The maximum number of characters in the string.
   */
  max<T extends number>(
    max: NonNegativeInteger<T>,
    options?: ZCheckOptions<'string.max'>
  ): this {
    return this._addCheck('string.max', v => v.max(max), {
      message: options?.message,
    })
  }
  /**
   * Requires the input to have an exact number of characters.
   *
   * @param length - The length of the string.
   */
  length<L extends number>(
    length: NonNegativeInteger<L>,
    options?: ZCheckOptions<'string.length'>
  ): this {
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
      return this._addCheck(
        'string.pattern.invert.name',
        v => v.pattern(regex, { invert: true }),
        {
          message: options?.message,
        }
      )
    else if (options.name)
      return this._addCheck('string.pattern.name', v => v.pattern(regex), {
        message: options?.message,
      })
    else
      return this._addCheck(
        'string.pattern.invert.base',
        v => v.pattern(regex, { invert: true }),
        {
          message: options?.message,
        }
      )
  }
  /**
   * {@inheritDoc ZString#pattern}
   */
  regex(regex: RegExp, options?: ZStringPatternOptions): this {
    return this.pattern(regex, options)
  }

  /* ------------------------------ Transforms ------------------------------ */

  /**
   * Requires the input to be all lowercase.
   *
   * The schema will attempt to convert the input to the correct format by default.
   * You can disable this behavior by passing `{ convert: false }` as an option.
   *
   * @param {ZStringLowercaseOptions} [options] - Options for this rule.
   */
  lowercase<_Opts extends ZStringLowercaseOptions>(
    options?: _Opts
  ): ZString<{
    transform: 'lowercase'
    convert: _Opts['convert'] extends boolean
      ? _Opts['convert']
      : Opts['convert']
  }> {
    const convert = options?.convert ?? this._props.getOne('options').convert
    this._schema.updatePreferences({ convert: false })

    this._addCheck('string.lowercase', v => v.lowercase(), {
      message: options?.message,
    })

    return new ZString(
      {
        schema: this._schema.get(),
        manifest:
          this._manifest.get() as ZManifestObject<`${Lowercase<string>}`>,
        hooks: this._hooks.get() as ZHooksObject<
          ZStringDef<{
            transform: 'lowercase'
            convert: _Opts['convert'] extends boolean
              ? _Opts['convert']
              : Opts['convert']
          }>
        >,
      },
      { options: { transform: 'lowercase', convert } }
    )
  }

  /**
   * Requires the input to be all uppercase.
   *
   * The schema will attempt to convert the input to the correct format by default.
   * You can disable this behavior by passing `{ convert: false }` as an option.
   *
   * @param {ZStringUppercaseOptions} [options] - Options for this rule.
   */
  uppercase<_Opts extends ZStringUppercaseOptions>(
    options?: _Opts
  ): ZString<{
    transform: 'uppercase'
    convert: _Opts['convert'] extends boolean
      ? _Opts['convert']
      : Opts['convert']
  }> {
    const convert = options?.convert ?? this._props.getOne('options').convert
    this._schema.updatePreferences({ convert: false })

    this._addCheck('string.uppercase', v => v.uppercase(), {
      message: options?.message,
    })

    return new ZString(
      {
        schema: this._schema.get(),
        manifest:
          this._manifest.get() as ZManifestObject<`${Uppercase<string>}`>,
        hooks: this._hooks.get() as ZHooksObject<
          ZStringDef<{
            transform: 'uppercase'
            convert: _Opts['convert'] extends boolean
              ? _Opts['convert']
              : Opts['convert']
          }>
        >,
      },
      { options: { transform: 'uppercase', convert } }
    )
  }

  /**
   * Requires the input to be capitalized.
   *
   * The schema will attempt to convert the input to the correct format by default.
   * You can disable this behavior by passing `{ convert: false }` as an option.
   *
   * @param {ZStringCapitalizeOptions} [options] - Options for this rule.
   */
  capitalize<_Opts extends ZStringCapitalizeOptions>(
    options?: _Opts
  ): ZString<{
    transform: 'capitalize'
    convert: _Opts['convert'] extends boolean
      ? _Opts['convert']
      : Opts['convert']
  }> {
    const convert = options?.convert ?? this._props.getOne('options').convert

    this._addCheck(
      'string.capitalize',
      handleCapitalizeUncapitalizeValidation('capitalize', { convert }),
      { message: options?.message }
    )

    return new ZString(
      {
        schema: this._schema.get(),
        manifest:
          this._manifest.get() as ZManifestObject<`${Capitalize<string>}`>,
        hooks: this._hooks.get() as ZHooksObject<
          ZStringDef<{
            transform: 'capitalize'
            convert: _Opts['convert'] extends boolean
              ? _Opts['convert']
              : Opts['convert']
          }>
        >,
      },
      { options: { transform: 'capitalize', convert } }
    )
  }

  /**
   * Requires the input to be uncapitalized.
   *
   * The schema will attempt to convert the input to the correct format by default.
   * You can disable this behavior by passing `{ convert: false }` as an option.
   *
   * @param {ZStringUncapitalizeOptions} [options] - Options for this rule.
   */
  uncapitalize<_Opts extends ZStringUncapitalizeOptions>(
    options?: _Opts
  ): ZString<{
    transform: 'uncapitalize'
    convert: _Opts['convert'] extends boolean
      ? _Opts['convert']
      : Opts['convert']
  }> {
    const convert = options?.convert ?? this._props.getOne('options').convert

    this._addCheck(
      'string.uncapitalize',
      handleCapitalizeUncapitalizeValidation('uncapitalize', { convert }),
      { message: options?.message }
    )

    return new ZString(
      {
        schema: this._schema.get(),
        manifest:
          this._manifest.get() as ZManifestObject<`${Uncapitalize<string>}`>,
        hooks: this._hooks.get() as ZHooksObject<
          ZStringDef<{
            transform: 'uncapitalize'
            convert: _Opts['convert'] extends boolean
              ? _Opts['convert']
              : Opts['convert']
          }>
        >,
      },
      { options: { transform: 'uncapitalize', convert } }
    )
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

  /* ------------------------------------------------------------------------ */

  private _addFormatToHint(format: ManifestFormat): this {
    this._setHint(`string($${format})`)
    return this
  }

  private _updateFormat(format: ManifestFormat): this {
    this._manifest.update('format', format)
    this._addFormatToHint(format)
    return this
  }

  /* ------------------------------------------------------------------------ */

  static create = (): ZString =>
    new ZString(
      {
        schema: ZJoi.string(),
        manifest: {
          type: 'string',
        },
        hooks: {},
      },
      { options: { transform: undefined, convert: true } }
    )
}

/* ---------------------------------- Utils --------------------------------- */

const handleCapitalizeUncapitalizeValidation =
  <V extends 'capitalize' | 'uncapitalize'>(
    variation: V,
    options: { convert: boolean | undefined }
  ) =>
  (v: Joi.StringSchema): Joi.StringSchema =>
    v
      .custom((value, helpers) => {
        if (typeof value !== 'string') return helpers.error('string.base')
        if (!value.charAt(0).match(/[A-Z]/)) {
          if (options.convert === false)
            return helpers.error(`string.${variation}`)
          if (variation === 'capitalize') return capitalize(value)
          else return uncapitalize(value)
        }
        return value
      })
      .prefs({ convert: options.convert })
