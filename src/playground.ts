import { z } from '.'

const Vector = z.tuple([z.number(), z.number(), z.number()])

const Asteroid = z.object({
  type: z.literal('asteroid'),
  location: Vector,
  mass: z.number().nonnegative(),
})

type Asteroid = z.infer<typeof Asteroid>
