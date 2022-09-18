import { z } from '.'

const arr = z.string().title('a').summary('b').tags('c', 'd').optional().description('a')

// console.log(JSON.stringify(arr.toOpenApi(), null, 2))

// console.log(JSON.stringify(arr._schema.get().describe(),  null, 2),)

// console.log(z.string().title('marco').optional().description('s'))
console.log(arr._manifest.get())
