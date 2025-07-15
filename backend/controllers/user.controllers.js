// gives details of current users 
import User from "../models/user.model.js"

export const getCurrentUser = async(req,res)=>{
    try {
        const userId= req.userId
        const user = await User.findById(userId).select("-password")
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({message:"get current user error "})
    }
}

export const updateAssistant= async(req,res)=>{
    try {
          const {assistantName,imageUrl}=req.body
      let assistantImage;

      //this process is for the input image from computer 
if(req.file){        //file ke andar koi image ayi hai?
   assistantImage=await uploadOnCloudinary(req.file.path)    //cloudinary store the image in it and returns a URL
}else{
   assistantImage=imageUrl
}
 //update the user with the new assistant name and image
const user=await User.findByIdAndUpdate(req.userId,{
    
   assistantName,assistantImage   //these have to be updated
},{new:true}).select("-password")
return res.status(200).json(user)


    }
    catch (error) {
        return res.status(400).json({message:"updateAssistantError user error"}) 
   
    }

}