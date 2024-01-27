import React, { useState } from 'react';
import { useEffect } from 'react';
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [useToken, setUseToken] = useState(false);
const handleSubmit = async () => {
    try {
        
    } catch (error) {
        
    }
}  



  return (
    <div className="flex items-center justify-center bg-slate-400 w-full h-screen">
      <div className="bg-white rounded w-[25rem] min-h-[20rem] flex flex-col p-2 items-center pl-[1.7rem] pr-[1.7rem]">
        <div className="relative w-full mt-3">
          <input 
            type="text" 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder=" " 
            className={`border-b-[2px] ${username && 'pt-6'} outline-none cursor-pointer w-full`}
          />
          <label htmlFor="username" className={`absolute top-0 left-0 transition-all ${username && 'text-base text-gray-500 pt-1'}`}>Username</label>
        </div>
        <div className="relative w-full mt-[1.5rem]">
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder=" " 
            className={`border-b-2 ${password && 'pt-6'} outline-none cursor-pointer w-full `}
          />
          <label htmlFor="password" className={`absolute top-0 left-0 transition-all ${password && 'text-base text-gray-500 pt-1'}`}>Password</label>
        </div>
        {useToken &&
        <div className="relative w-full mt-[1.5rem]">
        <input 
          type="text" 
          id="token" 
          value={token} 
          onChange={(e) => setToken(e.target.value)} 
          placeholder=" " 
          className={`border-b-2 ${token && 'pt-6'} outline-none cursor-pointer w-full `}
        />
        <label htmlFor="token" className={`absolute top-0 left-0 transition-all ${token && 'text-base text-gray-500 pt-1'}`}>Token</label>
      </div>

        }
        <div className="flex justify-between  w-full mt-[1.5rem]">
          <div>
          <input type="checkbox" id="remember" />
          <label htmlFor="remember" className="text-xs text-gray-500 ml-2">Remember me</label>
          </div>
          <div>
          <input type="checkbox" id="token" checked={useToken} 
          onChange={(e) => setUseToken(e.target.checked)}  />
          <label htmlFor="token" className="text-xs text-gray-500 ml-2">Use Token</label>
          </div>
        </div>
        <button onClick={handleSubmit()} className="w-full bg-blue-500 rounded text-white p-2 mt-[1.5rem] hover:bg-blue-700">Sign In</button>
        <div className="w-full flex flex-col mt-2">
        <span className="text-blue-600">Forgot username/password?{`>`}</span>
        <span className="text-blue-600">Not Enrolled? Sign Up Now.{`>`}</span>
        </div>
      </div>
    </div>
  );
}