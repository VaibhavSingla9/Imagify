import express from 'express';
import jwt from 'jsonwebtoken';


//create middleware
const userAuth = async (req,res, next)=>{
// we have to find the token 
const {token} = req.headers;

// check if token is not available
if(!token){
    return res.json({success : false , message :  'Not Authorized. Login Again'});
}
try{
    // // decode the token if token is there 
    // const tokenDecode = jwt.verify(token , process.env.JWT_SECRET);

    // if(tokenDecode.id){
    //     req.userId =tokenDecode.id;
    // }else{
    //     return res.json({success : false , message : 'Not Authorized. Login Again'})
    // }

    // next();

    // chat gtp 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ success: false, message: 'Invalid Token' });
    }

    // Attach to req object directly (not to req.body)
    req.userId = decoded.id;

    next();


}catch(error){
    res.json({success : false , message : error.message})
}

}

export default userAuth;

