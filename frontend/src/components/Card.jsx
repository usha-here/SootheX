import { useContext} from 'react'
import { userDataContext } from '../context/userContext'

const Card = ({image}) => {
    const {serverUrl,userData,setUserData,backendImage,setBackendImage,
        frontendImage, setFrontendImage,selectedImage,setSelectedImage} = useContext(userDataContext)
  return (
    <div className={`w-[70px] h-[140 px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#0000ff49] 
    rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4
    hover:border-white ${selectedImage==image?"border-4 border-white shadow-2xl shadow-blue-50":null}`} 
    onClick={()=>{
      setSelectedImage(image)
      //if selected from the 7 given images, then backendImage and frontendImage shhould be null
      setBackendImage(null)
      setFrontendImage(null)
      }}>
        <img src={image} className='h-full object-cover'></img>
    </div>
  )
}

export default Card