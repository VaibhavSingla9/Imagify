import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { motion } from "motion/react"
import { AppContext } from '../context/AppContext'
const Result = () => {
  // this is fro the once generate button  is clicked then the input and image should remove only download and generate another will be there
  // here we give the image  as sample image 
  const [image , setImage] = useState(assets.sample_img_1)

  // means initially image is not loaded
  const [isImageLoaded , setImageLoaded] = useState(false);

  // to set the loading.... 
  // initailly the loading is false
  // means the loading will not diaplay initailly 

  const [loading , setLoading] = useState(false);


  const [input , setInput] = useState('');
  const {generateImage} =  useContext(AppContext)

 
  // submit handler function
  const onSubmitHandler = async (e)=>{
    e.preventDefault()
    setLoading(true)
    // if input is available means there is some prompt
    if(input){
      const image = await generateImage(input)

      if(image){
        setImageLoaded(true)  // setImageLoaded true
        setImage(image)
      }
    }
    setLoading(false)
  }

  return (
    // will complete later after backend 
    <motion.form 
    initial = {{opacity : 0.2 ,y:100}}
    transition={{duration : 1}}
    whileInView={{opacity :1 , y : 0}}
    viewport={{once : true}}
    onSubmit={onSubmitHandler} className='flex flex-col min-h-[90vh] justify-center items-center'>
    <div>
      <div className='relative'>
        <img className='max-w-xs rounded' src={image} alt=""></img>
        {/* // when the loading is true then width will full and when the loading is false the width will be zero   */}
        <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${loading ? 'w-full transition-all duration-[10s]' :'w-0' }`}/>
        </div>
        {/* // when the value of !loading is true it will be hidden and !hidden is false then it will be shown  */}
        <p className={!loading ? "hidden" : " "}>Loading....</p>
    </div>


    {/* whenever the image is not loaded display this div w with uunput and generate bottom  */}
    {/* when image loadd is false then display this  */}
    {!isImageLoaded && 
    <div className='flex w-full max-w-xl text-white bg-neutral-500 text-sm p-0.5 mt-10 rounded-full'>
      <input
      onChange={e=> setInput(e.target.value)} value = {input} 
      type="text" placeholder="what you want to generate " className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color'></input>
      <button type="Submit" className='bg-zinc-900 px-10 sm:px-16 py-3 rounded-full'>Generate</button>
    </div>

     }

{/* // when the image is loaded then we will show this div means when image is loaded then we can download the image or generate another */}
{/* when image loaded is true display this  */}
     {isImageLoaded &&
    <div className='flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full'>
      {/* // when we click on generate anothwer it make the setImageloaded to false means now the div with input and generate button div appear */}
      <p  onClick={()=>{setImageLoaded(false)}} className='bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer'>Generate Another</p>
      {/* // here we will provide the image link which we want to download  */}

      {/* image is deinfed in the useState */}
      <a href={image} download className='bg-zinc-900 px-10 py-3 rounded-full cursor-pointer'>Download</a>
    </div>

     }

    </motion.form>
  )
}

export default Result
