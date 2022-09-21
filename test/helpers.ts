import type { AnyZ, ZIssue } from '../src'
import { ObjectUtils } from '../src/utils/objects'
import type { TypeUtils } from '../src/utils/types'

export namespace Helpers {
  type HelpersTest =
    | [input: any, pass: true, expected?: any]
    | [
        input: any,
        pass: false,
        expected:
          | TypeUtils.MaybeArray<ZIssue | TypeUtils.ReadonlyDeep<ZIssue>>
          | string
      ]

  export const skip = Symbol('skip')

  export const validate = (z: AnyZ, tests: HelpersTest[]) => {
    tests.forEach(([input, pass, expected]) => {
      const { value, error } = z.safeParse(input)

      if ((pass && error) || (!pass && !error)) {
        console.log({ input, value, error })
      }

      expect(!error).toEqual(pass)

      if (pass) {
        if (!expected) {
          expect(input).toStrictEqual(value)
          return
        }

        if (expected !== skip) {
          expect(expected).toStrictEqual(value)
          return
        }

        return
      }

      if (typeof expected === 'string') {
        expect(error?.message).toEqual(expected)
        return
      }

      if (Array.isArray(expected)) {
        expect(error?.issues).toHaveLength(expected.length)
        expect(error?.message).toEqual(error?.issues[0]?.message)
        expect(error?.issues).toStrictEqual(expected)
      } else {
        expect(error?.message).toEqual(expected.message)
        expect(error?.issues[0]).toStrictEqual(expected)
      }
    })
  }

  export const commonIssues = ObjectUtils.freezeDeep({
    required: () =>
      ({
        code: 'any.required',
        message: '"value" is required',
        path: [],
        received: undefined,
        context: { label: 'value' },
      } as ZIssue),
  })
}
