import { z } from '.'

const a = z
  .string()
  .or(z.binary())
  .array()
  .min(2, { message: ctx => `${ctx.limit} is awesome!` })
  .max(3)
  .readonly()
type A = z.infer<typeof a>

console.log(a)

const result = a.safeParse(['b'])
console.log(result.error?.issues[0]?.code === '')

const l = z.literal(Symbol('s'))
console.log(l)

const tple = z.tuple([z.string(), z.number(), z.boolean(), z.literal(2).or(z.array(z.true()).length(5))], z.binary())

type AAA = z.infer<typeof tple>

console.log(tple.safeParse(2))
