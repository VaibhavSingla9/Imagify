import express from "express"
import cors from "cors"
import dotenv from "dotenv";
dotenv.config();
// Add this line to inspect process.env immediately after dotenv loads it
console.log("Environment Variables after dotenv.config():", process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET);
// You can even log the entire process.env object to be sure:
// console.log("Full Environment Variables:", process.env); 

import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";

const PORT = process.env.PORT || 4000;

const app = express()



app.use(express.json())
app.use(cors())
// connect to mongodb 
await connectDB();

// will call the user Router

app.use("/api/user" , userRouter);
// add the image router
app.use('/api/image' , imageRouter);
app.get('/',(req,res)=>{
    res.send("API WORKING ")
})

app.listen(PORT , ()=>{
    console.log(`Server Runnning on Port ${PORT}` )
})