import Joi from 'joi'

import type { ZDef } from '../def'
import { ZType } from '../type'
import type { ZUtils } from '../utils'
import { Z } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZString                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZStringDomainTldsOptions = {
  allow?: string[] | boolean
  deny?: string[]
}

export type ZStringDomainOptions = {
  allowFullyQualified?: boolean
  allowUnicode?: boolean
  minDomainSegments?: number
  tlds?: ZStringDomainTldsOptions | false
}

export type ZStringIpOptions = {
  version?: ZUtils.MaybeArray<'ipv4' | 'ipv6' | 'ipvfuture'>
  cidr?: 'optional' | 'required' | 'forbidden'
}

export type ZStringUriOptions = {
  allowQuerySquareBrackets?: boolean
  allowRelative?: boolean
  domain?: ZStringDomainOptions
  relativeOnly?: boolean
  scheme?: ZUtils.MaybeArray<string | RegExp>
}

export type ZStringEmailOptions = ZStringDomainOptions & {
  ignoreLength?: boolean
  multiple?: boolean
  separator?: ZUtils.MaybeArray<string>
}

export type ZStringUuidOptions = {
  version?: ZUtils.MaybeArray<'uuidv1' | 'uuidv2' | 'uuidv3' | 'uuidv4' | 'uuidv5'>
  separator?: '-' | ':' | boolean
}

export type ZStringPatternOptions = {
  name?: string
  invert?: boolean
}

/* ------------------------------------------------------------------------------------------------------------------ */

export type ZStringDef = ZDef<{ type: ZType.String; validator: Joi.StringSchema }>

export class ZString extends Z<string, ZStringDef> {
  readonly name = 'string'

  /**
   * Requires the string to only contain `a-z`, `A-Z`, and `0-9`.
   */
  alphanumeric(): this {
    return this._parser.addCheck(v => v.alphanum())
  }
  /**
   * {@inheritDoc ZString#alphanumeric}
   */
  alphanum(): this {
    return this.alphanumeric()
  }

  /**
   * Requires the string to be a valid `base64` string.
   */
  base64(): this {
    return this._parser.addCheck(v => v.base64())
  }

  /**
   * Requires the string to be a valid hexadecimal string.
   */
  hexadecimal(): this {
    return this._parser.addCheck(v => v.hex())
  }
  /**
   * {@inheritDoc ZString#hexadecimal}
   */
  hex(): this {
    return this.hexadecimal()
  }

  domain(options?: ZStringDomainOptions): this {
    return this._parser.addCheck(v => v.domain(options))
  }

  hostname(): this {
    return this._parser.addCheck(v => v.hostname())
  }

  ip(options?: ZStringIpOptions): this {
    return this._parser.addCheck(v => v.ip(options))
  }

  uri(options?: ZStringUriOptions): this {
    return this._parser.addCheck(v => v.uri(options))
  }

  dataUri(): this {
    return this._parser.addCheck(v => v.dataUri())
  }

  email(options?: ZStringEmailOptions): this {
    return this._parser.addCheck(v => v.email(options))
  }

  /**
   * Requires the string to be a valid UUID/GUID.
   *
   * @param {ZStringUuidOptions} [options]
   */
  uuid(options?: ZStringUuidOptions): this {
    return this._parser.addCheck(v => v.uuid(options))
  }
  /**
   * {@inheritDoc ZString#uuid}
   */
  guid(options?: ZStringUuidOptions): this {
    return this.uuid(options)
  }

  isoDate(): this {
    return this._parser.addCheck(v => v.isoDate())
  }

  isoDuration(): this {
    return this._parser.addCheck(v => v.isoDuration())
  }

  creditCard(): this {
    return this._parser.addCheck(v => v.creditCard())
  }

  min(min: number): this {
    return this._parser.addCheck(v => v.min(min))
  }

  max(max: number): this {
    return this._parser.addCheck(v => v.max(max))
  }

  length(length: number): this {
    return this._parser.addCheck(v => v.length(length))
  }

  /**
   * Requires the string to match a certain pattern.
   *
   * @param {RegExp} regex The regular expression against which to match the string.
   * @param {ZStringPatternOptions} [options]
   */
  pattern(regex: RegExp, options?: ZStringPatternOptions): this {
    return this._parser.addCheck(v => v.pattern(regex, options))
  }
  /**
   * {@inheritDoc ZString#pattern}
   */
  regex(regex: RegExp, options?: ZStringPatternOptions): this {
    return this.pattern(regex, options)
  }

  /* -------------------------------------------------- Transforms -------------------------------------------------- */

  lowercase(): this {
    return this._parser.addCheck(v => v.lowercase())
  }

  uppercase(): this {
    return this._parser.addCheck(v => v.uppercase())
  }

  insensitive(): this {
    return this._parser.addCheck(v => v.insensitive())
  }

  trim(): this {
    return this._parser.addCheck(v => v.trim())
  }

  replace(pattern: string | RegExp, replacement: string): this {
    return this._parser.addCheck(v => v.replace(pattern, replacement))
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = (): ZString => {
    return new ZString({
      type: ZType.String,
      validator: Joi.string().required(),
    })
  }
}
