// here we will create the different controller function 
// user registration 
// user login 
// user logout

import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'; // to encrypt the password
import jwt from  'jsonwebtoken' // using this we will create token for user authentication
// import razorpay for payments 
import razorpay from 'razorpay'
import transactionModel from "../models/transactionModel.js"
import crypto from 'crypto';

// created registration function 
const registerUser = async (req,res)=>{
    try{
        const {name, email , password} = req.body;
// if any of the these is missing 
        if(!name|| !email || !password){
            return res.json({success:false , message: "Missing Details"})
        }
        // if we have all thses details
        // now we will encrypt the password 
        const salt = await bcrypt.genSalt(10); // used in password hashing
        const hashedPassword = await bcrypt.hash(password , salt); // hashes the user password 

        const userData = {
            name , 
            email , 
            password : hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save() // after saving a unique id will be generated

        // sign as user._id user we have created upward _id is by default created 
        // we will generate the token

        const token = jwt.sign({id: user._id} , process.env.JWT_SECRET)

        // send this token in response.json
        // send token , user
        res.json({success : true , token , user:{name : user.name}})

    }catch(error){
        console.log(error)
        res.json({success :false , message : error.message})
    }
}



const loginUser = async (req , res)=>{
    try{
        // for login user function we have only emial,pasword 
        const {email , password}=  req.body
        // we have to find the user
        const user = await userModel.findOne({email})

        // if the email does not exist means user is not there so return sucess false
        if(!user){
            return res.json({success: false , message : 'User does not exist'})
        }

        // if it match the user is aldredy there then check the password 
        //bcrypt will compare the password saved in the db and given by user
        const isMatch = await bcrypt.compare(password , user.password)

        // if the password is also true then generate the token
        if(isMatch){
            const token = jwt.sign({id: user._id} , process.env.JWT_SECRET)

            res.json({success : true , token , user : {name : user.name}})

        }else{
            return res.json({success: false , message : 'Invalid Credentials'})
        }

    }catch(error){
         console.log(error)
        res.json({success :false , message : error.message})
    }

}


// userCredits function 
const userCredits = async (req,res)=>{
    try{
        // we need the user id to get credit of the particular user
        const userId = req.userId;

        // find the user using userID
        const user = await userModel.findById(userId);

        if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

        res.json({success : true , credits : user.creditBalance , user : {name : user.name}})

    }catch(error){
        console.log(error.message);
        res.json({success: false , message : error.message})
    }
}

// These console logs are still useful for initial module load debugging,
// but the Razorpay instance itself is now initialized within paymentRazorpay.
console.log("RAZORPAY_KEY_ID (module top) =", process.env.RAZORPAY_KEY_ID);
console.log("RAZORPAY_KEY_SECRET (module top) =", process.env.RAZORPAY_KEY_SECRET);


// const razorpayInstance = new razorpay({
//     key_id:process.env.RAZORPAY_KEY_ID,
//     key_secret:process.env.RAZORPAY_KEY_SECRET,
// });

const paymentRazorpay = async(req,res)=>{
    try{

        // Initialize Razorpay instance here, inside the function
        // This ensures environment variables are loaded when the function is called
        console.log("RAZORPAY_KEY_ID (inside paymentRazorpay) =", process.env.RAZORPAY_KEY_ID);
        console.log("RAZORPAY_KEY_SECRET (inside paymentRazorpay) =", process.env.RAZORPAY_KEY_SECRET);

        const razorpayInstance = new razorpay({
            key_id : process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        // we need he userid
        // const {userId , planId} = req.body
        //
        const { planId } = req.body;
const userId = req.userId; // Get userId from auth middleware

        

        if(!userId || !planId){
            return res.json({success : false , message : 'Missing Details'})
        }

        const userData = await userModel.findById(userId)

        let credits, plan , amount , date
        switch(planId){
            case 'Basic':
                plan = 'Basic'
                credits = 100
                amount = 10
                break;
              
            case 'Advanced':
                plan = 'Advanced'
                credits = 500
                amount = 50
                break;
                
            case 'Business':
                plan = 'Business'
                credits = 5000
                amount = 250
                break;    
            
            default:
                return res.json({success: true , message:'Plan not found'});
        }
        
        date = Date.now(); // store the current date 

        
        const transactionData = {
            userId , plan  , amount,credits ,  date 
        }

        // now ewe have to store this data in the database so we have to create the model for this to store in the database

        const newTransaction = await transactionModel.create(transactionData)

        const options = {
            amount : amount * 100 , 
            currency : process.env.CURRENCY,
            receipt : newTransaction._id,
        }

        // await razorpayInstance.orders.create(options, (error , order)=>{
        //     if(error){
        //         console.log(error);
        //         return res.json({success : false , message : error})
        //     }
        //     res.json({success: true , order})
        // })

        //
        const order = await razorpayInstance.orders.create(options);
res.json({ success: true, order });

    }catch(error){
        console.log(error)
        res.json({success: false , message : error.message })
    }
}

const verifyRazorpay = async (req,res)=>{
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    console.log("Received verification request:", { razorpay_order_id, razorpay_payment_id, razorpay_signature });


    // Step 1: Signature verification
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    console.log("Signature string to hash:", sign);
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");
    console.log("Expected Signature:", expectedSignature);
    console.log("Received Signature:", razorpay_signature);


    if (expectedSignature !== razorpay_signature) {
      console.log("❌ Payment verification failed: Signature mismatch");
      return res.json({ success: false, message: "Payment verification failed: Signature mismatch" });
    }
    console.log("✅ Signature matched.");

    // Step 2: Fetch order from Razorpay to get the receipt (_id of transaction)
    const razorpayInstance = new razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpayInstance.orders.fetch(razorpay_order_id);
    console.log("Fetched Razorpay Order:", order);
    const receiptId = order.receipt; // this is your MongoDB _id of the transaction
    console.log("Receipt ID from Razorpay Order (MongoDB transaction _id):", receiptId);

    // Step 3: Fetch the transaction from your DB
    const transactionData = await transactionModel.findById(receiptId);
    if (!transactionData) {
      console.log("❌ Transaction not found in DB for receiptId:", receiptId);
      return res.json({ success: false, message: "Transaction not found in our records" });
    }
    console.log("Fetched Transaction from DB:", transactionData);


    if (transactionData.payment) {
      console.log("⚠️ Payment already processed for transaction:", receiptId);
      return res.json({ success: false, message: "Payment already processed" });
    }

    // Step 4: Update user's credits
    const user = await userModel.findById(transactionData.userId);
    if (!user) {
      console.log("❌ User not found for transaction userId:", transactionData.userId);
      return res.json({ success: false, message: "User not found for credit update" });
    }

    const updatedCredits = user.creditBalance + transactionData.credits;
    console.log(`Updating user ${user._id} credits from ${user.creditBalance} to ${updatedCredits}`);
    await userModel.findByIdAndUpdate(user._id, { creditBalance: updatedCredits });
    console.log("✅ User credits updated successfully.");


    // Step 5: Mark transaction as paid
    console.log(`Marking transaction ${transactionData._id} as paid.`);
    await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true });
    console.log("✅ Transaction marked as paid.");


    return res.json({
      success: true,
      message: "Credits Added Successfully",
      newCreditBalance: updatedCredits
    });

  } catch (error) {
    console.log("❌ Error in verifyRazorpay:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export  {registerUser , loginUser , userCredits , paymentRazorpay , verifyRazorpay}




