import { verifyJWTtoken } from "../services/auth.services.js"

export const verifyAuthentication = (req,res,next)=>{
    // console.log(`hello`)
    const token = req.cookies.access_token
    // console.log(token)
    if(!token){
        req.user = null
        return res.status(401).json({ message: "Unauthorized: No token" });
    }

    try{
        const decodedToken = verifyJWTtoken(token)
        req.user = decodedToken
        console.log(`req.user:`, req.user)
    }catch(error){
        req.user = null
         return res.status(401).json({ message: "Invalid token" });
    }
    return next()
}