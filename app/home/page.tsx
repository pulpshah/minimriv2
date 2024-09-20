'use client'

import React, {useState} from 'react'
import Image from 'next/image'
import FeedItem from '@/components/FeedItem'
import JFile from "@/public/data/dummydata.json";

const HomePage = () => {
  const [isTranscriptOpen, setTranscriptOpen] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(0);

  const turnsData = JFile.analysis;
  const currentData = turnsData[currentTurn];
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const toggleTranscript = () => {
    setTranscriptOpen(!isTranscriptOpen);
  };
  
  const handleNextClick = () => {
    setCurrentTurn((prevTurn) => {
      return prevTurn < turnsData.length - 1 ? prevTurn + 1 : 0;
    });
  };

  const handleBackClick = () => {
    setCurrentTurn((prevTurn) => {
      return prevTurn > 0 ? prevTurn - 1 : turnsData.length - 1;
    });
  };

  const formatTalkTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle swipe up
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.changedTouches[0].clientY);
    if (touchStart - touchEnd > 50) {
      // Swipe up
      setTranscriptOpen(true);
    } else if (touchEnd - touchStart > 50) {
      // Swipe down
      setTranscriptOpen(false);
    }
  };

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

        <div
          className={`transcript z-40 transition-all text-white fixed bottom-0 ${isTranscriptOpen ? 'h-[50vh]' : 'h-[125px]'} w-full rounded-t-[40px]`}
          onClick={toggleTranscript}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
    
            <button className="tab transition-all flex flex-col gap-[10px] py-[6px] w-full items-center" onClick={toggleTranscript}>
            <div className="white-opaque transition-all opacity-40 w-[48px] h-[5px] rounded-full"></div>
          </button>

        <div className="meta transition-all w-full h-full">
          <div className="h-[50px] flex justify-between w-full">
            <div className="speaker flex w-fit transition-all h-full flex-row items-start justify-start gap-[10px]">
              <button>
                <div className="profile flex transition-all items-center justify-center rounded-full">
                  <Image src="icons/profile-icon.svg" alt="Fetch" height={46} width={46} />
                </div>
              </button>
              <div className="name-stats w-fit h-fit flex flex-col justify-start text-black text-[1.125rem]">
                <div className="name text !text-left">
                  {currentData.speaker_name || "Unknown Speaker"}
                </div>
                <div className="stats text flex h-fit w-fit gap-[5px] text[1rem] poppins">
                  <div className="time-turn text flex flex-row gap-[4px]">
                    <div className="time text !text-left">
                      {formatTalkTime(currentData.talk_time)} {/* Converted talk time */}
                    </div>
                    <div className="text !text-left">•</div>
                    <div className="turn text !text-left">
                      Turn {currentData.turn_number}
                    </div>
                  </div>
                  <div className="">,</div>
                  <div className="sentiment text !text-left">
                    {currentData.turn_category}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-[16px] items-center justify-center">
              <button onClick={handleBackClick}>
                <div className="back hidden md:flex text-white transition-all flex-shrink-0">
                  <Image src="icons/back-icon.svg" alt="back" height={45} width={40} />
                </div>
              </button>
              <button>
                <div className="play text-white transition-all flex-shrink-0">
                  <Image src="icons/play-icon.svg" alt="play" height={50} width={50} />
                </div>
              </button>
              <button onClick={handleNextClick}>
                <div className="next hidden md:flex text-white transition-all flex-shrink-0">
                  <Image src="icons/skip-icon.svg" alt="next" height={45} width={40} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;