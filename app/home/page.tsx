import React from 'react'
import Image from 'next/image'

const HomePage = () => {
  return (
    <div className="screen-container bg-gradient-to-b from-white to-[#bc49bf] h-fit min-h[100svh] !overflow-y-auto">
        <div className="light absolute z-50 inset-0 h-[80px] w-full"></div>

        <div className="mainbody min-h-screen bg-fixed inset-0">
            <div className="header top-0 px-[20px] fixed box flex-col gap-[21px] w-full h-fit">
              
              <div className="search gap-2 w-full h-[81px] box !justify-between flex-row !items-center">

              <button className='cursor-pointer flex-shrink-0 '>
                    <Image src='icons/inbox-icon.svg' alt='Fetch' height={28} width={28}/>
              </button>

              <div className="search-bar transition-all z-50 flex-shrink-0 justify-between w-[65vw] max-w-[400px] h-[35px] flex flex-row gap-[10px] px-[8px] overflow-hidden text-white rounded-full">
                
                <div className="flex items-center gap-[10px] justify-between w-full">
                
                <button className='w-[19px] h-[19px] flex-shrink-0'>

                <Image className='cursor-pointer' src='icons/search-icon.svg' alt='Fetch' height={19} width={19}/>
                </button>
                
                <input placeholder= "search" type="text" className="placeholder-white transition-all poppins bg-transparent  outline-none justify-between w-full text-white bg-none"/>

                </div>
                
              </div>

              <button className='cursor-pointer flex-shrink-0 '>
                  <Image src='icons/fetch-icon.svg' alt='Fetch' height={28} width={28}/>
              </button>
              
              </div>
              <div className="scores-topic">

              </div>
            </div>

            <div className="feed grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                <div className="graph box w-full h-fit gap-[24px]">
                    <div className="box gap-[10px] flex-col p-[25px] !justify-start white-opaque rounded-[40px] min-h-fit h-[288px]">
                      <div className="title-turn-play flex flex-row justify-between items-center h-fit w-full">

                        <div className="feed-text w-fit h-fit flex flex-row items-center justify-start gap-[10px]">
                          graph title
                        </div>

                        <div className="turn-play w-fit h-fit flex flex-row justify-end items-center gap-[5px]">
                          <div className="turn flex w-fit black-opaque h-fit px-[5px] py-[1px] items-center rounded-full box text-white">
                              turn 1
                          </div>
                          <button>
                            <Image className='cursor-pointer' src='icons/feed-play.svg' alt='Fetch' height={42} width={42}/>
                          </button>
                        </div>

                      </div>
                    </div>
                </div>
                <div className="graph box w-full h-fit gap-[24px]">
                    <div className="box gap-[10px] flex-col p-[25px] !justify-start white-opaque rounded-[40px] min-h-fit h-[288px]">
                      <div className="title-turn-play flex flex-row justify-between items-center h-fit w-full">

                        <div className="feed-text w-fit h-fit flex flex-row items-center justify-start gap-[10px]">
                          graph title
                        </div>

                        <div className="turn-play w-fit h-fit flex flex-row justify-end items-center gap-[5px]">
                          <div className="turn flex w-fit black-opaque h-fit px-[5px] py-[1px] items-center rounded-full box text-white">
                              turn 1
                          </div>
                          <button>
                            <Image className='cursor-pointer' src='icons/feed-play.svg' alt='Fetch' height={42} width={42}/>
                          </button>
                        </div>

                      </div>
                    </div>
                </div>
                <div className="graph box w-full h-fit gap-[24px]">
                    <div className="box gap-[10px] flex-col p-[25px] !justify-start white-opaque rounded-[40px] min-h-fit h-[288px]">
                      <div className="title-turn-play flex flex-row justify-between items-center h-fit w-full">

                        <div className="feed-text w-fit h-fit flex flex-row items-center justify-start gap-[10px]">
                          graph title
                        </div>

                        <div className="turn-play w-fit h-fit flex flex-row justify-end items-center gap-[5px]">
                          <div className="turn flex w-fit black-opaque h-fit px-[5px] py-[1px] items-center rounded-full box text-white">
                              turn 1
                          </div>
                          <button>
                            <Image className='cursor-pointer' src='icons/feed-play.svg' alt='Fetch' height={42} width={42}/>
                          </button>
                        </div>

                      </div>
                    </div>
                </div>

                <div className="graph box w-full h-fit gap-[24px]">
                    <div className="box gap-[10px] flex-col p-[25px] !justify-start white-opaque rounded-[40px] min-h-fit h-[288px]">
                      <div className="title-turn-play flex flex-row justify-between items-center h-fit w-full">

                        <div className="feed-text w-fit h-fit flex flex-row items-center justify-start gap-[10px]">
                          graph title
                        </div>

                        <div className="turn-play w-fit h-fit flex flex-row justify-end items-center gap-[5px]">
                          <div className="turn flex w-fit black-opaque h-fit px-[5px] py-[1px] items-center rounded-full box text-white">
                              turn 1
                          </div>
                          <button>
                            <Image className='cursor-pointer' src='icons/feed-play.svg' alt='Fetch' height={42} width={42}/>
                          </button>
                        </div>

                      </div>
                    </div>
                </div>


            </div>

        </div>
            <div className="transcript transition-all text-white fixed bottom-0 h-[125px] w-full rounded-t-[40px]">
    
                <button className="tab transition-all flex flex-col gap-[10px] py-[6px] w-full items-center">
                  <div className="white-opaque transition-all opacity-40 w-[48px] h-[5px] rounded-full"></div>
                </button>

                <div className="meta transition-all w-full h-full">

                  <div className="h-[50px] flex justify-between w-full">

                    <div className="speaker w-fit transition-all h-full flex-row items-start justify-start gap-[10px]">
                    <button>
                        <div className="profile flex transition-all items-center justify-center rounded-full">
                          <Image src='icons/profile-icon.svg' alt='Fetch' height={46} width={46}/>
                        </div>
                    </button>

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