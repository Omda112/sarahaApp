
import { Router } from "express";
import * as msg from "./message.service.js";
import { validation } from "./../../middleware/validation.js";
import * as MV from "./message.validation.js";
import { authentication } from "../../middleware/auth.js";

const messageRouter = Router();

messageRouter.post('/',validation(MV.sendMessageSchema),msg.sendMessage);
messageRouter.get('/getM',authentication,msg.getMessage);

export default messageRouter;