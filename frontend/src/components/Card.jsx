import React from 'react'

const Card = ({image}) => {
  return (
    <div className='w-[150px] h-[250px] bg-[#030326] border-2 border-[#0000ff49] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white'>
        <img src={image} className='h-full object-cover'></img>
    </div>
  )
}

export default Card