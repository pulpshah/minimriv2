"use client";
import React, { useState, useRef } from "react";
import JFile from "@/public/data/dummydata.json";
import Image from "next/image";
import FeedItem from "@/components/FeedItem";
import { useEffect } from "react";
import SearchBar from "@/components/SearchBar";

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
  const [isInboxOpen, setInboxOpen] = useState(false);
  const [isFetchOpen, setFetchOpen] = useState(false);
  const [isTranscriptExpanded, setTranscriptExpanded] = useState(false);
  const [isTranscriptOpen, setTranscriptOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [currentTurn, setCurrentTurn] = useState<number>(0);
  const [currentPlayingTurn, setCurrentPlayingTurn] = useState<number | null>(null); // Track the currently playing turn
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSearchMode, setSearchMode] = useState(false);
  const [wordData, setWordData] = useState<any[]>([]);
  const [sentencesData, setSentencesData] = useState<any[]>([]); // Store sentences
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<number | null>(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0); // Track which sentence set is being displayed

  const audioRef = useRef<HTMLAudioElement>(null);

  const turnsData: Array<TurnData> = JFile.analysis;
  const currentData = turnsData[currentTurn] ?? null;
  const nextData: TurnData | null = turnsData[currentTurn + 1] || null;

  const currentTurnText = wordData.map((word: any, index: number) => {
    const isHighlighted = index === highlightedWordIndex;
    return (
      <span
        key={index}
        style={{ color: isHighlighted ? "yellow" : "white", cursor: "pointer" }}
        onClick={() => handleWordClick(word.start)} 
      >
        {word.punctuated_word}{" "}
      </span>
    );
  });

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

  const handleExpandClick = () => {
    setTranscriptExpanded((prevState) => !prevState);
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

  const handlePlay = (turnNumber: number | null) => {
    setCurrentPlayingTurn(turnNumber);
  };

  const toggleTranscript = () => {
    setTranscriptOpen(!isTranscriptOpen);
  };

  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const loadWordAndSentenceData = async () => {
      const response = await fetch(`/audio/audio_data/turn${currentTurn + 1}.json`);
      const data = await response.json();
      setWordData(data.results.channels[0].alternatives[0].words);
      setSentencesData(data.results.channels[0].alternatives[0].paragraphs.paragraphs[0].sentences);
    };

    loadWordAndSentenceData();
  }, [currentTurn]);

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
  }, [wordData, currentSentences]);

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

  const handleWordClick = (start: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = start;
      audioRef.current.play(); // Play the audio after seeking
    }
  };

  // Handle swipe up
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

  useEffect(() => {
    if (!isSearchMode) {
      setSearchInput("");
    }
  }, [isSearchMode]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearchClick = () => {
    setSearchMode(true); 
    setInboxOpen(false);
    setFetchOpen(false);
  };

  const handleClearSearch = () => {
    setSearchMode(false);
  };

  return (
    <div className="min-h-screen bg-[url('')] bg-cover bg-white bg-center backdrop-blur-[50px]">
      <div className="light absolute z-50 inset-0 h-[80px] w-full"></div>

      <div className="overlay bg-white bg-opacity-20 absolute z-0 inset-0 backdrop-blur-[200px] opacity-100"></div>

      <div
        className={`mainbody px-[10px] md:px-[20px] h-screen w-full pt-[96px] pb-[150px] bg-none overflow-y-auto scroll-smooth ${
          isTranscriptOpen ? "pb-[54vh]" : "pb-[150px]"
        }`}
      >
        <div className="feed w-full h-fit z-40 items-center justify-center flex">
          <div className="grid grid-cols-1 w-full h-fit gap-[24px]">
            {turnsData.map((turn: TurnData, index) => {
              const ethosScore =
                turn.analysis.claims[0]?.scores?.ethos?.score || 0;
              const pathosScore =
                turn.analysis.claims[0]?.scores?.pathos?.score || 0;
              const logosScore =
                turn.analysis.claims[0]?.scores?.logos?.score || 0;
              const turnCategory = turn.turn_category || "segment";

              return (
                <FeedItem
                  key={index}
                  speaker={turn.speaker_name}
                  topic={turn.topic || "No Topic"}
                  turn_number={turn.turn_number}
                  turn_category={turnCategory}
                  title={turn.turn_category || "segment"}
                  ethosScore={ethosScore}
                  pathosScore={pathosScore}
                  logosScore={logosScore}
                  isPlaying={currentPlayingTurn === turn.turn_number}
                  onPlay={handlePlay}
                />
              );
            })}
          </div>
        </div>

        {/* searchbar */}
        <div className="header top-0 px-[10px] md:px-[20px] z-40 pb-[15px] fixed box flex-col w-full h-fit">
        <SearchBar
        searchInput={searchInput}
        onSearchInputChange={handleSearchInputChange}
        isSearchMode={isSearchMode}
        handleSearchClick={handleSearchClick}
        handleClearSearch={handleClearSearch}
        setInboxOpen={handleToggleInbox}  // Pass the inbox toggle function
        setFetchOpen={handleToggleFetch}  // Pass the fetch toggle function
        isFetchOpen={isFetchOpen}
        isInboxOpen={isInboxOpen}
      />



          {/* Make sure the scores section has a lower z-index than the sliding tab */}
          <div className={`scores-topic hidden z-[10] justify-between items-center white-opaque backdrop-blur-[50px] w-full max-w-[400px] h-fit px-[20px] py-[1px] rounded-full -mt-1.5 transition-opacity ${
                isSearchMode ? "opacity-0" : ""
              } ${
                isInboxOpen ? "opacity-0" : ""
              }
              ${
                isFetchOpen ? "opacity-0" : ""
              }
              ${
                isTranscriptExpanded ? "!opacity-0" : ""
              }
              ${
                isTranscriptOpen ? "opacity-100" : ""
              }`
              }>
            <div className="points-1 w-fit text-base md:text-lg h-fit text-black poppins">
              KH: {cumulativeScoreKH} pts
            </div>

            <div className="points-1 w-fit h-fit text-lg md:text-xl text-black">
              scores
            </div>

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
        ></div>

        <div
          className={`search-tab z-[50] transition-all duration-200 w-full text-black fixed bottom-0 ${
            isFetchOpen ? "translate-x-y" : "translate-y-full"
          } !w-full h-[90.3vh] bg-white rounded-[40px]`}
          style={{ transition: "transform 0.4s ease" }}
        ></div>

<div
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
              : "h-[125px]"      // Collapsed state
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
                      </div>
                       {/*<div className="text !text-left">•</div>
                      {/*
                      <div className="turn text !text-left">
                        Turn {currentData.turn_number}
                      </div> */}
                     
                    </div>
                    
                    {/* <div className="">,</div>
                    
                    <div className="sentiment text !text-left">Upset</div> */}
                  </div>
                </div>
              </div>

              <div className="points-1 w-fit text-[.8rem] h-fit text-black poppins"></div>
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
              </div>

              <audio
                ref={audioRef}
                src={`/audio/turn${currentTurn + 1}.wav`} 
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
