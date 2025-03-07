import Joi from "joi";
import { generalRules } from "../../utils/generalRules/index.js";

export const sendMessageSchema = {
    body: Joi.object({
       content: Joi.string().min(1).required(),
       userId: generalRules.objectId.required(),
    }).required(),
}
  