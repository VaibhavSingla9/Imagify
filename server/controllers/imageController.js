import axios from "axios"
import userModel from "../models/userModel.js"
import FormData from "form-data"


export const generateImage = async (req,res)=>{
    try{
        const { prompt} = req.body
        const userId = req.userId;

        const user = await userModel.findById(userId)

        // check itis user or not 
        if(!user || !prompt){
            return res.json({success : false , message : 'Missing Details'})
        }

        // if both are available 
        // but if balance is 0
        if(user.creditBalance === 0 || userModel.creditBalance<0){
            return res.json({success: false , message : 'NO Credit Balance', creditBalance : user.creditBalance})
        }

        // if the balance is greater than 0 then generate image 
        // here we have to create multipart form data
        const formData = new FormData()
        formData.append('prompt' , prompt)
        // now make the api request and make post request 
        const {data} = await axios.post("https://clipdrop-api.co/text-to-image/v1" , formData , {
            headers: {
    'x-api-key': process.env.CLIPDROP_API,
                     },
                     responseType : 'arraybuffer'
        })

        const base64Image = Buffer.from(data , 'binary').toString('base64')
        const resultImage = `data:image/png;base64,${base64Image}`
        //deduct the credit 
        await userModel.findOneAndUpdate(user._id, {creditBalance : user.creditBalance-1})
        // send this result image in the response
        res.json({success : true , message : 'Image Generated' , creditBalance : user.creditBalance-1 , resultImage})

    }catch(error){
        console.log(error.message)
        res.json({success:false , message : error.message})
    }
}

