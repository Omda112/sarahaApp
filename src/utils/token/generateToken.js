import jwt from 'jsonwebtoken'

export const generateToken = async ({payload = {} , SIGNATURE , expiresIn })=>{
    return jwt.sign(
        // { email, id: user._id },
        payload,
        // user.role === "user" ? process.env.SIGNATURE_USER : process.env.SIGNATURE_ADMIN,
        SIGNATURE,
        expiresIn
    );
}