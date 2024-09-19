'use client'

import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';  // Use `next/navigation` for app directory
import { useState } from 'react';
export default function Home() {

    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleInputFocus = () => {
        setDrawerOpen(true);
    }

    const handleInputBlur = () => {
        setDrawerOpen(false); // Collapse the drawer when input loses focus
      };
 
  return (
    <div className="screen-container min-h-screen bg-[url('/bg/startingBg.webp')] bg-cover bg-center">
      
      <div className="drawer-screen lg:justify-center h-full gap-[12px]">

        <div className="pulp box flex-col gap-[10px] pb-[7px]">
          <div className="logo-container">
            <Image 
              src="/logo.svg" 
              alt="Logo" 
              width={150} 
              height={41} 
              className="block mx-auto"
            />
          </div>
          <div className="text text-white text-[20px] text-center">
            breaking it down
          </div>
        </div>
        <div className={`box drawer transition-all lg:h-fit lg:py-[40px] lg:w-[420px] lg:rounded-[40px] flex-col rounded-t-[40px] px-[20px] pb-[20px] pt-[30px] gap-[20px] ${drawerOpen ? 'h-3/4' : 'h-[195px]'}`}>

            <div className="auth-text">
                enter your email
            </div>

            <input 
            onFocus={handleInputFocus}
            type="email"
            className="input text-white black-opaque transition-all p-2 focus:outline-none focus:ring-2 focus:ring-white text-xl">

            </input>

            <div className={`disclaimer lg:!flex transition-all poppins-regular ${drawerOpen ? '!flex' : '!hidden'}`}>
                by entering you agree to recieve emails from us.
            </div>
            <button
            type="submit"
            className={`!text-black enter lg:!flex box starting-button white-opaque starting-text hover:scale-105 transition-all ${drawerOpen ? '!flex' : '!hidden'}`}>
            
            enter
          </button>
          
        </div>
        
        </div>
      
    </div>
  );
}
