import Joi from 'joi'

/* -------------------------------------------------------------------------- */
/*                                    ZJoi                                    */
/* -------------------------------------------------------------------------- */

// Make all Joi schemas required by default
export const ZJoi = Joi.defaults(schema => schema.required())
