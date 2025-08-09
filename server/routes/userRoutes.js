import express from 'express'

import {registerUser , loginUser, userCredits, paymentRazorpay, verifyRazorpay} from "../controllers/userController.js"
import userModel from '../models/userModel.js';
import userAuth from '../middlewares/auth.js';

// create router
const userRouter = express.Router()

// we will mount it's base path in server.js
// /api/user  , userRouters then next route we will add will accourding to this file

// /api/user/register  or /api/user/login

// when we matches the routes (/register) it will see the post request it will give the data to the registerUser and call it 
// and same as for the login route
userRouter.post("/register" , registerUser);
userRouter.post("/login" , loginUser);
userRouter.get("/credits" , userAuth,userCredits);
userRouter.post("/pay-razor" , userAuth,paymentRazorpay);
userRouter.post("/verify-razor" , verifyRazorpay);

export default userRouter;




// localhost:4000/api/user/register when we will hit this we will execute registerUser

// localhost:4000/api/user/login when we will hit this we will execute loginUser