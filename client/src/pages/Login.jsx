import React from 'react'

const Login = () => {
  return (
    <div className='text-center p-4 bg-gradient-to-br from-[#020229] to-[#00001c] min-h-screen w-screen flex flex-col items-center'>
      <h1 className='text-4xl p-3 text-purple-900'>Two Player Games</h1>

      <div className='h-1/2 w-1/3 my-24 py-6 bg-white/10 rounded-lg border border-white'>
        <p className='text-center text-sky-200 text-4xl py-4 font-semibold'>Login</p>

        <div className='flex flex-col justify-center items-center p-10 gap-6 w-full'>
          <input type="text" placeholder='Username' className='w-3/4 bg-white/20 text-white text-lg placeholder:text-white/50 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-white/50' />

          <input type="text" placeholder='Password' className='w-3/4 bg-white/20 text-white text-lg placeholder:text-white/50 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-white/50' />
        
          <input type="text" placeholder='Name' className='w-3/4 bg-white/20 text-white text-lg placeholder:text-white/50 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-white/50' />

          <button type='submit' className='w-1/2 bg-blue-300 rounded-xl text-black text-xl p-4 mt-2 hover:bg-blue-400 transition-all duration-200 hover:-translate-y-1'>Login</button>
        </div>
      </div>
    </div>
  )
}

export default Login
