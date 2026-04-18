import React from 'react'

const Cell = ({ value }) => {
    return (
        <div>
            <button className="w-32 h-32 bg-[#0a0a2a] border border-blue-500 
                       text-2xl font-bold text-white 
                       flex items-center justify-center 
                       hover:bg-blue-900 transition hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                {value}
            </button>
        </div>
    )
}

export default Cell