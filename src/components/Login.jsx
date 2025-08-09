import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext';
import axios from 'axios'
import { motion } from "motion/react"
import { toast } from 'react-toastify';
const Login = () => {

    // this useState is used to switch between the login and sig up page  
    const [state, setState] = useState('Login');

    // import setShowLogin from appContext
    // this is used to hide , close the login
    const {setShowLogin , backendUrl , setToken , setUser} = useContext(AppContext);

    // done after creating backend 
    const [name , setName] = useState('');
    const [email ,setEmail] = useState('');
    const [password , setPassword] =  useState('');

    const onSubmitHandler =async (e)=>{
        e.preventDefault(); // prevent the page from reloading on submitting the form 

        try{
            if(state === 'Login'){
                // call the login api
                // for login we nned email and password
                const {data} = await axios.post(backendUrl + '/api/user/login' , {email, password})
            
            // if the data  is success then set the new token whichwe will get from the data 
            if(data.success){
                setToken(data.token)
                setUser(data.user)
                // store the token in the local storage 
                localStorage.setItem('token' , data.token)
                // hide the login form 
                setShowLogin(false)
            }else{
                // display the error in the form of toast method
                toast.error(data.message)
            }
        }else{   // else means the state is not login the state is signup
              // call the login api
                // for signUp  we need name , email and password
                const {data} = await axios.post(backendUrl + '/api/user/register' , {name , email, password})
            
            // if the data  is success then set the new token whichwe will get from the data 
            if(data.success){
                setToken(data.token)
                setUser(data.user)
                // store the token in the local storage 
                localStorage.setItem('token' , data.token)
                // hide the login form 
                setShowLogin(false)
            }else{
                // display the error in the form of toast method
                toast.error(data.message)
            }

        }

        }catch(error){
            toast.error(error.message)
        }
    }

    // to off the scroll behind the signUp component
    useEffect(()=>{
        document.body.style.overflow = "hidden";
        return ()=>{
            document.body.style.overflow = "unset";
        }
    } , [])


  return (
    <div className='fixed  top-0 left-0 right-0  bottom-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-10'>

        <motion.form onSubmit={onSubmitHandler} 
        initial = {{opacity : 0.2 ,y:50}}
        transition={{duration : 0.3}}
        whileInView={{opacity :1 , y : 0}}
        viewport={{once : true}}
        className='relative bg-white p-10 rounded-xl text-slate-500'>
            <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
            <p className='text-sm'>Welcome back! Please sign in to continue</p>


            {/* this div contain name section this div will only display when we are on the SignUp page not on login page 
            on login page we only need email and password  */}

            {/* when state is not equla ot login then this div will display */}
            {state !=="Login" &&
                <div className='border px-6 py-1 flex items-center gap=2 rounded-full mt-5'>
                <img  className="h-6 mr-2" src={assets.profile_icon} alt=""></img>
                {/* onchange the name call the setNmae to change the name which is stored in the e.targt.value and make the value to {name} means newName entered */}
                <input  onChange={e=>setName(e.target.value)}
                value = {name} type="text" placeholder='Full Name' required className='outline-none text-sm'></input>
            </div>
            }

            <div className='border px-6 py-1.5 flex items-center gap=2 rounded-full mt-5'>
                <img  className="h-4 mr-3" src={assets.email_icon} alt=""></img>
                {/* so whenever we entered anything int hsi feild this data will be pass to the variables  */}
                <input onChange={e=>setEmail(e.target.value)}
                value = {email} type="email" placeholder='Email id' required className='outline-none text-sm'></input>
            </div>

            <div className='border px-6 py-1 flex items-center gap=2 rounded-full mt-5'>
                <img  className="h-6 mr-3" src={assets.lock_icon} alt=""></img>
                <input onChange={e =>setPassword(e.target.value)}
                value = {password} type="password" placeholder='Password' required className='outline-none text-sm'></input>
            </div>

            <p className='text-sm text-blue-600 cursor-pointer my-3'> Forget Pasword ? </p>

{/* if state is "login" then login will appear if the state is not "login" then Create Account will appear */}
            <button className='bg-blue-600 w-full text-white py-1 rounded-full cursor-pointer'>{state === "Login" ? "Login" : "Create Account"}</button>

{/*if the state is login then 1st p will be shown 
 if it is not login then 2nd p will be shown  */}

 {/* Allssoo in sign up and login button we added the onClick in which we are passing the setState() in whihc the passing is "sign up"
 and in login we pass login means when we click on login login will be the state and if we click on sign up then the sign up will be the state  */}
               { state==="Login" ?
                <p className='mt-4 text-center'>Don't have an account? <span className='text-blue-600 cursor-pointer'  onClick={()=>setState("SignUp")}>Sign up</span></p>
                :
                <p className='mt-3 text-center'>Already have an account? <span className='text-blue-600 cursor-pointer'  onClick={()=>setState("Login")}>Login</span></p>
                }

{/* // means when clikc on this setShowLogin will be false */}
            <img onClick={()=>setShowLogin(false)} className='absolute top-5 right-5 cursor-pointer' src={assets.cross_icon} alt=""></img>
        </motion.form>
      
    </div>
  )
}

export default Login
