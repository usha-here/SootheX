// gives details of current users 
import User from "../models/user.model.js"
import moment from "moment";
import geminiResponse from "../routes/gemini.js";

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
if(req.file){     
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

export const askToAssistant = async (req, res) => {
    try {
        const { command } = req.body;
        const user = await User.findById(req.userId);
        user.history.push(command); //add the command to the user's history
        user.save(); //save the updated user history
        const userName = user.name
        const assistantName = user.assistantName 
        const result = await geminiResponse(command,assistantName, userName);
        console.log("Gemini API raw result:", result);

        let gemResult;
        if (typeof result === "string") {
            const jsonMatch = result.match(/{[\s\S]*}/);
            if (!jsonMatch) {
                console.error("No JSON object found in Gemini response:", result);
                return res.status(400).json({ message: "Sorry, I can't understand what you mean" });
            }
            gemResult = JSON.parse(jsonMatch[0]);
        } else if (typeof result === "object") {
            gemResult = result;
        } else {
            console.error("Unexpected Gemini response type:", typeof result, result);
            return res.status(400).json({ message: "Sorry, I can't understand what you mean" });
        }
        const type = gemResult.type;
        switch(type) {
            case "get-date": 
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response:`current date is ${moment().format("YYYY-MM-DD")}`
                });
            case "get-time":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response:`current time is ${moment().format("HH:mm A")}`
                });
            case "get-day":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response:`today is ${moment().format("dddd")}`
                });
            case "get-month":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response:`current month is ${moment().format("MMMM")}`
                });
            case "google-search":
            case "youtube-search":
            case "youtube-play":
            case "calculator-open":
            case "instagram-open":
            case "facebook-open":
            case "weather-show":
            case "general":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: gemResult.response,
                });
            default:
                return res.status(400).json({ response: "Sorry, I can't understand what you mean" });
        }

    } catch (error) {
        console.error("Error in askToAssistant:", error);
        return res.status(500).json({ message: "Ask Assistant error" });
    }
}