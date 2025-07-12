//finds user id from token generated 
import jwt from "jsonwebtoken";

const isAuth = async(req,res,next)=>{
    try{
        const token = req.cookie.token
        if(!token){
            return res.status(400).json({message:"Token not found"})
        }
        const verifyToken = await jwt.verify(token,process.env.JWT_SECRET)
    }
    catch(error){

    }
}