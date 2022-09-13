import type { N } from 'ts-toolbelt'

import { z } from '.'

console.log(z.string().uri())

const a = z.array(z.string()).length(2)
console.log(a)
type A = z.infer<typeof a>

const b: A = ['s', 'c', 's']

type C = N.Greater<1, 2>

const d = z.array(z.string().or(z.boolean())).min(2)
const e = z.array(z.string().or(z.true()).or(z.nan()).or(z.false())).max(10)
const f = z.array(z.string()).length(100)
const g = z.array(z.string()).nonempty()

console.log(d.hint, e.hint, f.hint, g.hint)
type D = z.infer<typeof e>
console.log(e.element())
