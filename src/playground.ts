import { L } from 'ts-toolbelt'
import { z } from '.'

const arr = z.string().title('a').summary('b').tags('c', 'd').optional().description('a')

// console.log(JSON.stringify(arr.toOpenApi(), null, 2))

// console.log(JSON.stringify(arr._schema.get().describe(),  null, 2),)

// console.log(z.string().title('marco').optional().description('s'))
console.log(arr._manifest.get())
const obj = z.object({ a: z.string(), b: z.object({ c: z.boolean() }) }).readonlyDeep()

const record = console.log(z.map(z.string(), z.number()).readonly().safeParse(2).error.annotate())

console.log(z.custom(value => String(value)))

const PersonSchema = z
  .object({
    firstName: z.string().trim().description("The person's first name"),
    middleName: z.string().trim().optional().summary('Optional'),
    lastName: z.string().trim().lowercase(),
    nameSuffix: z.enum(['Jr', 'III', 'II', 'I']).optional().notes('To be improved in the future'),
    age: z.number().integer().min(18).max(120),
    dateOfBirth: z.date().after(new Date('January 01, 1900 00:00:00')),
    email: z.string().email(),
    phone: z
      .string()
      .regex(/^\d{3}-\d{3}-\d{4}$/)
      .example('111-222-3333'),
    address: z
      .object({
        street: z.string().trim(),
        city: z.string().trim(),
        state: z.string().trim().length(2),
        zip: z.string().trim().length(5),
      })
      .partial(),
    isUsCitizen: z.boolean(),
    maritalStatus: z.literal('single').or(z.literal('married')).nullable(),
    childrenNames: z.array(z.string().trim()).length(3).optional(),
    favoriteColorsRgb: z.record(
      z.string().trim(),
      z.tuple([z.number().between(0, 255), z.number().between(0, 255), z.number().between(0, 255)])
    ),
    favoriteColorsHex: z.record(z.propertykey(), z.string().regex(/^#[0-9a-f]{6}$/i)),
    vehicle: z.union([
      z.object({
        type: z.literal('car'),
        make: z.string().trim(),
        model: z.string().trim(),
        year: z.number().integer().min(1900).max(new Date().getFullYear()),
      }),
      z.object({
        type: z.literal('truck'),
        make: z.string().trim(),
        model: z.string().trim(),
        year: z.number().integer().min(1900).max(new Date().getFullYear()),
        bedLength: z.number().integer().min(0).unit('inches'),
      }),
      z.object({
        type: z.literal('motorcycle'),
        make: z.string().trim(),
        model: z.string().trim(),
        year: z.number().integer().min(1900).max(new Date().getFullYear()),
        hasSidecar: z.boolean(),
      }),
    ]),
    pets: z
      .array(
        z.union([
          z.object({
            type: z.literal('dog'),
            name: z.string().trim(),
            age: z.number().integer().min(0),
            isGoodBoy: z.boolean(),
          }),
          z.object({
            type: z.literal('cat'),
            name: z.string().trim(),
            age: z.number().integer().min(0),
            isGoodBoy: z.boolean(),
          }),
        ])
      )
      .length(3),
    happiness: z
      .object({
        isHappy: z.true(),
        whatMakesYouHappy: z.string().trim(),
      })
      .or(
        z.object({
          isHappy: z.false(),
          whatMakesYouSad: z.string().trim(),
        })
      ),
  })
  .partialDeep()
  .requiredKeysDeep()
  .setKey('a', z.string())

const arr2 = z.array(z.string()).length(3)

const PersonSchemsa = z.object({
  firstName: z.string().trim().description("The person's first name"),
  middleName: z.string().trim().optional().summary('Optional'),
  lastName: z.string().trim().lowercase(),
})

type A = z.infer<typeof PersonSchema>['a']

const asss = z.string().uncapitalize({ convert: true }).parse('asAasb', {})

console.log(asss)

type C = L.Repeat<
  {
    a: string
    b: 3
    c: 233
    d: boolean
  },
  10
>

const c: A = []

// const a = z.discriminatedUnion('type', [
//   z.object({ type: z.literal('a'), a: z.number(), c: z.boolean() }),
//   z.object({ type: z.literal('b'), a: z.number(), d: z.boolean() }),
// ])

type C2 = z.infer<typeof a>

console.log(PersonSchema.describe())
