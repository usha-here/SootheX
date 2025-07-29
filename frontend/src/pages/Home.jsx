import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import aiImg from '../assets/ai.gif'
import userImg from '../assets/user.gif'
import { RiMenuUnfold2Line } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";

const Home = () => {
  
  const {userData,serverUrl,setUserData,getGeminiResponse} = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening,setListening]=useState(false)
  const[userText, setUserText]=useState("")  //user input text
  const [aiText, setAiText]=useState("")     //ai response text
  const isSpeakingRef=useRef(false)
  const recognitionRef=useRef(null)
  const isRecognizingRef=useRef(false) //to check if recognition is in progress
  const synth=window.speechSynthesis
  const [ham,setHam]=useState(false)

  const handleLogOut=async ()=>{
    try {
      const result=await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
    try{
      recognitionRef.current?.start();
      console.log("Recognition requested to start");
    }
    catch(error){
      if(error.name !== 'InvalidStateError'){
        console.error("Start error:", error);
      }
    }
  }
  };


  
  //setting up speak functionality
  const speak=(text)=>{
    const utterence = new SpeechSynthesisUtterance(text);   //inbuilt-in function to convert text to speech
    utterence.lang = 'hi-IN'; 
    const voices=window.speechSynthesis.getVoices(); 
    const hindiVoice=voices.find(v=>v.lang === 'hi-IN')
    if(hindiVoice){
      utterence.voice=hindiVoice; //set the voice to hindi
    } 


    isSpeakingRef.current = true; //set isSpeakingRef to true when speaking starts
    utterence.onend=() =>{
      setAiText(""); //clear the ai text after speaking
      isSpeakingRef.current = false; //set isSpeakingRef to false when speaking ends
      setTimeout(() => {
        startRecognition();
      }, 800);
    }
    synth.cancel(); //cancel any ongoing speech
    synth.speak(utterence); //speak the text

  }
  const handleCommand=(data)=>{
    const {type,userInput,response}=data
      speak(response);
    
    if (type === 'google-search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
     if (type === 'calculator-open') {
  
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }
     if (type === "instagram-open") {
      window.open(`https://www.instagram.com/`, '_blank');
    }
    if (type ==="facebook-open") {
      window.open(`https://www.facebook.com/`, '_blank');
    }
     if (type ==="weather-show") {
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    }

    if (type === 'youtube-search' || type === 'youtube-play') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }
  }

  //setting up web speech api
  useEffect(()=>{

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();   //recognition is object of SpeechRecognition()
    recognition.continuous = true; //to keep listening
    recognition.lang = 'en-US'; //convert speech into english language
    recognition.interimResults = false; //to get the interim results while speaking
    recognitionRef.current = recognition;
    let isMounted = true;

    const startTimeout=setTimeout(()=>{
      if(isMounted && !isSpeakingRef.current && !isRecognizingRef.current){
        try{
          recognition.start();
          console.log("Recognition requested to start");
        } catch (e) {
          if(e.name !== 'InvalidStateError'){
            console.error(e);
          }
        }
     }
    }, 1000);

    recognition.onstart = () => {
    isRecognizingRef.current = true;     //recognition is in progress
    setListening(true);
  };

  recognition.onend = () => {
    isRecognizingRef.current = false;
    setListening(false);
    if(isMounted && !isSpeakingRef.current){
      setTimeout(() => {
        if(isMounted){
        try{
          recognition.start();
          console.log("Recognition started");
        } catch (e) {
          if(e.name !== 'InvalidStateError') console.error(e);
        } 
      }
      }, 1000);
    }
  };

     recognition.onerror = (event) => {
    console.warn("Recognition error:", event.error);
    isRecognizingRef.current = false;
    setListening(false);
    if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
      setTimeout(() => {
        if(isMounted){
          try{
            recognition.start();
            console.log("Recognition restarted after error");
          } catch (e) {
            if (e.name !== 'InvalidStateError') console.error(e);
          }
        }
      }, 1000);
    }
  };


    recognition.onresult=async(e)=>{
    const transcript = e.results[e.results.length - 1][0].transcript.trim();   //inside trancript we have our speech converted into text
    console.log("heard:"+ transcript);

    //if the transcript includes the assistant name, then we can give response
    if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
      setAiText("");
      setUserText(transcript);
      recognition.stop(); 
      isRecognizingRef.current = false; 
      setListening(false); 
    const data=await getGeminiResponse(transcript);
    handleCommand(data); 
    setAiText(data.response); //set the ai text to response
    setUserText(""); //clear the user text after getting response
  }
  }

  return () => {
    isMounted = false;
    clearTimeout(startTimeout);
    recognition.stop();
    setListening(false);
    isRecognizingRef.current = false;
  }
}, [])

  
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] 
    flex justify-center items-center flex-col gap-[15px] overflow-hidden'>
    <RiMenuUnfold2Line className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer' onClick={()=>setHam(true)}/>
    <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham?"translate-x-0":"translate-x-full"} transition-transform`}>
     <RxCross1 className=' text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer ' onClick={()=>setHam(false)}/>
<button className='min-w-[150px] h-[60px]  text-black font-semibold   bg-white rounded-full cursor-pointer text-[19px] ' onClick={handleLogOut}>Log Out</button>
      <button className='min-w-[150px] h-[60px]  text-black font-semibold  bg-white  rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] ' onClick={()=>navigate("/customize")}>Customize your Assistant</button>

<div className='w-full h-[2px] bg-gray-400'></div>
<h1 className='text-white font-semibold text-[19px]'>History</h1>

<div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
  {userData.history?.map((his)=>(
    <div className='text-gray-200 text-[18px] w-full h-[30px]  '>{his}</div>
  ))}

</div>


    </div>
    <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px]  bg-white rounded-full cursor-pointer text-[19px] ' onClick={handleLogOut}>Log Out</button>
    <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold  bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block ' onClick={()=>navigate("/customize")}>Customize your Assistant</button>
      
    <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
    <img src={userData?.assistantImage} alt="" className='h-full object-cover'/>
</div>
      <h1 className='text-white text-[18px] font-semibold'>I'm  {userData?.assistantName}</h1>
      
      {!aiText && <img src={userImg} alt="" className='w-[200px]'/>}
      {aiText && <img src={aiImg} alt="" className='w-[200px]'/>}
    
    <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText?userText:aiText?aiText:null}

    </h1>
    </div>
  )
}

export default Home