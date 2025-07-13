import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/userContext'

const Customize2 = () => {
  const {userData} = useContext(userDataContext)
  const [AssistantName,setAssistantName]=useState(userData?.AssistantName||"")
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#04049ab4] flex justify-center items-center flex-col p-[20px] '>
      
      <h1 className='text-white text-[30px] text-center mb-[30px]'>
        Enter your <span className='text-blue-200'>Assistant Name</span>
      </h1>

      <input type="text" placeholder='eg:ChatGPT' className='w-full max-w-[600px] h-[60px] 
      outline-none border-2 border-white bg-transparent  text-white placeholder-gray-300 
      px-[20px] py-[10px] rounded-full text-[18px]'
      required onChange={(e)=>setAssistantName(e.target.value)} value={AssistantName}/>

      {AssistantName&&<button className='min-w-[250px] h-[60px] mt-[30px] text-black font-semibold 
        bg-white rounded-full text-[19px]'>Start your conversation!</button>}
    </div>
    
    
  )
}

export default Customize2