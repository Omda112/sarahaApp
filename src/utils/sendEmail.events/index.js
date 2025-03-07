import { EventEmitter } from "events";
import { sendEmail } from "../../service/email.js";
import { generateToken } from "../token/generateToken.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on("sendEmail", async (data) => {
    const { email } = data;
    // const token = jwt.sign({ email }, process.env.SIGNATURE_CONFIRMATION);
    const token = await generateToken({
      payload: { email },
      SIGNATURE: process.env.SIGNATURE_CONFIRMATION,
      expiresIn: { expiresIn : '3h' },
    })
    const link = `http://localhost:3000/users/confirmEmail/${token}`;
  
    const emailSender = await sendEmail(email, "confirmEmail", `<a href='${link}'>confirm me</a>`);
    console.log("Email Sender Response:", emailSender); // ✅ تحقق إذا كان `return` يعمل
  });
  