import {z} from './index'

console.log(z.any()._validator['_schema'].validate(2))

console.log(z.globals().options)