// here we will sotre the variables and function and which we will use in our any componenet

import { createContext , useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
export const AppContext = createContext()

const AppContextProvider = (props) =>{
    const [user , setUser] = useState(null);

    // means initially showLogin is hidden 
    const [showLogin , setShowLogin] = useState(false);

    // if there is any token available in the browser locak storage then it will be stored in the tooke  variable
    const [token, setToken] = useState(localStorage.getItem("token"))

    const [credit , setCredit]  = useState(0);

    // store the backend url from the .env file so that we can use that here
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate()
    
// function to load he credit  from api 
    const loadCreditData = async ()=>{
        // call the api to get the credit
        try{
            const {data} = await axios.get(backendUrl + '/api/user/credits' , {headers : {token}})

            if(data.success){
                setCredit(data.credits)
                setUser(data.user)
            }
        }catch(error){
           console.log(error)
           toast.error(error.message) 
        }
    }

    // function ot generate the image 
    // to generate image we need prompt
    const generateImage = async (prompt)=>{
        try{
            // we will call image generate api that we created in our backend 
            const {data} = await axios.post(backendUrl + "/api/image/generate-image" , {prompt} , {headers : {token}})

            // check the data 
            if(data.success){
                // after generating the image it will again load the credit 
                loadCreditData()
                return data.resultImage
            }else{
                toast.error(data.message)
                loadCreditData()
                if(data.creditBalance === 0){
                    // if the creditBalance is 0 we will redirect the user to buyCredit page 
                    navigate('/buy')
                }
            }

        }catch(error){
            toast.error(error.message)
        }

    }

    // make the logout function
    const logout = ()=>{
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
    }

    useEffect(()=>{
        if(token){
            loadCreditData()
        }
    },[token])  // dependency array is token ---whenever the token is changed this will execute 


    // create a variable 
    // in this we will pass the variable so that anyother function can also use this variables export it 
    const value = {
        user , setUser, showLogin ,setShowLogin , backendUrl , token, setToken , credit , setCredit , loadCreditData , logout , generateImage
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider