import React from 'react'
import Image from 'next/image'

const HomePage = () => {
  return (
    <div className="screen-container h-full min-h[100svh]">
        <div className="light absolute z-0 inset-0 h-[50px] backdrop-blur-[50px] opacity-10"></div>

        <div className="mainbody bg-gradient-to-b from-white to-[#bc49bf]">

            <div className="flex-col w-fit h-fit gap-y-[21px] items-center justify-center">
              <div className='flex-row justify-between items-center text-black'>
                <button>
                  <Image src='icons/inbox-icon.svg' alt='Inbox' height={28} width={28}/>
                </button>
                <input></input>
                
                <button>
                  <Image src='icons/fetch-icon.svg' alt='Fetch' height={28} width={28}/>
                </button>
              </div>

            </div>

            <div className="feed">
                1
            </div>

        </div>
            <div className="transcript text-white fixed bottom-0 h-[125px] w-full rounded-t-[40px]">
                <div className="tab flex flex-col gap-[10px] py-[6px] w-full items-center">
                  <div className="bg-[#9c9c9c] w-[48px] h-[5px] rounded-full"></div>
                </div>

                <div className="meta w-full h-full">

                  <div className="h-[50px] flex justify-between w-full">

                    <div className="speaker w-fit h-full flex-row items-start justify-start gap-[10px] px-[11px]">
                    <button>
                        <div className="profile flex items-center justify-center rounded-full">
                          <Image src='icons/profile-icon.svg' alt='Fetch' height={46} width={46}/>
                        </div>
                    </button>

                    </div>
                    <button>
                    <div className="play text-white flex-shrink-0">
                      <Image src='icons/play-icon.svg' alt='play' height={50} width={50}/>
                    </div>
                    </button>
                  </div>

                </div>
            </div>
    </div>

  )
}

export default HomePage