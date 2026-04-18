import React, { useState } from 'react'

const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className='text-center p-4 bg-gradient-to-br from-[#020229] to-[#00001c] min-h-screen w-screen flex flex-col items-center'>
      <h1 className='text-4xl p-3 text-purple-900'>Two Player Games</h1>

      <div className='h-1/2 w-1/3 my-24 py-6 bg-white/10 rounded-lg border border-white shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-300'>
        <p className='text-center text-sky-200 text-4xl py-4 font-semibold'>Register</p>

        <form className='flex flex-col justify-center items-center p-10 gap-6 w-full'>
          <input type="text" onChange={(e) => setName(e.target.value)} placeholder='Name' value={name} className='w-3/4 bg-white/20 text-white text-lg placeholder:text-white/50 rounded-full px-6 py-3 outline-none ring-0 focus:ring-2 focus:ring-white transition-all duration-300' />

          <input type="text" onChange={(e) => setUsername(e.target.value)} placeholder='Username' value={username} className='w-3/4 bg-white/20 text-white text-lg placeholder:text-white/50 rounded-full px-6 py-3 outline-none ring-0 focus:ring-2 focus:ring-white transition-all duration-300' />

          <input type="text" onChange={(e) => setPassword(e.target.value)} placeholder='Password' value={password} className='w-3/4 bg-white/20 text-white text-lg placeholder:text-white/50 rounded-full px-6 py-3 outline-none ring-0 focus:ring-2 focus:ring-white transition-all duration-300' />

          <button type='submit' className='w-1/2 bg-blue-300 rounded-xl text-black text-xl p-4 mt-2 hover:bg-blue-400 transition-all duration-200 hover:-translate-y-1'>Sign Up</button>
        </form>
    </div>
    </div >
  )
}

export default Signup
