import React from 'react'
import Image from 'next/image'
import FeedItem
 from '@/components/feedItem'
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#bc49bf]">
        
        <div className="light bg-gradient-to-b from-[#ffffff60] to-[#bb49bf00] absolute z-50 inset-0 h-[80px] w-full"></div>


        <div className="mainbody h-screen w-full pt-[125px] pb-[150px] bg-none overflow-y-auto scroll-smooth">

            <div className="feed w-full h-fit items-center justify-center flex">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 w-full h-fit gap-[24px]">
                <FeedItem></FeedItem>
                <FeedItem></FeedItem>
                <FeedItem></FeedItem>
                <FeedItem></FeedItem>
                <FeedItem></FeedItem>
                <FeedItem></FeedItem>
                <FeedItem></FeedItem>
                <FeedItem></FeedItem>
                <FeedItem></FeedItem>
                <FeedItem></FeedItem>
              </div>
            </div>
            <div className="header top-0 px-[20px] pb-[15px] fixed box flex-col w-full h-fit bg-gradient-to-b from-[#ffffff] to-[#bb49bf00]">
              
              <div className="search z-20 gap-2 w-full h-[81px] box !justify-between flex-row !items-center">

              <button className='cursor-pointer flex-shrink-0 '>
                    <Image src='icons/inbox-icon.svg' alt='Fetch' height={35} width={35}/>
              </button>

              <div className="search-bar backdrop-blur-[50px] transition-all z-20 flex-shrink-0 justify-between w-[65vw] max-w-[600px] h-[35px] max-h-[50px] flex flex-row gap-[10px] px-[8px] overflow-hidden text-white rounded-full">
                
                <div className="flex items-center gap-[10px] justify-between w-full">
                
                <button className='w-[19px] h-[19px] flex-shrink-0'>

                <Image className='cursor-pointer' src='icons/search-icon.svg' alt='Fetch' height={19} width={19}/>
                </button>
                
                <input placeholder= "search" type="text" className="placeholder-white transition-all poppins bg-transparent  outline-none justify-between w-full text-white bg-none"/>

                </div>
                
              </div>

              <button className='cursor-pointer flex-shrink-0 '>
                  <Image src='icons/fetch-icon.svg' alt='Fetch' height={35} width={35}/>
              </button>
              
              </div>
              <div className="scores-topic flex justify-between items-center white-opaque backdrop-blur-[50px] w-full max-w-[400px] h-fit px-[20px] py-[1px] rounded-full">
                  <div className="points-1 w-fit text-[.8rem] h-fit text-black poppins">
                    KH: 1200 pts
                  </div>

                  <div className="points-1 w-fit h-fit text-[1rem] text-black">
                    gun control
                  </div>

                  <div className="points-1 w-fit text-[.8rem] h-fit text-black poppins">
                    DT: 1500 pts
                  </div>
              </div>
            </div>

        </div>

            <div className="transcript z-40 transition-all text-white fixed bottom-0 h-[125px] w-full rounded-t-[40px]">
    
                <button className="tab transition-all flex flex-col gap-[10px] py-[6px] w-full items-center">
                  <div className="white-opaque transition-all opacity-40 w-[48px] h-[5px] rounded-full"></div>
                </button>

                <div className="meta transition-all w-full h-full">

                  <div className="h-[50px] flex justify-between w-full">

                    <div className="speaker flex w-fit transition-all h-full flex-row items-start justify-start gap-[10px]">
                    <button>
                        <div className="profile flex transition-all items-center justify-center rounded-full">

                          <Image src='icons/profile-icon.svg' alt='Fetch' height={46} width={46}/>
                        </div>
                    </button>
                    <div className="name-stats w-fit h-fit flex flex-col justify-start text-black text-[1.125rem]">
                          <div className="name text !text-left">
                            Kamala Harris
                          </div>
                          <div className="stats text flex h-fit w-fit gap-[5px] text[1rem] poppins">
                            <div className="time-turn text flex flex-row gap-[4px]">
                              <div className="time text !text-left">10:42</div>
                              <div className="text !text-left">•</div>
                              <div className="turn text !text-left">Turn 5</div>
                            </div>
                            <div className="">,</div>
                            <div className="sentiment text !text-left">
                              Upset
                            </div>
                          </div>
                        </div>

                    </div>
                    <button>
                    <div className="play text-white transition-all flex-shrink-0">
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