import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'


const Home = () => {
  
  const {userData,serverUrl,setUserData,getGeminiResponse} = useContext(userDataContext)
  const navigate = useNavigate()

  const [listening,setListening]=useState(false)
  const isSpeakingRef=useRef(false)
  const recognitionRef=useRef(null)
  const synth=window.speechSynthesis



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
    try{
      recognitionRef.current?.start();
      setListening(true);
    }
    catch(error){
      if(!error.message.includes("start")){
        console.error("Recognition error:", error);
      }
    }
  };


  
  //setting up speak functionality
  const speak=(text)=>{
    const utterence = new SpeechSynthesisUtterance(text);   //inbuilt-in function to convert text to speech
    isSpeakingRef.current = true; //set isSpeakingRef to true when speaking starts
    utterence.onend=() =>{
      isSpeakingRef.current = false; //set isSpeakingRef to false when speaking ends
      startRecognition();
    }
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
    recognitionRef.current = recognition;

    const isRecognizingRef={current: false}; //to check if the recognition is already in progress 

    const safeRecognition=()=>{
      if(!isSpeakingRef.current && !isRecognizingRef.current){
        try {
          recognition.start(); //start the speech recognition
          console.log("Recognition started");
        } catch (err) {
          if(err.name !== 'InvalidStateError'){
            console.error("Start error:", err );
          }
          
        }
      }
    }
    recognition.onstart = () => {
      console.log("Recognition started");
    isRecognizingRef.current = true;     //recognition is in progress
    setListening(true);
  };
    recognition.onend = () => {
      console.log("Recognition ended");
    isRecognizingRef.current = false;
    setListening(false);
    if(!isSpeakingRef.current){
      setTimeout(() => {
        safeRecognition(); //restart the recognition after 1 second if not speaking
      }, 1000);
    }
  };

     recognition.onerror = (event) => {
    console.warn("Recognition error:", event.error);
    isRecognizingRef.current = false;
    setListening(false);
    if (event.error !== "aborted" && !isSpeakingRef.current) {
      setTimeout(() => {
        safeRecognition(); 
      }, 1000);
    }
  };


    recognition.onresult=async(e)=>{
    const transcript = e.results[e.results.length - 1][0].transcript.trim();   //inside trancript we have our speech converted into text
    console.log("heard:"+ transcript);

    //if the transcript includes the assistant name, then we can give response
    if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
      recognition.stop(); 
      isRecognizingRef.current = false; 
      setListening(false); 
    const data=await getGeminiResponse(transcript);
    handleCommand(data); 
    }
  }
  const fallback=setInterval(() => {
    if(!isRecognizingRef.current && !isSpeakingRef.current){
      safeRecognition(); //if not recognizing and not speaking, then start the recognition
    }
  } , 10000); 
  safeRecognition();

  return () => {
    recognition.stop();
    setListening(false);
    isRecognizingRef.current = false;
    clearInterval(fallback);
  }
}, [])







  
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] 
    flex justify-center items-center flex-col gap-[15px]'>
    
    <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px]  bg-white rounded-full cursor-pointer text-[19px] ' onClick={handleLogOut}>Log Out</button>
    <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold  bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block ' onClick={()=>navigate("/customize")}>Customize your Assistant</button>
      
    <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
    <img src={userData?.assistantImage} alt="" className='h-full object-cover'/>
</div>
      <h1 className='text-white text-[18px] font-semibold'>I'm  {userData?.assistantName}</h1>
    
    

    </div>
  )
}

export default Home