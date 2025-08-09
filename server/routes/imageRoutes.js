import userAuth from "../middlewares/auth.js";
import express from "express";
import { generateImage } from "../controllers/imageController.js";

// add router
const imageRouter  = express.Router()

// userAuth middleware is used to add userId in the body and which can be used by the generateImage function 

imageRouter.post('/generate-image' ,userAuth ,generateImage)

export default imageRouter;