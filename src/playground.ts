import { z } from '.'

const PersonSchema = z.object({
  firstName: z.string(),
  middleName: z.string().optional(),
  lastName: z.string(),
  age: z.number().nonnegative(),
})

console.log(PersonSchema)

const val = PersonSchema.postprocess(val => val.firstName).parse({
  firstName: 'Marco',
  lastName: 'Santos',
  age: 23,
})

console.log(val)
