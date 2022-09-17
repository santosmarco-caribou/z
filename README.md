# ZTs

ZTs is one more schema declaration and validation library but built on top of the two most famous validation libraries in the JavaScript ecosystem: [Joi](https://joi.dev/api/?v=17.6.0) and [Zod](https://zod.dev/).

---

## Primitives

```ts
import { z } from 'zts'

// primitive values
z.string()
z.literal()
z.number()
z.bigint()
z.nan()
z.boolean()
z.date()
z.symbol()

// empty types
z.undefined()
z.null()
z.void()

// catch-all types
// allows any value
z.any()
z.unknown()

// never type
// allows no values
z.never()
```

### Literals

```ts
const tuna = z.literal('tuna')
const twelve = z.literal(12)
const tru = z.literal(true)

// retrieve the literal value
tuna.value // "tuna"
```
