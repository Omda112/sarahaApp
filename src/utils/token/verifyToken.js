import jwt from 'jsonwebtoken'

export const verifyToken = ({token , SIGNATURE_CONFIRMATION = process.env.SIGNATURE_CONFIRMATION})=>{
    return jwt.verify(token, SIGNATURE_CONFIRMATION);
}