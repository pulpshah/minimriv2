"use client";
import React, { useState, useRef } from "react";
import JFile from "@/public/data/dummydata.json";
import Image from "next/image";
import FeedItem from "@/components/FeedItem";
import { useEffect } from "react";

// Define the type for the turn data to include cumulative_score and ethos, pathos, logos scores
type TurnData = {
  speaker_name: string;
  topic?: string;
  turn_number: number;
  turn_category?: string;
  score: number;
  talk_time: number;
  analysis: {
    claims: {
      text: string;
      scores?: {
        ethos?: {
          score: number;
        };
        pathos?: {
          score: number;
        };
        logos?: {
          score: number;
        };
      };
    }[];
  };
  cumulative_score?: number;
};

const HomePage = () => {
  const [isTranscriptOpen, setTranscriptOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSearchMode, setSearchMode] = useState(false);

  const turnsData: Array<TurnData> = JFile.analysis;
  const currentData: TurnData = turnsData[currentTurn];
  const nextData: TurnData | null = turnsData[currentTurn + 1] || null;

  const currentTurnText =
    currentData.analysis.claims.length > 0
      ? currentData.analysis.claims[0].text
      : "No text available";

  const nextTurnText =
    nextData && nextData.analysis.claims.length > 0
      ? nextData.analysis.claims[0].text
      : "No next turn text available";

  const getCumulativeScoreKH = () => {
    return (
      turnsData
        .filter((turn) => turn.speaker_name === "Kamala Harris")
        .find((turn) => turn.turn_number === currentData.turn_number)
        ?.cumulative_score || 0
    );
  };

  const getCumulativeScoreDT = () => {
    return (
      turnsData
        .filter((turn) => turn.speaker_name === "Donald Trump")
        .find((turn) => turn.turn_number === currentData.turn_number)
        ?.cumulative_score || 0
    );
  };

  const cumulativeScoreKH = getCumulativeScoreKH();
  const cumulativeScoreDT = getCumulativeScoreDT();

  const scoreForCurrentTurn = currentData.score;

  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleTranscript = () => {
    setTranscriptOpen(!isTranscriptOpen);
  };

  const [searchInput, setSearchInput] = useState("");

  // Handle swipe up
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const clientY = e.targetTouches[0].clientY; // Access clientY correctly
    setTouchStart(clientY);
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
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    } else if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    } else {
      return `0:${remainingSeconds.toString().padStart(2, "0")}`;
    }
  };

  const handlePlayPauseClick = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (!isSearchMode) {
      setSearchInput(""); // Clear input
    }
  }, [isSearchMode]);
  
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  

  // Handle opening the search sliding tab
  const handleSearchClick = () => {
    setSearchMode(true); // Show the sliding search tab
  };

  // Handle clearing the search bar and hiding the search tab
  const handleClearSearch = () => {
    setSearchMode(false);
  };

  return (
    <div className="min-h-screen bg-[url('')] bg-cover bg-white bg-center backdrop-blur-[50px]">
      <div className="light absolute z-50 inset-0 h-[80px] w-full"></div>

      <div className="overlay bg-white bg-opacity-20 absolute z-0 inset-0 backdrop-blur-[200px] opacity-100"></div>

      <div
        className={`mainbody h-screen w-full pt-[125px] pb-[150px] bg-none overflow-y-auto scroll-smooth ${
          isTranscriptOpen ? "pb-[54vh]" : "pb-[150px]"
        }`}
      >
        <div className="feed w-full h-fit z-40 items-center justify-center flex">
          <div className="grid grid-cols-1 w-full h-fit gap-[24px]">
            {turnsData.map((turn: TurnData, index) => {
              const ethosScore = turn.analysis.claims[0]?.scores?.ethos?.score || 0;
              const pathosScore = turn.analysis.claims[0]?.scores?.pathos?.score || 0;
              const logosScore = turn.analysis.claims[0]?.scores?.logos?.score || 0;

              return (
                <FeedItem
                  key={index}
                  speaker={turn.speaker_name}
                  topic={turn.topic || "No Topic"}
                  turn_number={turn.turn_number}
                  title={turn.turn_category || "segment"}
                  ethosScore={ethosScore}
                  pathosScore={pathosScore}
                  logosScore={logosScore}
                />
              );
            })}
          </div>
        </div>

        <div className="header top-0 px-[20px] z-40 pb-[15px] fixed box flex-col w-full h-fit">
          
        <div className={`search z-[101] gap-2 w-full h-[81px] box flex flex-row items-center ${
        isSearchMode ? "justify-center" : "!justify-between"
      }`}>

    
    <button
      className={`cursor-pointer flex-shrink-0 z-[101] w-[35px] md:w-[45px] transition-opacity ${
        isSearchMode ? "hidden" : "flex"
      }`}
    >
      <Image
        src="icons/inbox-icon.svg"
        alt="inbox"
        height={35}
        width={45}
      />
    </button>

    <div className={`flex items-center w-full justify-center ${
        isSearchMode ? "mx-[20px]" : "mx-0"
      }`}>

      <div className={`search-bar backdrop-blur-[50px] transition-all z-[101] flex-shrink-0 justify-between w-[65vw] max-h-[50px] flex flex-row gap-[10px] px-[8px] overflow-hidden text-white rounded-full ${
        isSearchMode ? " w-full max-w-[600px] h-[45px]" : "h-[35px] w-[65vw] max-w-[450px]"
      }`}>

        <div
          onClick={handleSearchClick}
          className="flex items-center gap-[10px] justify-between w-full"
        >
          <button className="w-[19px] h-[19px] md:w[50px] flex-shrink-0">
            <Image
              className="cursor-pointer"
              src="icons/search-icon.svg"
              alt="search"
              height={19}
              width={19}
            />
          </button>

          <input
          placeholder="search"
          type="text"
          className="placeholder-white transition-all poppins bg-transparent outline-none justify-between w-full text-white bg-none"
          value={searchInput}
          onChange={handleSearchInputChange}
        />

        </div>
    </div>

    <div className="">
      <button
        className={`cursor-pointer  flex-shrink-0 z-[101] w-[32px] md:w-[32px] transition-opacity ${
          isSearchMode ? "flex" : "hidden"
        }`}
        onClick={isSearchMode ? handleClearSearch : undefined}
      >
        <Image
          src={
            "icons/close-icon.svg"
          }
          alt={"close"}
          height={45}
          width={45}
        />
      </button>

    </div>

    </div>

    {/* Fetch/Close icon - hide the fetch and show the close button based on search mode */}
    <button
      className={`cursor-pointer flex-shrink-0 z-[101] w-[35px] md:w-[45px] transition-opacity ${
        isSearchMode ? "hidden" : "flex" }`}
      onClick={isSearchMode ? handleClearSearch : undefined}
    >
      <Image
        src={
          "icons/fetch-icon.svg"
        }
        alt={ "close"}
        height={35}
        width={45}
      />
    </button>
  </div>

  {/* Make sure the scores section has a lower z-index than the sliding tab */}
  <div className="scores-topic z-[10] flex justify-between items-center white-opaque backdrop-blur-[50px] w-full max-w-[400px] h-fit px-[20px] py-[1px] rounded-full">
    <div className="points-1 w-fit text-base md:text-lg h-fit text-black poppins">
      KH: {cumulativeScoreKH} pts
    </div>

    <div className="points-1 w-fit h-fit text-lg md:text-xl text-black">score</div>

    <div className="points-1 w-fit text-base md:text-lg h-fit text-black poppins">
      DT: {cumulativeScoreDT} pts
    </div>
  </div>
</div>

<div
  className={`search-tab z-[50] transition-all duration-200 w-full text-black fixed bottom-0 ${
    isSearchMode ? "translate-y-0" : "translate-y-full"
  } w-full h-[90.3vh] bg-white rounded-t-[40px]`}
  style={{ transition: "transform 0.4s ease" }}
>
</div>



          <div
            className={`transcript z-40 text-black fixed bottom-0 transition-all duration-400 ${
              isTranscriptOpen ? "h-[50vh]" : "h-[125px]"
            } w-full rounded-t-[40px]`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >

          <button
            className="tab transition-all flex flex-col gap-[10px] py-[6px] w-full items-center"
            onClick={toggleTranscript}
          >
            <div className="black-opaque !shadow-none transition-all !opacity-100 w-[48px] h-[5px] rounded-full"></div>
          </button>

          <div className="meta transition-all w-full h-full">
            <div className="h-[50px] flex justify-between w-full">
              <div
                onClick={toggleTranscript}
                className="speaker cursor-pointer flex w-fit transition-all h-full flex-row items-cen justify-start gap-[10px]"
              >
                <button>
                  <div className="profile flex transition-all items-center justify-center rounded-full">
                    <Image
                      src="icons/profile-icon.svg"
                      alt="Profile"
                      height={46}
                      width={46}
                    />
                  </div>
                </button>
                <div className="name-stats w-fit h-fit flex flex-col justify-start text-black">
                  <div className="name text text-base md:text-lg !text-left">
                    {currentData.speaker_name}
                  </div>
                  <div className="stats text flex h-fit w-fit gap-[5px] text-base md:text-lg poppins">
                    <div className="time-turn text flex flex-row gap-[4px]">
                      <div className="time text !text-left">
                        {formatTalkTime(currentData.talk_time)}
                      </div>
                      <div className="text !text-left">•</div>
                      <div className="turn text !text-left">
                        Turn {currentData.turn_number}
                      </div>
                    </div>
                    <div className="">,</div>
                    <div className="sentiment text !text-left">Upset</div>
                  </div>
                </div>
              </div>

              <div className="points-1 w-fit text-[.8rem] h-fit text-black poppins"></div>
              <div className="flex gap-[16px] z-50 items-center justify-center">
                <button onClick={handleBackClick} disabled={currentTurn === 0}>
                  <div className="back hidden md:flex text-white transition-all flex-shrink-0">
                    <Image
                      src="icons/back-icon.svg"
                      alt="back"
                      height={45}
                      width={40}
                    />
                  </div>
                </button>
                <button onClick={handlePlayPauseClick}>
                  <div className="play text-white transition-all flex-shrink-0">
                    <Image
                      src={
                        isPlaying
                          ? "icons/pause-icon.svg"
                          : "icons/play-icon.svg"
                      } // Switch icons dynamically
                      alt={isPlaying ? "pause" : "play"}
                      height={50}
                      width={50}
                    />
                  </div>
                </button>

                <button
                  onClick={handleNextClick}
                  disabled={currentTurn === turnsData.length - 1}
                >
                  <div className="next hidden md:flex text-white transition-all flex-shrink-0">
                    <Image
                      src="icons/skip-icon.svg"
                      alt="next"
                      height={45}
                      width={40}
                    />
                  </div>
                </button>
              </div>

              <audio
                ref={audioRef}
                src="https://drive.google.com/file/d/1JSWQkM3eKbHJm7Qht3gyepbgp0T31BTQ/view"
              />
            </div>
          </div>

          {/* Transcript content */}
          <div
            className={`transcript-box flex flex-col p-[25px] gap-[10px] w-full h-full black-opaque !shadow-none rounded-[40px] transitions-all ${
              isTranscriptOpen ? "flex" : "hidden"
            }`}
          >
            <div className="points-phase w-full h-fit flex items-center justify-between flex-row px-[20px]">
              <div className="points flex flex-row gap-[3px] poppins text text-base text-[#79FF80]">
                <div className="num">{scoreForCurrentTurn}</div>
                <div className="pts">pts</div>

                <div className="plus-minus">
                  <div className="minus hidden">-</div>
                  <div className="plus">+</div>
                </div>
              </div>

              <div className="turn flex w-fit black-opaque !shadow-none text-base h-fit px-[12px] py-[1px] items-center rounded-full text-white">
                {currentData.turn_category}
              </div>
            </div>

            <div className="lines flex box w-full h-full flex-col gap-[15px] px-[10px] py-[10px] overflow-y-auto">
              <div className="turn2 !text-left flex h-fit text text-[1.25rem] text-gray-300 w-full justify-center">
                <div className="line text !text-left line-clamp-5">
                  {currentTurnText}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
