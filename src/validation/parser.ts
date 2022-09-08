import type Joi from 'joi'
import type { O } from 'ts-toolbelt'

import type {
  ParseOptions,
  ParseResult,
  ParseResultFail,
  ParseResultOk,
  ZCheckOptions,
  ZChecksAndValidationMethods,
  ZParsingMethods,
} from '../types'
import { ZObjectUtils } from '../utils'
import type { _ZOutput, _ZValidator, AnyZ } from '../z/z'
import { ZError } from './error'
import { type ZIssueLocalContext, AnyZIssueCode, Z_ISSUE_MAP } from './issue-map'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZParser                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZParserHook = <Z extends AnyZ>(input: _ZOutput<Z>) => _ZOutput<Z>

export type ZParserHooks = {
  beforeParse: ZParserHook[]
  afterParse: ZParserHook[]
}

export class ZParser<Z extends AnyZ = AnyZ> implements ZParsingMethods<Z>, ZChecksAndValidationMethods<Z> {
  private static readonly _DEFAULT_PARSE_OPTIONS: Joi.ValidationOptions &
    O.Required<ParseOptions, PropertyKey, 'deep'> = { abortEarly: false, messages: Z_ISSUE_MAP }

  private readonly _hooks: ZParserHooks = {
    beforeParse: [],
    afterParse: [],
  }

  private constructor(private readonly _z: Z) {}

  /* ---------------------------------------------------- Parsing --------------------------------------------------- */

  /**
   * If you don't want `Z` to throw errors when validation fails, use `.safeParse()`.
   * This method returns an object containing either the successfully parsed data
   * or a `ZError` instance containing detailed information about the validation problems.
   *
   * @example The result is a discriminated union so you can handle errors very conveniently:
   * ```ts
   * const result = stringSchema.safeParse("Billy");
   * if (!result.ok) {
   *   // handle error then return
   *   result.error;
   * } else {
   *   // do something
   *   result.value;
   * }
   * ```
   */
  safeParse(input: unknown, options: ParseOptions | undefined): ParseResult<Z> {
    const { error, value } = this._validate(input, options)
    if (error) return this._FAIL(error)
    else return this._OK(value)
  }

  /**
   * Given any `ZType`, you can call its `.parse()` method to check data is valid.
   * If it is, a value is returned with full type information!
   * Otherwise, an error is thrown.
   *
   * <blockquote>
   *   **IMPORTANT:** The value returned by `.parse()` is a _deep clone_ of the variable you passed in.
   * </blockquote>
   */
  parse(input: unknown, options: ParseOptions | undefined): _ZOutput<Z> {
    const { error, value } = this._validate(input, options)
    if (error) throw ZError.create(this._z, error)
    else return value
  }

  /**
   * Same as `.parse()` but runs asynchronously.
   */
  parseAsync(input: unknown, options: ParseOptions | undefined): Promise<_ZOutput<Z>> {
    return new Promise((resolve, reject) => {
      const { error, value } = this._validate(input, options)
      if (error) reject(ZError.create(this._z, error))
      else resolve(value)
    })
  }

  isValid(input: unknown, options: ParseOptions | undefined): input is _ZOutput<Z> {
    return !this._validate(input, options).error
  }

  /* ---------------------------------------------------- Checks ---------------------------------------------------- */

  addCheck(fn: (validator: _ZValidator<Z>) => _ZValidator<Z>): Z
  addCheck<IssueCode extends AnyZIssueCode>(
    issue: IssueCode,
    fn: (validator: _ZValidator<Z>) => _ZValidator<Z>,
    options: ZCheckOptions<IssueCode> | undefined
  ): Z
  addCheck<IssueCode extends AnyZIssueCode>(
    fnOrIssue: ((validator: _ZValidator<Z>) => _ZValidator<Z>) | IssueCode,
    fn?: (validator: _ZValidator<Z>) => _ZValidator<Z>,
    options?: ZCheckOptions<IssueCode> | undefined
  ): Z {
    if (typeof fnOrIssue === 'function') {
      this._z._validator = fnOrIssue(this._z._validator)
      return this._z
    }

    this._z._validator = fn?.(this._z._validator) ?? this._z._validator

    if (options?.message) {
      const ctxTags = [
        ...[...Z_ISSUE_MAP[fnOrIssue].matchAll(/{{#[^}]*}}/g)].map(m => m[0]?.slice(3, -2)),
        'key',
        'value',
      ] as ZIssueLocalContext<IssueCode, { Extras: true }>[keyof ZIssueLocalContext<IssueCode, { Extras: true }>][]

      const msgStr =
        typeof options.message === 'string'
          ? options.message
          : options.message(
              Object.fromEntries(
                ctxTags.map(tag => [tag, `{{#${tag as unknown as string}}}`])
              ) as unknown as ZIssueLocalContext<IssueCode, { Extras: true }>
            )

      this._z._validator = this._z._validator.message(msgStr)
    }

    return this._z
  }

  /* ----------------------------------------------------- Hooks ---------------------------------------------------- */

  addBeforeParseHook(hook: ZParserHook): Z {
    this._hooks.beforeParse.push(hook)
    return this._z
  }

  addAfterParseHook(hook: ZParserHook): Z {
    this._hooks.afterParse.push(hook)
    return this._z
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private _validate(input: unknown, options: ParseOptions | undefined): Joi.ValidationResult<_ZOutput<Z>> {
    this._hooks.beforeParse.forEach(hook => (input = hook(input)))
    const validationResult = this._z._validator.validate(
      input,
      ZObjectUtils.mergeSafe(ZParser._DEFAULT_PARSE_OPTIONS, options)
    )
    this._hooks.afterParse.forEach(hook => (validationResult.value = hook(validationResult.value)))
    return validationResult
  }

  private _OK(value: _ZOutput<Z>): ParseResultOk<Z> {
    return { ok: true, value, error: null }
  }

  private _FAIL(joiError: Joi.ValidationError): ParseResultFail<Z> {
    return { ok: false, error: ZError.create(this._z, joiError).toPlainObject(), value: null }
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <Z extends AnyZ>(z: Z): ZParser<Z> => new ZParser(z)
}
