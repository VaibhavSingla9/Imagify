import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { delay, motion } from "motion/react"  // add this line where you want to add animation
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
const Header = () => {
  const {user, setShowLogin} = useContext(AppContext);

  const navigate = useNavigate();

  // to check whether the user is login or logged out 

  // if the user is ture means it is user then navigate to the result page 
  // else means not a user then set showLogin to true and login page will be shown 

  // used in the generate image button
  const onClickHandler = ()=>{
    if(user){
      navigate('/result')
    }else{
      setShowLogin(true)
    }
  }
  return (
    <motion.div className='flex flex-col justify-center items-center text-center my-15'
    initial={{opacity:0.2 , y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1 , y:0}}
    viewport={{once:true}}
    >
      <motion.div className='text-stone-500 inline-flex text-center gap-2 bg-white px-6 py-1 rounded-full border border-neutral-500' 
      initial={{opacity:0 , y:-20}}
      animate={{opacity:1 , y:0}}
      transition={{ delay : 0.2, duration:0.8}}
      >
        <p>Best text to image generator</p>
        <img src={assets.star_icon} alt=""></img>
      </motion.div>


      <motion.h1 className='text-4xl max-w-[300px] sm:text-5xl sm:max-w-[500px] mx-auto mt-6 text-center'>Turn text to <span className='text-blue-600'
      initial = {{opacity:0}}
      animate = {{opacity:1}}
      transition = {{delay:0.4 , duration:2}}
      >image</span>, in seconds.</motion.h1>

      <motion.p className='text-xs text-center max-w-xl mx-auto mt-5 sm:max-w-[450px]'
      initial = {{opacity:0 , y:20}}
      animate = {{opacity:1 , y:0}}
      transition = {{delay:0.6 , duration:0.8}}
      >Unleash your creativity with AI. Turn your imagination into visual art in seconds - just type, and watch the magic happen.</motion.p>

      <motion.button onClick={onClickHandler} className='sm:text-xl text-white bg-black w-auto mt-5 px-12 py-2 flex items-center gap-2 rounded-full cursor-pointer'
      whileHover={{scale : 1.05}}
      whileTap={{scale : 0.95}}
      initial = {{opacity:0}}
      animate ={{opacity:1}}
      transition={{default:{duration:0.5},opacity:{delay:0.8,duration:1}}}
      >
        Generate Images
        <img className='h-6' src={assets.star_group} alt=""></img>
      </motion.button>

      <motion.div className='flex flex-wrap justify-center mt-10 gap-3'
      initial = {{opacity:0 }}
      animate = {{opacity:1 }}
      transition = {{delay:1 , duration:1}}
      >
        {Array(6).fill('').map((items, index)=>(
            <motion.img 
            whileHover={{scale:1.05 , duration:0.1}}
            className='rounded hover:scale-105 transition-all duration-300 cursor-pointer max-sm:w-10' 
            src={index%2==0 ? assets.sample_img_2 : assets.sample_img_1} alt="" key ={index} width={70}></motion.img>
        ))}
        {/* if index is divisible by 2 then display sample image2 otherwise display sample image1 */}
      </motion.div>

      <motion.p 
      initial = {{opacity:0 }}
      animate = {{opacity:1 }}
      transition = {{delay:1.2 , duration:0.8}}
      className='mt-2 text-neutral-600'>Generated images from imagify</motion.p>

    </motion.div>
  )
}

export default Header
