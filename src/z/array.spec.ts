import { z } from '../index'
import { assertEqual } from '../utils'

const minTwo = z.string().array().min(2)
const maxTwo = z.string().array().max(2)
const justTwo = z.string().array().length(2)
const intNum = z.string().array().nonempty()
const nonEmptyMax = z.string().array().nonempty().max(2)

type t1 = z.infer<typeof minTwo>
assertEqual<string[], t1>(true)

type t3 = z.infer<typeof justTwo>
assertEqual<readonly [string, string], t3>(true)

type t2 = z.infer<typeof nonEmptyMax>
assertEqual<[string, ...string[]], t2>(true)

it('parses valid inputs', () => {
  minTwo.parse(['a', 'a'])
  minTwo.parse(['a', 'a', 'a'])
  maxTwo.parse(['a', 'a'])
  maxTwo.parse(['a'])
  justTwo.parse(['a', 'a'])
  intNum.parse(['a'])
  nonEmptyMax.parse(['a'])
})

it('does not parse invalid inputs', () => {
  expect(() => minTwo.parse(['a'])).toThrowError(
    '"value" must contain at least 2 items'
  )
  expect(() => maxTwo.parse(['a', 'a', 'a'])).toThrowError(
    '"value" must contain at most 2 items'
  )
  expect(() => justTwo.parse(['a'])).toThrowError(
    '"value" must contain exactly 2 items'
  )
  expect(() => justTwo.parse(['a', 'a', 'a'])).toThrowError(
    '"value" must contain exactly 2 items'
  )
  expect(() => intNum.parse([])).toThrowError(
    '"value" does not contain 1 required value'
  )
  expect(() => nonEmptyMax.parse([])).toThrowError(
    '"value" does not contain 1 required value'
  )
  expect(() => nonEmptyMax.parse(['a', 'a', 'a'])).toThrowError(
    '"value" must contain at most 2 items'
  )
})

describe('.element', () => {
  it('works', () => {
    justTwo.element.parse('a')
    expect(() => justTwo.element.parse(1)).toThrow()
  })
})
