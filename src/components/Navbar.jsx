import React, { useContext, useState } from 'react'
import {assets} from "../assets/assets"
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
const Navbar = () => {
    // to check wheter the user is log in/ out 
    // if it is null it means user is logout and if it is  true the user is login
    // we have give it in context -- appcontext.jsx file 

    // we are import user from appContext
    // we are import setShwoLogin from appContext to use in the login button to change the state of showLogin
    const {user , setShowLogin , logout , credit} = useContext(AppContext)
    const navigate = useNavigate();


  return (
    <div className='flex items-center justify-between py-4'>
      {/* we have to add logo on the left side and some button and text on the right side   */}

      {/* when we click on the image we will go to the home page  we can do this through Link */}
      <Link to="/">
      <img className='w-28 sm:w-32 lg:w-40' src={assets.logo} alt=""></img>
      </Link>


      <div>
        {/* how do we know the user is login / out we can do this with the help of useState() */}

        {/* if the user is login means user is true display 1st div 
        if the user is false then logout then display 2nd div */}

        {
        user ? 
        <div className='flex items-center gap-2 sm:gap-3'>
            <button onClick={()=>navigate("/buy")} className='flex items-center gap-2 bg-blue-100
            px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700 '>
                <img className='w-5' src={assets.credit_star} alt=""></img>
            <p className='text-xs sm:text-sm font-medium text-gray-600'>Credits left : {credit} </p>
            </button>
            <p className='text-gray-600 max-sm:hidden pl-4'>Hi ,{user.name} </p>
            <div className='relative group'>
                <img className='w-10 drop-shadow' src={assets.profile_icon} alt=""></img>
            <div className='absolute hidden group-hover:block top-0  z-10 text-black rounded pt-15'>
                <ul className='list-none m-0 p-2 bg-white rounded-md border text-sm'>
                    {/* // onclick add the function logout  
                    // defined int he appcontext*/}
                    <li onClick={logout} className='py-1 px-2 cursor-pointer pr-10'>Logout</li>
                </ul>

            </div>
            </div>
            
        </div>
        :
        <div className='flex items-center gap-2 sm:gap-5'>
            {/* here we use navigate to the buy page when click on it we cqn also use <link></link> */}
            <p onClick={()=>navigate("/buy")}  className=' cursor-pointer'>Pricing</p>
            <button className='bg-zinc-800 text-white px-10 py-2 sm:py-2 text-sm rounded-full cursor-pointer' onClick={()=>setShowLogin(true)}>Login</button>
        </div>
        }
       
        
        </div> 



    </div>
  )
}

export default Navbar
