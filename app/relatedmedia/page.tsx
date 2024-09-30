"use client";
import React, { useState, useEffect, useRef } from "react";
import JFile from "@/public/data/dummydata.json";
import Image from "next/image";
import FeedItem from "@/components/FeedItem";
import SearchBar from "@/components/SearchBar";
import { NavBar } from "@/components/NavBar";
import MediaItem from '@/components/MediaItem'

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

const RelatedMedia = () => {
  // State variables
  const [isTranscriptExpanded, setTranscriptExpanded] = useState(false);
  const [isTranscriptOpen, setTranscriptOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [currentTurn, setCurrentTurn] = useState<number>(0);
  const [currentPlayingTurn, setCurrentPlayingTurn] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSearchMode, setSearchMode] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isInboxOpen, setInboxOpen] = useState(false);
  const [isFetchOpen, setFetchOpen] = useState(false);
  const [wordData, setWordData] = useState<any[]>([]);
  const [sentencesData, setSentencesData] = useState<any[]>([]);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<number | null>(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [isSearchBarExpanded, setSearchBarExpanded] = useState(false);
  const [mediaItems, setMediaItems] = useState([])

  const audioRef = useRef<HTMLAudioElement>(null);

  // Data and derived variables
  const turnsData: Array<TurnData> = JFile.analysis;
  const currentData = turnsData[currentTurn] ?? null;
  const nextData: TurnData | null = turnsData[currentTurn + 1] || null;
  const cumulativeScoreKH = getCumulativeScoreKH();
  const cumulativeScoreDT = getCumulativeScoreDT();
  const scoreForCurrentTurn = currentData.score;
  const nextTurnText = nextData && nextData.analysis.claims.length > 0
    ? nextData.analysis.claims[0].text
    : "No next turn text available";

    useEffect(() => {
      fetch('/api/media-items')
        .then(response => response.json())
        .then(data => setMediaItems(data))
        .catch(error => console.error('Error fetching media items:', error))
    }, [])

  // Functions to calculate scores
  function getCumulativeScoreKH() {
    return (
      turnsData
        .filter((turn) => turn.speaker_name === "Kamala Harris")
        .find((turn) => turn.turn_number === currentData.turn_number)
        ?.cumulative_score || 0
    );
  }

  function getCumulativeScoreDT() {
    return (
      turnsData
        .filter((turn) => turn.speaker_name === "Donald Trump")
        .find((turn) => turn.turn_number === currentData.turn_number)
        ?.cumulative_score || 0
    );
  }

  // UI Handlers
  const handleExpandClick = () => {
    setTranscriptExpanded((prevState) => !prevState);
  };

  const handleSearchBarClick = () => {
    setSearchBarExpanded(true);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchMode(false);
    setSearchBarExpanded(false);
  };

  const toggleSearchTab = () => {
    setInboxOpen(!isInboxOpen);
  };

  const toggleTranscript = () => {
    setTranscriptOpen(!isTranscriptOpen);
  };

  // Search Handlers
  const handleToggleInbox = () => {
    setInboxOpen((prev) => !prev);
    setFetchOpen(false); // Close fetch when inbox is opened
    setSearchMode(false);
  };

  const handleToggleFetch = () => {
    setFetchOpen((prev) => !prev);
    setInboxOpen(false); // Close inbox when fetch is opened
    setSearchMode(false);
  };

  const handleSearchClick = () => {
    setSearchMode(true);
    setInboxOpen(false);
    setFetchOpen(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Audio Handlers
  const getAudioFile = (turnNumber: number) => {
    return `/audio/turn${turnNumber}.wav`;
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

  const handlePlay = (turnNumber: number | null) => {
    setCurrentPlayingTurn(turnNumber);
  };

  const handleWordClick = (start: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = start;
      audioRef.current.play(); // Play the audio after seeking
    }
  };

  const handleNextClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (currentTurn < turnsData.length - 1) {
      setCurrentTurn(currentTurn + 1);
      setIsPlaying(false);
    }
  };

  const handleBackClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (currentTurn > 0) {
      setCurrentTurn(currentTurn - 1);
      setIsPlaying(false);
    }
  };

  // Touch Handlers for Swipe Gestures
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const clientY = e.targetTouches[0].clientY;
    setTouchStart(clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.changedTouches[0].clientY);
    if (touchStart - touchEnd > 50) {
      setTranscriptOpen(true);
    }
  };

  // Formatting Functions
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

  // Effects
  useEffect(() => {
    const loadWordAndSentenceData = async () => {
      const response = await fetch(`/audio/audio_data/turn${currentTurn + 1}.json`);
      const data = await response.json();
      setWordData(data.results.channels[0].alternatives[0].words);
      setSentencesData(data.results.channels[0].alternatives[0].paragraphs.paragraphs[0].sentences);
    };

    loadWordAndSentenceData();
  }, [currentTurn]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const handleEnded = () => setIsPlaying(false);
      audioElement.addEventListener("ended", handleEnded);

      return () => {
        audioElement.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioRef]);

  const currentSentences = sentencesData.slice(currentSentenceIndex, currentSentenceIndex + 2);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement && wordData.length > 0) {
      const handleTimeUpdate = () => {
        const currentTime = audioElement.currentTime;

        // Highlight the current word
        const currentWordIndex = wordData.findIndex(
          (word: any) => currentTime >= word.start && currentTime <= word.end
        );
        setHighlightedWordIndex(currentWordIndex !== -1 ? currentWordIndex : null);

        // Check if the current two sentences are done being spoken
        if (currentSentences.length === 2) {
          const secondSentenceEnd = currentSentences[1]?.end;
          if (currentTime >= secondSentenceEnd) {
            // Scroll to the next two sentences
            setCurrentSentenceIndex((prevIndex) => prevIndex + 2);
          }
        }
      };
      audioElement.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [wordData, currentSentenceIndex]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);

      audioElement.addEventListener("play", handlePlay);
      audioElement.addEventListener("pause", handlePause);
      audioElement.addEventListener("ended", handleEnded);

      return () => {
        audioElement.removeEventListener("play", handlePlay);
        audioElement.removeEventListener("pause", handlePause);
        audioElement.removeEventListener("ended", handleEnded);
      };
    }
  }, []);

  useEffect(() => {
    if (!isSearchMode) {
      setSearchInput("");
    }
  }, [isSearchMode]);

  return (
    <div className="min-h-screen bg-[url('')] bg-cover bg-white bg-center backdrop-blur-[50px]">
      <div className="light absolute z-50 inset-0 h-[80px] w-full"></div>

      <div className="overlay bg-white bg-opacity-20 absolute z-0 inset-0 backdrop-blur-[200px] opacity-100"></div>

      <div
        className={`mainbody px-[10px] md:px-[20px] h-screen w-full pt-[90px] pb-[82px] bg-none overflow-y-auto scroll-smooth 
        `}
      >
        <div className="feed w-full h-fit z-40 items-center justify-center flex">
          <div className="grid grid-cols-1 w-full h-fit gap-[24px]">
                <div className="flex gap-5 items-center box">
                <h1 className="text-xl md:text-2xl text-center">related media</h1>
                <p className="rounded-[20px] text-xl md:text-2xl flex gap-1 black-opaque px-[10px]">Turn <div className="">1</div></p>
                </div>
                <MediaItem items={mediaItems} />
          </div>
        </div>

        {/* searchbar */}
      <div className="header -top-1 px-[10px] md:px-[20px] z-40 pb-[15px] fixed box flex-col w-full h-fit">

      <div
  onClick={() => setTranscriptOpen(!isTranscriptOpen)}
  className={`top-pill !flex-col cursor-pointer w-full max-w-[600px] nav-bar !blurry transition-all mt-3.5 rounded-[40px] px-[15px] py-[10px] box !justify-between ${
    isTranscriptOpen ? 'h-[45vh] max-w-full' : 'h-[57px]'
  }`}
>
  <div className="box">

  <div className="flex flex-row justify-between items-center gap-3 w-full">
    {/* Speaker Information */}
    <div className="flex flex-row items-center gap-3">
      <div
        className="box current-speaker !w-[40px] !h-[40px] shadow shadow-[#cae7ff] border border-[#cae7ff] justify-center items-center inline-flex rounded-full"
        style={{
          boxShadow: "0px 0px 11.7px 0px rgba(0, 140, 255, 0.91)",
        }}
      >
        <Image
          src="/candidates/harris.webp"
          alt=""
          width={40}
          height={40}
          className="block mx-auto rounded-full"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <div className="flex flex-col">
        <div className="current-name text-sm md:text-base">Kamala Harris</div>
        <div className="flex gap-1">
          <div className="poppins text-xs md:text-sm -mt-1.5">200 pts</div>
          <div className="poppins text-xs md:text-sm -mt-1.5">•</div>
          <div className="poppins text-xs md:text-sm -mt-1.5">Happy</div>
        </div>
      </div>
    </div>

    {/* Secondary Speakers and Controls */}
    <div className="flex flex-row items-center gap-3">
      <div
        className="secondary-speaker flex-shrink-0 black-opaque rounded-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src="/candidates/trump.webp"
          alt=""
          width={40}
          height={40}
          className="block mx-auto rounded-full"
        />
      </div>
      <div className="secondary-speaker">
        <div className="w-[40px] h-[40px] flex-shrink-0 black-opaque rounded-full flex justify-center items-center text-base">
          +2
        </div>
      </div>
      <audio ref={audioRef} />
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePlayPauseClick();
        }}
      >
        <div className="play invert text-white transition-all flex-shrink-0 w-[40px] h-[40px] opacity-90">
          <Image
            src={isPlaying ? "icons/pause-icon.svg" : "icons/play-icon.svg"}
            alt={isPlaying ? "pause" : "play"}
            height={40}
            width={40}
          />
        </div>
      </button>
      <button
      className="hidden md:flex"
        onClick={(e) => {
          e.stopPropagation();
          handleNextTurn();
        }}
      >
        <div className="next-turn invert text-white transition-all flex-shrink-0 w-[40px] h-[40px] opacity-90">
          <Image
            src={"icons/skip-icon.svg"}
            alt="next"
            height={40}
            width={40}
          />
        </div>
      </button>
    </div>
  </div>
  </div>

  {/* Transcript Section */}
  {isTranscriptOpen && (
  <div className="transcript-content h-full rounded-[40px] black-opaque px-[15px] pt-[15px] pb-[0px] flex flex-col w-full mt-3">
    <div className="flex flex-row items-center justify-between w-full">
      <div className="rounded-[20px] poppins px-[10px]">
        {turnCategory || 'no category'}
      </div>
      <p className="rounded-[20px] flex gap-1 white-opaque px-[10px]">Turn <div className="">1</div></p>
    </div>
    {sentencesData.map((sentence, index) => (
      <div className="box">
        <div
          key={index}
          className={`${highlightedWordIndex === index ? 'highlighted' : ''} !text-left text-sm md:text-base overflow-auto`}
        >
          {sentence.text}
        </div>
      </div>
    ))}
  </div>
)}
</div>


      </div>

      <div className="navbar fixed bottom-0 sm:bottom-2.5 w-full sm:max-w-[500px] z-40 px-[0px] sm:px-[20px]">
        <NavBar onSearchClick={toggleSearchTab} />
      </div>

        <div
          className={`search-tab z-[50] transition-all duration-200 w-full text-black fixed bottom-0 ${
            isSearchMode ? "translate-y-0" : "translate-y-full"
          } h-[100vh] bg-white rounded-t-[40px]`}
          style={{ transition: "transform 0.4s ease" }}
        >
          <SearchBar
            searchInput={searchInput}
            onSearchInputChange={handleSearchInputChange}
            isSearchMode={isSearchMode}
            handleSearchClick={handleSearchClick}
            handleClearSearch={handleClearSearch}
            setInboxOpen={handleToggleInbox}
            setFetchOpen={handleToggleFetch}
            isFetchOpen={isFetchOpen}
            isInboxOpen={isInboxOpen}
            isSearchBarExpanded={isSearchBarExpanded}
            onSearchBarClick={handleSearchBarClick}
            setSearchBarExpanded={setSearchBarExpanded}
          />
        </div>



      {/* <div
          className={`search-tab z-[50] transition-all duration-200 w-full text-black fixed bottom-0 ${
            isInboxOpen ? "translate-y-0" : "translate-y-full"
          } w-full h-[90.3vh] bg-white rounded-t-[40px]`}
          style={{ transition: "transform 0.4s ease" }}
        ></div>
        <div
          className={`transcript z-40 text-black fixed bottom-0 transition-all duration-400 ${
            isTranscriptOpen
              ? isTranscriptExpanded
                ? "h-[90.3vh]"  // Fully expanded state
                : "h-[50vh]"    // Half-open state
              : "h-[90px]"      // Collapsed state
          } w-full rounded-t-[40px]`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        > */}
          {/* <button
            className="tab transition-all flex flex-col gap-[10px] py-[6px] w-full items-center"
            onClick={toggleTranscript}
          >
            <div className="black-opaque !shadow-none transition-all !opacity-100 w-[48px] h-[5px] rounded-full"></div>
          </button>

          <div className="meta transition-all w-full h-full">
            <div className="h-[50px] flex justify-between w-full">
              <div
                onClick={toggleTranscript}
                className="speaker cursor-pointer flex w-fit transition-all h-full flex-row items-center justify-start gap-[10px]"
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
                        {currentData.turn_category}
                      </div> */}
                       {/*<div className="text !text-left">•</div>
                      {/*
                      <div className="turn text !text-left">
                        Turn {currentData.turn_number}
                      </div> */}
                     
                    {/* </div> */}
                    
                    {/* <div className="">,</div>
                    
                    <div className="sentiment text !text-left">Upset</div> */}
                  {/* </div>
                </div>
              </div> */}

              {/* <div className="points-1 w-fit text-[.8rem] h-fit text-black poppins"></div>
              <div className="flex gap-[16px] z-50 items-center justify-center">
                <button onClick={handleBackClick}>
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
                      }
                      alt={isPlaying ? "pause" : "play"}
                      height={50}
                      width={50}
                    />
                  </div>
                </button>

                <button
                  onClick={handleNextClick}
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
              </div> */}

              {/* <audio
                ref={audioRef}
                src={`/audio/turn${currentTurn + 1}.wav`} 
              />
            </div>
          </div> */}

          {/* Transcript content */}
          {/* <div
            className={`transcript-box flex flex-col p-[25px] gap-[10px] w-full h-full black-opaque !shadow-none rounded-[40px] transitions-all ${
              isTranscriptOpen ? "flex" : "hidden"
            }`}
          >
            <div className="points-phase w-full h-fit flex items-center justify-between flex-row px-[20px]">
              <div className="points flex flex-row gap-[3px] poppins text text-base text-[#79FF80]">
              <div className="num">{currentData ? currentData.score : "0"}</div>
              <div className="pts">pts</div>

                <div className="plus-minus">
                  <div className="minus hidden">-</div>
                  <div className="plus">+</div>
                </div>
              </div>
              <div className="box !justify-end gap-2">
              <div className="turn flex w-fit black-opaque !shadow-none text-base md:text-lg h-fit px-[10px] py-[1px] items-center rounded-full text-white max-sm:px-[10px]">
                Turn {currentData.turn_number}
              </div>

              <button onClick={handleExpandClick}>
              <Image
                src={isTranscriptExpanded ? "icons/on-icon.svg" : "icons/off-icon.svg"}
                alt={isTranscriptExpanded ? "minus" : "plus"}
                height={35}
                width={38}
              />
            </button>



              </div>
            </div>

            <div className="lines flex box w-full h-full flex-col gap-[15px] px-[10px] py-[10px]">
              <div className="turn2 !text-left flex h-full text text-[1.25rem] text-gray-300 w-full justify-center">
                <div className="line text !text-left line-clamp-5">
                  {currentTurnText}
                </div> */}
              {/* </div> */}
            {/* </div> */}
          {/* </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default RelatedMedia;