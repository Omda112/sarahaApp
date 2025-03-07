import Joi  from "joi";
import { generalRules } from "../../utils/generalRules/index.js";
import { enumGender } from "../../DB/models/user.model.js";

// import { connection } from "mongoose";




export const signUpSchema ={
    body: Joi.object({
        name : Joi.string().min(3).max(12).required().messages({
            "string.min": "Name must be at least 3 characters long",
            "string.max": "Name must be at most 12 characters long"
        }),
        email : generalRules.email.required(),
        password : generalRules.password.required(),
        cPassword : Joi.string().valid(Joi.ref('password')).required(),
        phone : Joi.string().min(10).max(15).required(),
        gender : Joi.string().valid(enumGender.male,enumGender.female).required(),
        // id : Joi.string().custom(customId).required(),
    }).with("email", "password").required(),
    // headers: generalRules.Headers

}

export const updateProfileSchema = {
    body: Joi.object({
        name: Joi.string().min(3).max(12).required().label("Name").messages({
            "string.min": "Name must be at least 3 characters long",
            "string.max": "Name must be at most 12 characters long"
        }),
        phone: Joi.string().min(10).max(15).required().label("Phone"),
        gender: Joi.string().valid(enumGender.male, enumGender.female).label("Gender"),
    }).required(),
    headers: generalRules.Headers.required(),
};


export const updatePasswordSchema = {
    body: Joi.object({
        oldPassword: generalRules.password.required().label("oPassword"),
        newPassword: generalRules.password.required().label("nPassword"),
        cPassword: generalRules.password.valid(Joi.ref('newPassword')).required().label("cPassword"),
    }).required(),
    headers:generalRules.Headers.required()
}
    

export const freezeAccountSchema = {
    headers:generalRules.Headers.required()
}


export const shareProfileSchema = {
    params: Joi.object({
       id:generalRules.objectId.required(),
    }).required(),
}