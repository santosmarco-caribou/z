import { z } from '.'

console.log(z.readonly(z.string().optional().summary('my inner title')).title('my title').$_manifest)

const a = z.record(z.string().uuid().summary('my inner title'), z.number().port().nullable()).title('my title')

type A = z.infer<typeof a>

console.log(a.manifest)
