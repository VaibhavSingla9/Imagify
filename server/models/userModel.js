// here we will define ht euser scehema

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {type : String , required : true},
    email : {type : String  , required : true , unique : true},
    password : { type : String , required : true},
    creditBalance : {type : Number , default : 5}
})


//create user model 
// if the user model is available then it should use that model and if not then create the new useModel
const userModel= mongoose.models.user ||mongoose.model("user" , userSchema)

export default userModel;