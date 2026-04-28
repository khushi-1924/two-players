import React from 'react'
import { PiCircleBold } from 'react-icons/pi'
import { ImCross } from 'react-icons/im'

const Cell = ({ value, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-32 h-32 bg-[#0a0a2a] border border-blue-500 
                 text-4xl font-bold text-white 
                 flex items-center justify-center 
                 hover:bg-blue-900 transition 
                 hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]"
    >
      {value === 'X' && <ImCross className='text-pink-400 text-5xl' />}
      {value === 'O' && <PiCircleBold className='text-cyan-400 text-6xl' />}
    </button>
  )
}

export default Cell