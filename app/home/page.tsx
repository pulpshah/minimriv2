import React from 'react'
import Image from 'next/image'

const HomePage = () => {
  return (
    <div className="screen-container h-full min-h[100svh]">
        <div className="light absolute z-50 inset-0 h-[80px] w-full"></div>

        <div className="mainbody bg-gradient-to-b from-white to-[#bc49bf]">

            <div className="header box flex-col gap-[21px] w-full h-fit px-[20px]">
              <div className="search w-full h-[81px] box !justify-center flex-row items-center">

              <div className="inbox">
                <div className="icon w-[28px] h-[28px]">
                  <Image src='icons/inbox-icon.svg' alt='Fetch' height={28} width={28}/>
                </div>
              </div>

              <div className="search-bar w-full h-[35px] flex gap-[10px] px-[8px]">1</div>
              <div className="fetch">
                <div className="icon w-[28px] h-[28px]">
                  <Image src='icons/fetch-icon.svg' alt='Fetch' height={28} width={28}/>
                </div>
              </div>
              
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