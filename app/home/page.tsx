"use client";
import React, { useState, useEffect, useRef } from "react";
import JFile from "@/public/data/dummydata.json";
import Image from "next/image";
import FeedItem from "@/components/FeedItem";
import SearchBar from "@/components/SearchBar";
import { NavBar } from "@/components/NavBar";

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
  // State variables
  const [isTranscriptExpanded, setTranscriptExpanded] = useState(false);
  const [isTranscriptOpen, setTranscriptOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [currentTurn, setCurrentTurn] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0); // Start with question 1
  const [currentPlayingTurn, setCurrentPlayingTurn] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSearchMode, setSearchMode] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isInboxOpen, setInboxOpen] = useState(false);
  const [isFetchOpen, setFetchOpen] = useState(false);
  const [wordData, setWordData] = useState<any[]>([]);
  const [sentencesData, setSentencesData] = useState<any[]>([]);
  const [turnCategory, setTurnCategory] = useState<string | null>(null);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<number | null>(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [isSearchBarExpanded, setSearchBarExpanded] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Data and derived variables
  const turnsData: Array<TurnData> = JFile.analysis;
  const currentData = turnsData[currentTurn] ?? null;
  const nextData: TurnData | null = turnsData[currentTurn + 1] || null;
  // const cumulativeScoreKH = getCumulativeScoreKH();
  // const cumulativeScoreDT = getCumulativeScoreDT();
  // const scoreForCurrentTurn = currentData.score;

  const nextTurnText = nextData && nextData.analysis.claims.length > 0
    ? nextData.analysis.claims[0].text
    : "No next turn text available";

  // Functions to calculate scores
  // function getCumulativeScoreKH() {
  //   return (
  //     turnsData
  //       .filter((turn) => turn.speaker_name === "Kamala Harris")
  //       .find((turn) => turn.turn_number === currentData.turn_number)
  //       ?.cumulative_score || 0
  //   );
  // }

  // function getCumulativeScoreDT() {
  //   return (
  //     turnsData
  //       .filter((turn) => turn.speaker_name === "Donald Trump")
  //       .find((turn) => turn.turn_number === currentData.turn_number)
  //       ?.cumulative_score || 0
  //   );
  // }

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
  const loadTurnContent = async (questionNumber: number, turnNumber: number) => {
    try {
      // Load the JSON file for the current turn
      const jsonResponse = await fetch(`/audio/question_${questionNumber}/q${questionNumber}_t${String(turnNumber).padStart(2, '0')}.json`);
      const jsonData = await jsonResponse.json();
  
      // Update state with word and sentence data
      const words = jsonData.results.channels[0].alternatives[0].words || [];
      const paragraphs = jsonData.results.channels[0].alternatives[0].paragraphs.paragraphs || [];
  
      if (paragraphs.length > 0) {
        const sentences = paragraphs.flatMap((paragraph: { sentences: any; }) => paragraph.sentences);
        setWordData(words);
        setSentencesData(sentences);
      }
  
      // Update the category for the current turn
      setTurnCategory(jsonData.category || null);
  
      // Update the audio source
      if (audioRef.current) {
        audioRef.current.src = `/audio/question_${questionNumber}/q${questionNumber}_t${String(turnNumber).padStart(2, '0')}.wav`;
        setIsPlaying(false); // Stop any previous audio
      }
    } catch (error) {
      console.error("Error loading turn content:", error);
    }
  };

  useEffect(() => {
    loadTurnContent(currentQuestion, currentTurn);
  }, []);

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

  const getNumberOfTurns = async (questionNumber: number) => {
    let turnCount = 0;
    let turnExists = true;
  
    // Keep checking for the existence of the next turn until a file is not found
    while (turnExists) {
      try {
        const response = await fetch(`/audio/question_${questionNumber}/q${questionNumber}_t${String(turnCount + 1).padStart(2, '0')}.json`);
        if (response.ok) {
          turnCount++;
        } else {
          turnExists = false;
        }
      } catch (error) {
        turnExists = false;
      }
    }
  
    return turnCount;
  };

  const handleNextTurn = async () => {
    if (audioRef.current) {
      audioRef.current.pause(); // Pause the current audio
    }
    setIsPlaying(false);
  
    let nextTurn = currentTurn + 1;
    let nextQuestion = currentQuestion;
  
    // Get the number of turns available for the current question
    const maxTurns = await getNumberOfTurns(currentQuestion);
  
    // Check if we need to move to the next question
    if (nextTurn > maxTurns) {
      nextTurn = 1; // Reset turn to 1 for the new question
      nextQuestion += 1;
  
      // Get the number of turns for the next question to confirm it exists
      const nextQuestionTurns = await getNumberOfTurns(nextQuestion);
      if (nextQuestionTurns === 0) {
        // If no turns are available for the next question, stay on the current question
        return;
      }
    }
  
    // Update state to load the new turn content
    setCurrentTurn(nextTurn);
    setCurrentQuestion(nextQuestion);
  
    // Load the content for the next turn
    loadTurnContent(nextQuestion, nextTurn);
  };

  const handleBackTurn = async () => {
    if (audioRef.current) {
      audioRef.current.pause(); // Pause the current audio
    }
    setIsPlaying(false);
  
    let previousTurn = currentTurn - 1;
    let previousQuestion = currentQuestion;
  
    // If we need to go back to the previous question
    if (previousTurn < 1) {
      previousQuestion -= 1;
  
      // Get the number of turns available for the previous question
      const maxTurns = await getNumberOfTurns(previousQuestion);
      if (maxTurns === 0) {
        // If no turns are available for the previous question, stay on the current question
        return;
      }
  
      previousTurn = maxTurns; // Set to the last turn of the previous question
    }
  
    // Update state to load the new turn content
    setCurrentTurn(previousTurn);
    setCurrentQuestion(previousQuestion);
  
    // Load the content for the previous turn
    loadTurnContent(previousQuestion, previousTurn);
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
    // Assuming question 1 and turn 1 for the initial load
    loadTurnContent(1, 1);
    setCurrentQuestion(1);
    setCurrentTurn(1);
  }, []);

  useEffect(() => {
    if (currentQuestion > 0 && currentTurn > 0) {
      loadTurnContent(currentQuestion, currentTurn);
    }
  }, [currentQuestion, currentTurn]);

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


  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const handleTimeUpdate = () => {
        const currentTime = audioElement.currentTime;
  
        // Find the current word based on the current time
        const foundWordIndex = wordData.findIndex(
          (word) => currentTime >= word.start && currentTime <= word.end
        );
  
        if (foundWordIndex !== -1 && foundWordIndex !== highlightedWordIndex) {
          setHighlightedWordIndex(foundWordIndex);
        }
  
        // Find the current sentence based on the current time
        const foundSentenceIndex = sentencesData.findIndex(
          (sentence) => currentTime >= sentence.start && currentTime <= sentence.end
        );
  
        if (foundSentenceIndex !== -1 && foundSentenceIndex !== currentSentenceIndex) {
          setCurrentSentenceIndex(foundSentenceIndex);
        }
      };
  
      audioElement.addEventListener("timeupdate", handleTimeUpdate);
  
      return () => {
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [wordData, sentencesData, highlightedWordIndex, currentSentenceIndex]);

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
        className={`mainbody px-[10px] md:px-[20px] h-screen w-full pt-[90px] pb-[82px] bg-none overflow-y-auto scroll-smooth`}
      >
        <div className="feed w-full h-fit z-40 items-center justify-center flex">
          <div className="grid grid-cols-1 w-full h-fit gap-[24px]">
            {turnsData.map((turn: TurnData, index) => {
              const ethosScore = turn.analysis.claims[0]?.scores?.ethos?.score || 0;
              const pathosScore = turn.analysis.claims[0]?.scores?.pathos?.score || 0;
              const logosScore = turn.analysis.claims[0]?.scores?.logos?.score || 0;
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

        {/* header */}
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
  className="hidden md:flex"
  onClick={(e) => {
    e.stopPropagation();
    handleBackTurn();
  }}
>
  <div className="next-turn invert text-white transition-all flex-shrink-0 w-[40px] h-[40px] opacity-90 box">
    <Image
      src={"icons/back-icon.svg"}
      alt="next"
      height={30}
      width={35}
    />
  </div>
</button>
      <button
  onClick={(e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    handlePlayPauseClick(); // Call play/pause handler
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
    e.stopPropagation(); // Prevent event from bubbling up
    handleNextTurn();
  }}
>
  <div className="next-turn box invert text-white transition-all flex-shrink-0 w-[40px] h-[40px] opacity-90">
    <Image
      src={"icons/skip-icon.svg"}
      alt="next"
      height={35}
      width={35}
    />
  </div>
</button>
    </div>
  </div>
  </div>

  {/* Transcript Section */}
  {isTranscriptOpen && (
  <div className="transcript-content custom-scrollbar h-full w-full rounded-[20px] black-opaque px-[15px] pt-[15px] pb-[10px] flex flex-col w-full mt-3 overflow-y-auto">
    <div className="flex flex-row justify-end w-full">
      {/* <p className="poppins text-[#79FF89]">20 pts+</p> */}
      <div className="rounded-[20px] white-opaque px-[10px]">
        {turnCategory || 'No Category'}
      </div>
    </div>
    <div className="flex flex-col">
      {sentencesData.map((sentence, sentenceIndex) => (
        <div className="" key={sentenceIndex}>
          <div
            ref={
              sentenceIndex === currentSentenceIndex
                ? (el) => {
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                  }
                : null
            }
            className={`${
              currentSentenceIndex === sentenceIndex
                ? 'text-white opacity-100'
                : 'text-gray-400 opacity-70'
            } text-left !text-2xl md:text-base w-full lg:w-3/4 mx-auto `}
          >
            {wordData
              .filter(
                (word) =>
                  word.start >= sentence.start && word.end <= sentence.end
              )
              .map((word, wordIndex) => (
                <span
                  key={`${sentenceIndex}-${wordIndex}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWordClick(word.start);
                  }}
                  className="cursor-pointer hover:underline"
                >
                  {word.punctuated_word + ' '}
                </span>
              ))}
          </div>
        </div>
      ))}
    </div>
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
      </div>
    </div>
  );
};

export default HomePage;
