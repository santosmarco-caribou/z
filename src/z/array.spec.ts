import { z } from '../index'
import { assertEqual } from '../utils'

const minTwo = z.string().array().min(2)
const maxTwo = z.string().array().max(2)
const justTwo = z.string().array().length(2)
const intNum = z.string().array().nonempty()
const nonEmptyMax = z.string().array().nonempty().max(2)
const ascending = z.number().array().ascending()
const ascendingStrict = z.number().array().ascending({ strict: true })
const descending = z.number().array().descending()
const descendingStrict = z.number().array().descending({ strict: true })

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
  ascending.parse([2, 1])
  ascendingStrict.parse([1, 2])
  descending.parse([1, 2])
  descendingStrict.parse([2, 1])
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
  expect(() => ascendingStrict.parse([2, 1])).toThrowError(
    '"value" must be sorted in ascending order by value'
  )
  expect(() => descendingStrict.parse([1, 2])).toThrowError(
    '"value" must be sorted in descending order by value'
  )
})

describe('.element', () => {
  it('works', () => {
    justTwo.element.parse('a')
    expect(() => justTwo.element.parse(1)).toThrow()
  })
})
