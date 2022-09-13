import { z } from '.'

const s = z.string().optional().unwrap().safeParse('hello').value

const S: z.infer<typeof s> = 'hello'

console.log(z.string().description('s').deprecated(true).notes('n').optional().unwrap())
