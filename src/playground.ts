import { L } from 'ts-toolbelt'
import { z } from '.'

const PersonSchema = z.object({
  firstName: z.string().trim().description("The person's first name"),
  middleName: z.string().trim().optional().summary('Optional'),
  lastName: z.string().trim().lowercase(),
  nameSuffix: z
    .enum(['Jr', 'III', 'II', 'I'])
    .optional()
    .notes('To be improved in the future'),
  age: z.number().integer().min(18).max(120),
  dateOfBirth: z.date().after(new Date('January 01, 1900 00:00:00')),
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/)
    .example('111-222-3333'),
  address: z
    .object({
      street: z.string().trim().hex(),
      city: z.string().trim().base64(),
      state: z.string().trim().length(2).ip(),
      zip: z.string().trim().length(5).alphanumeric(),
    })
    .partial(),
  isUsCitizen: z.boolean(),
  maritalStatus: z.literal('single').or(z.literal('married')).nullable(),
  childrenNames: z.array(z.string().trim()).length(3).optional(),
  favoriteColorsRgb: z.record(
    z.string().trim(),
    z.tuple([
      z.number().between(0, 255),
      z.number().between(0, 255),
      z.number().between(0, 255),
    ])
  ),
  favoriteColorsHex: z.record(
    z.propertykey(),
    z.string().regex(/^#[0-9a-f]{6}$/i)
  ),
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
        isHappy: z.false().and(z.number()).and(z.instanceof(RegExp)),
        whatMakesYouSad: z.readonly(z.tuple([z.string()])),
      })
    ),
})

console.log(PersonSchema.hint)

const ass = z.instanceof(RegExp)

type A = z.infer<typeof PersonSchema> & number

console.log(ass.hint)

console.log(
  z.array(z.any()).ascending({ strict: true }).safeParse([2, 3, 1, 4]),
  z.object({}).strict()._schema.get().describe()
)

const b = z.literal(BigInt(100))

console.log(z.null().nonnullable().hint)
