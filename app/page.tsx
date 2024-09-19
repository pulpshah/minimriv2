'use client'

import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';  // Use `next/navigation` for app directory
import { useState } from 'react';
export default function Home() {

  const correctPin = "pulpdemo";
  const [enteredPin, setEnteredPin] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (enteredPin === correctPin) {
      router.push("/auth"); // Redirect to a restricted page
    } else {
      setError('Incorrect PIN. Please try again.');
    }
};


  return (
    <div className="screen-container h-full min-h-screen bg-[url('/bg/startingBg.webp')] bg-cover bg-center">
      <div className="absolute z-0 inset-0 bg-black opacity-50"></div>
      
      <div className="contained z-10 flex flex-col gap-[20px] px-[6vw]">
        
        {/* Logo Section */}
        <div className="logo box flex justify-center items-center">
          <div className="logo-container">
            <Image 
              src="/logo.svg" 
              alt="Logo" 
              width={150} 
              height={41} 
              className="block mx-auto"
            />
          </div>
        </div>
        
        {/* Pin Section */}
        <div className="box flex-col gap-[20px]">

          <div className="auth-text">
            enter pin
          </div>
          
        <form 
        className="box flex-col gap-[20px]"
        onSubmit={handleSubmit}>
          <input 
          type="password"
          value={enteredPin}
          onChange={(e) => setEnteredPin(e.target.value)}
          className="input white-opaque transition-all p-2 focus:outline-none focus:ring-2 focus:ring-white text-xl">

          </input>


          <button
            type="submit"
            className="enter box starting-button black-opaque starting-text hover:scale-105 transition-all"
            >
            enter
          </button>
            {error && (
                <p className="text-red-500 text-sm">{error}</p>  // Error message
              )}
        </form>

        </div>
        
      </div>
    </div>
  );
}
