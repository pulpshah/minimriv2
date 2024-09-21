'use client'
import React from 'react'
import JFile from "@/public/data/dummydata.json";
import Image from 'next/image'
import FeedItem
 from '@/components/FeedItem'
import { useState } from 'react'

const HomePage = () => {

  const [isTranscriptOpen, setTranscriptOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(0);
  const turnsData = JFile.analysis;
  const currentData = turnsData[currentTurn];
  const currentTurnText =
    currentData.analysis.claims.length > 0
      ? currentData.analysis.claims[0].text
      : "No text available";
  
  const nextData = turnsData[currentTurn + 1] || null;
  
  const nextTurnText =
    nextData && nextData.analysis.claims.length > 0
      ? nextData.analysis.claims[0].text
      : "No next turn text available";

      const getCumulativeScoreKH = () => {
        return turnsData
          .filter((turn) => turn.speaker_name === "Kamala Harris")
          .find((turn) => turn.turn_number === currentData.turn_number)?.cumulative_score || 0;
      };
    
      const getCumulativeScoreDT = () => {
        return turnsData
          .filter((turn) => turn.speaker_name === "Donald Trump")
          .find((turn) => turn.turn_number === currentData.turn_number)?.cumulative_score || 0;
      };
    
      const cumulativeScoreKH = getCumulativeScoreKH();
      const cumulativeScoreDT = getCumulativeScoreDT();
    
      const scoreForCurrentTurn = currentData.score;


  const toggleTranscript = () => {
    setTranscriptOpen(!isTranscriptOpen);
  };

  // Handle swipe up
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => { // Specify the type for 'e'
    setTouchEnd(e.changedTouches[0].clientY);
    if (touchStart - touchEnd > 50) {
      // Swipe up
      setTranscriptOpen(true);
    } else if (touchEnd - touchStart > 50) {
      // Swipe down
      setTranscriptOpen(false);
    }
  };

  const handleNextClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation(); // Prevent the event from propagating
    if (currentTurn < turnsData.length - 1) {
      setCurrentTurn(currentTurn + 1);
    }
  };

  // Handle back button click
  const handleBackClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation(); // Prevent the event from propagating
    if (currentTurn > 0) {
      setCurrentTurn(currentTurn - 1);
    }
  };
  

  const formatTalkTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `0:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  };
  

  

  return (
    <div className="min-h-screen bg-[url('')] bg-cover bg-white bg-center backdrop-blur-[50px]">
        <div className="light absolute z-50 inset-0 h-[80px] w-full"></div>


        <div className="overlay bg-white bg-opacity-20 absolute z-0 inset-0 backdrop-blur-[200px] opacity-100"></div>
        <div className={`mainbody h-screen w-full pt-[125px] pb-[150px] bg-none overflow-y-auto scroll-smooth ${isTranscriptOpen ? 'pb-[54vh]' : 'pb-[150px]'}`}>

        <div className="feed w-full h-fit z-40 items-center justify-center flex">
        <div className="grid grid-cols-1 w-full h-fit gap-[24px]">
        {turnsData.map((turn, index) => (
        <FeedItem 
          key={index}
          topic={turn.topic || 'No Topic'} // Make sure to pass topic here
          turn_number={turn.turn_number}
          title={turn.turn_category || 'segment'}
        />
      ))}


        </div>
      </div>

            <div className="header top-0 px-[20px] z-40 pb-[15px] fixed box flex-col w-full h-fit]">
              
              <div className="search z-20 gap-2 w-full h-[81px] box !justify-between flex-row !items-center">

              <button className='cursor-pointer flex-shrink-0 z-50 '>
                    <Image src='icons/inbox-icon.svg' alt='inbox' height={35} width={35}/>
              </button>

              <div className="search-bar backdrop-blur-[50px] transition-all z-20 flex-shrink-0 justify-between w-[65vw] max-w-[600px] h-[35px] max-h-[50px] flex flex-row gap-[10px] px-[8px] overflow-hidden text-white rounded-full">
                
                <div className="flex items-center gap-[10px] justify-between w-full">
                
                <button className='w-[19px] h-[19px] flex-shrink-0'>

                <Image className='cursor-pointer' src='icons/search-icon.svg' alt='Fetch' height={19} width={19}/>
                </button>
                
                <input placeholder= "search" type="text" className="placeholder-white transition-all poppins bg-transparent  outline-none justify-between w-full text-white bg-none"/>

                </div>
                
              </div>

              <button className='cursor-pointer flex-shrink-0 z-50 '>
                  <Image src='icons/fetch-icon.svg' alt='Fetch' height={35} width={35}/>
              </button>
              
              </div>
              <div className="scores-topic flex justify-between items-center white-opaque backdrop-blur-[50px] w-full max-w-[400px] h-fit px-[20px] py-[1px] rounded-full">
                  <div className="points-1 w-fit text-[.8rem] h-fit text-black poppins">
                    KH: {cumulativeScoreKH} pts
                  </div>

                  <div className="points-1 w-fit h-fit text-[1rem] text-black">
                    score
                  </div>

                  <div className="points-1 w-fit text-[.8rem] h-fit text-black poppins">
                    DT: {cumulativeScoreDT} pts
                  </div>
              </div>
            </div>

        </div>

        <div
          className={`transcript z-40 transition-all text-black fixed bottom-0 ${isTranscriptOpen ? 'h-[50vh]' : 'h-[125px]'} w-full rounded-t-[40px]`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
    
            <button className="tab transition-all flex flex-col gap-[10px] py-[6px] w-full items-center" onClick={toggleTranscript}>
            <div className="black-opaque !shadow-none transition-all !opacity-100 w-[48px] h-[5px] rounded-full"></div>
          </button>

                <div className="meta transition-all w-full h-full">

                  <div className="h-[50px] flex justify-between w-full">

                    <div onClick={toggleTranscript} className="speaker cursor-pointer flex w-fit transition-all h-full flex-row items-start justify-start gap-[10px]">
                    <button>
                        <div className="profile flex transition-all items-center justify-center rounded-full">

                          <Image src='icons/profile-icon.svg' alt='Profile' height={46} width={46}/>
                        </div>
                    </button>
                    <div className="name-stats w-fit h-fit flex flex-col justify-start text-black text-[1.125rem]">
                          <div className="name text !text-left">
                            {currentData.speaker_name}
                          </div>
                          <div className="stats text flex h-fit w-fit gap-[5px] text[1rem] poppins">
                            <div className="time-turn text flex flex-row gap-[4px]">
                              <div className="time text !text-left">{formatTalkTime(currentData.talk_time)}</div>
                              <div className="text !text-left">•</div>
                              <div className="turn text !text-left">Turn {currentData.turn_number}</div>
                            </div>
                            <div className="">,</div>
                            <div className="sentiment text !text-left">
                              Upset
                            </div>
                          </div>
                        </div>

                    </div>

                    <div className="points-1 w-fit text-[.8rem] h-fit text-black poppins">
            </div>
              <div className="flex gap-[16px] z-50 items-center justify-center">
              {/* Prevent navigation beyond bounds */}
              <button onClick={handleBackClick} disabled={currentTurn === 0}>
                <div className="back hidden md:flex text-white transition-all flex-shrink-0">
                  <Image src="icons/back-icon.svg" alt="back" height={45} width={40} />
                </div>
              </button>
              <button>
                <div className="play text-white transition-all flex-shrink-0">
                  <Image src="icons/play-icon.svg" alt="play" height={50} width={50} />
                </div>
              </button>

              <button
                onClick={handleNextClick}
                disabled={currentTurn === turnsData.length - 1}
              >
                <div className="next hidden md:flex text-white transition-all flex-shrink-0">
                  <Image src="icons/skip-icon.svg" alt="next" height={45} width={40} />
                </div>
              </button>
            </div>

                  </div>

                </div>
                <div
                  className={`transcript-box flex flex-col p-[25px] gap-[10px] w-full h-full black-opaque !shadow-none rounded-[40px] transitions-all duration-200 ${isTranscriptOpen ? 'flex' : 'hidden'}`}
                >
                  <div className="points-phase w-full h-fit flex items-center justify-between flex-row px-[20px]">

                  

                    <div className="points flex flex-row gap-[3px] poppins text text-[1rem] text-[#79FF80]">
                        <div className="num">
                          {scoreForCurrentTurn}
                        </div>

                        <div className="pts">
                          pts
                        </div>

                        <div className="plus-minus">

                          <div className="minus hidden">-</div>
                          <div className="plus">+</div>
                        </div>
                    </div>

                      <div className="turn flex w-fit black-opaque !shadow-none h-fit px-[12px] py-[1px] items-center rounded-full text-white">
                            {currentData.turn_category}
                      </div>
                  </div>

                  <div className="lines flex box w-full h-full flex-col gap-[15px] px-[10px] py-[10px]">
                    <div className="turn1 !text-right flex h-fit text text-[1.25rem] w-full justify-end">
                      <div className="line max-w-[290px] text-white">
                       {currentTurnText}

                      </div>
                    </div>

                    <div className="turn2 !text-left flex h-fit text text-[1.25rem] text-gray-300 w-full justify-start">
                      <div className="line max-w-[290px]">
                      {nextTurnText}

                      </div>
                    </div>
                    
                  </div>

                </div>
            </div>
    </div>

  )
}

export default HomePage