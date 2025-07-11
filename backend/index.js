import express from "express";
import dotenv from "dotenv"
import connectDb from "./config/db.js";
dotenv.config()

const app = express()
const port = process.env.PORT 

app.listen(port,()=>{
    connectDb()
    console.log(`server is up and running on ${port}`)
})