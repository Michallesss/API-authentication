const Joi=require('joi');

// Login valid
const login= Joi.object({
    name: Joi
        .string()
        .min(3)
        .max(64)
        .required(),
    password: Joi
        .string()
        .min(6)
        .max(64)
        .required()
});

// Register valid
const register= Joi.object({
    name: Joi
        .string()
        .min(3)
        .max(64)
        .required(),
    email: Joi
        .string()
        .email()
        .min(3)
        .max(64)
        .required(),
    password: Joi
        .string()
        .min(6)
        .max(64)
        .required(),
    date: Joi
        .date()
        .default(Date)
});

module.exports={
    login,
    register
};