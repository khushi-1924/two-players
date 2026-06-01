import React from 'react'
import { PiCircleBold } from 'react-icons/pi'
import { ImCross } from 'react-icons/im'

const Cell = ({ value, onClick, isWinning }) => {
  return (
    <button
      onClick={onClick}
      className={`w-32 h-32 ${isWinning ? 'bg-[#0a2a17] border border-green-500 hover:bg-green-900 transition hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-[#0a0a2a] border border-blue-500'} text-4xl font-bold text-white flex items-center justify-center hover:bg-blue-900 transition hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]`}
    >
      {value === 'X' && <ImCross className='text-pink-400 text-5xl animate-pop' />}
      {value === 'O' && <PiCircleBold className='text-cyan-400 text-6xl animate-pop' />}
    </button>
  )
}

export default Cell