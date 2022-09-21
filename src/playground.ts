import Joi from 'joi'
import { z } from '.'

const AddressSchema = z.object({
  street: z.string().trim(),
  city: z.string().trim(),
  state: z.string().trim().length(2).uppercase(),
  zip: z
    .string()
    .trim()
    .pattern(/^\d{5}$/, { name: 'Zip code' }),
})

const PersonSchema = z.object({
  firstName: z.string().trim().capitalize(),
  middleInitial: z.string().trim().length(1).uppercase().optional(),
  lastName: z.string().trim().capitalize(),
  age: z.number().int().positive().min(18).max(120),
  email: z.string().email(),
  phone: z.string().pattern(/^\d{3}-\d{3}-\d{4}$/, { name: 'Phone number' }),
  address: AddressSchema,
  secondaryAddress: AddressSchema.optional(),
  firstThreeFavoriteColors: z.tuple([z.string(), z.string(), z.string()]),
  vehicle: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('car'),
      year: z.number().integer().min(1900),
      make: z.string(),
      model: z.string(),
      trim: z.string(),
      vin: z.string().length(17),
    }),
    z.object({
      type: z.literal('truck'),
      year: z.number().integer().min(1900),
      make: z.string(),
      model: z.string(),
      trim: z.string(),
      maxCargoWeight: z.number().integer().positive(),
    }),
  ]),
})

type Person = z.infer<typeof PersonSchema>

// console.log(z.null().or(z.number().or(z.boolean())))

console.log(z.any().safeParse(new Promise(() => {})))

// console.log(Joi.any().validate(() => {}))
