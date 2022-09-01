import util from 'util'
import z from './index'

const exampleSchema = z.object({
  name: z.string().title('Name').summary("The user's name").description('The full name of the user'),
  age: z.number().int().positive().examples({ value: 18 }).tags('age', 'user').tags('s').or(z.enum('a', 'b')),
  fn: z.function().arguments([z.string(), z.number(), z.literal(false)]),
  a: z.object({
    b: z.object({
      c: z.undefined(),
    }),
  }),
})

// console.log(JSON.stringify(exampleSchema._validator.describe(), null, 2))

// console.log(JSON.stringify(exampleSchema.safeParse({ name: 'Marco', age: -2 }), null, 2))

// console.log(exampleSchema.shape.age)

// console.log(JSON.stringify(exampleSchema.safeParse({ name: '', age: -2 }), null, 2))

console.log(util.inspect(exampleSchema.safeParse(2), { depth: null, colors: true }))

const c = exampleSchema.keyof()

type C = z.infer<typeof c>

console.log(z.bigint().safeParse(BigInt(2)))

console.log(z.nan().safeParse(Number.NaN))
