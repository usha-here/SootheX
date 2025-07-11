import User from "../models/user.model"
import bcrypt from "bcryptjs"

export const signUp = async (req,res)=>{
    try{
        const{name,email,password} = req.body

        const existEmail = await User.findOne({email})
        if(existEmail){
            return res.status(400).json({message:"email already exists!"})
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be atleast 6 characters"})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await User.create({
            name,password:hashedPassword,email
        })
    }
    catch{

    }
}
