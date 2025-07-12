import express from "express"
import { getCurrentUser } from "../controllers/user.controllers"

const userRouter = express.Router()

userRouter.get("/current",getCurrentUser)

export default userRouter