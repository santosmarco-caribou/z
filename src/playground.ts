import {z} from './index'

console.log(z.any()._validator['_schema'].validate(undefined))