import { ZType } from '../types'
import { createZIssueMap, ZIssueMap } from './issue'

const ZAnyIssueMap = createZIssueMap(ZType.Any, {
  base: 'should have had passed parsing, but an unknown error has occurred.',
})

const ZArrayIssueMap = createZIssueMap(ZType.Array, {
  base: 'must be an array.',
  'sort.ascending': 'must be sorted in ascending order.',
})

export const GlobalZIssueMap: ZIssueMap = {
  ...ZAnyIssueMap,
  ...ZArrayIssueMap,
} as const

export type GlobalZIssueMap = typeof GlobalZIssueMap
