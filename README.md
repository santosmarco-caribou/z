# ZTs

ZTs is one more schema declaration and validation library but built on top of the two most famous validation libraries in the JavaScript ecosystem: [Joi](https://joi.dev/api/?v=17.6.0) and [Zod](https://zod.dev/).

---

## All `ZTypes`

```ts
z.any()
z.array()
z.bigint()
z.binary()
z.boolean()
z.brand()
z.custom()
z.date()
z.default()
z.discriminatedUnion()
z.enum()
z.false()
z.falsy()
z.function()
z.instanceof()
z.intersection()
z.literal()
z.map()
z.nan()
z.never()
z.nonnullable()
z.nullable()
z.null()
z.number()
z.object()
z.optional()
z.preprocess()
z.primitive()
z.promise()
z.propertykey()
z.readonlydeep()
z.readonly()
z.record()
z.set()
z.string()
z.symbol()
z.template()
z.true()
z.tuple()
z.typedarray()
z.undefined()
z.union()
z.uniqsymbol()
z.unknown()
z.void()
```

## Basic usage

```ts
import { z } from 'zts'

const PersonSchema = z.object({
  firstName: z.string().trim().description("The person's first name"),
  middleName: z.string().trim().optional().summary('Optional'),
  lastName: z.string().trim().tag('name'),
  nameSuffix: z
    .enum(['Jr', 'III', 'II', 'I'])
    .optional()
    .notes('To be improved in the future'),
  age: z.number().integer().min(18).max(120).examples(42, { value: 99 }),
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
  pets: z.array(
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
  ),
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

type Person = z.infer<typeof PersonSchema>
/*
{
  email: string;
  address: {
    street?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    zip?: string | undefined;
  };
  firstName: string;
  lastName: string;
  age: number;
  middleName?: string | undefined;
  nameSuffix?: "Jr" | "III" | "II" | "I" | undefined;
  dateOfBirth: Date;
  phone: string;
  isUsCitizen: boolean;
  maritalStatus: "single" | "married" | null;
  childrenNames?: readonly [string, string, string] | undefined;
  favoriteColorsRgb: {
    [x: string]: [number, number, number];
  };
  favoriteColorsHex: {
    [x: string]: string;
    [x: number]: string;
    [x: symbol]: string;
  };
  vehicle: {
    type: "car";
    make: string;
    model: string;
    year: number;
  } | {
    type: "truck";
    make: string;
    model: string;
    year: number;
    bedLength: number;
  } | {
    type: "motorcycle";
    make: string;
    model: string;
    year: number;
    hasSidecar: boolean;
  };
  pets: {
    age: number;
    name: string;
    type: "dog" | "cat";
    isGoodBoy: boolean;
  }[];
  happiness: {
    isHappy: true;
    whatMakesYouHappy: string;
  } | {
    isHappy: false;
    whatMakesYouSad: string;
  };
};
*/
```

Now let's go into some details about the above example.

First, we declare our object structure.

```ts
const PersonSchema = z.object({
```

Then, the fields...

Along with the type validation checks, `ZTs` also feature a bunch of meta information that can be used to generate documentation, API specifications, etc.

For example, descriptions...

```ts
  firstName: z.string().trim().description("The person's first name"),
```

... summaries, tags, notes, examples, and much more.

```ts
  middleName: z.string().trim().optional().summary('Optional'),

  lastName: z.string().trim().tag('name'),

  nameSuffix: z.enum(['Jr', 'III', 'II', 'I']).optional().notes('To be improved in the future'),

  age: z.number().integer().min(18).max(120).examples(42, { value: 99 }),
```

> Oh! And note that the `.optional()` fields automatically received the questions marks (`?`) in the generated type.
>
> ```ts
>   middleName?: string | undefined;
>   nameSuffix?: "Jr" | "III" | "II" | "I" | undefined;
> ```

We support special validations like dates, email addresses, and complex regexes too:

```ts
dateOfBirth: z.date().after(new Date('January 01, 1900 00:00:00')),

email: z.string().email(),

phone: z
  .string()
  .regex(/^\d{3}-\d{3}-\d{4}$/)
  .example('111-222-3333'),
```

The `ZObject` type contains a bunch of helper methods to make it easier to transform it into the schema you want.

For example, you can make all the keys of an object optional with `.partial()`. And go deeper with `.partialDeep()`. Same with `.readonly()` / `.readonlyDeep()`, among others, like `.pick()` / `.omit()`.

```ts
address: z
  .object({
    street: z.string().trim(),
    city: z.string().trim(),
    state: z.string().trim().length(2),
    zip: z.string().trim().length(5),
  })
  .partial(),
```

You can also create fixed-length arrays pretty easily:

```ts
childrenNames: z.array(z.string().trim()).length(3).optional(),
// -> readonly [string, string, string] | undefined;
```

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
