import React from 'react'
import Image from 'next/image'

const HomePage = () => {
  return (
    <div className="screen-container h-full min-h[100svh]">
        <div className="light absolute z-50 inset-0 h-[80px] w-full"></div>

        <div className="mainbody bg-gradient-to-b from-white to-[#bc49bf]">

            <div className="header box flex-col gap-[21px] w-full h-fit">
              
              <div className="search gap-2 w-full h-[81px] box !justify-between flex-row !items-center">

              <button className='cursor-pointer'>
                    <Image src='icons/inbox-icon.svg' alt='Fetch' height={28} width={28}/>
              </button>

              <div className="search-bar flex-shrink-0 justify-between w-[65vw] max-w-[400px] h-[35px] flex flex-row gap-[10px] px-[8px]">

                <Image src='icons/search-icon.svg' alt='Fetch' height={19} width={19}/>
              </div>

              <button className='cursor-pointer'>
                  <Image src='icons/fetch-icon.svg' alt='Fetch' height={28} width={28}/>
              </button>
              
              </div>
              <div className="scores-topic">

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

                    <div className="speaker w-fit h-full flex-row items-start justify-start gap-[10px]">
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