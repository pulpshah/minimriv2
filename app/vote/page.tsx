"use client";
import React, { useState, useEffect, useRef } from "react";
import JFile from "@/public/data/dummydata.json";
import Image from "next/image";
import FeedItem from "@/components/FeedItem";
import SearchBar from "@/components/SearchBar";
import { NavBar } from "@/components/NavBar";
import VoteItem from '@/components/VoteItem'

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

const vote = () => {
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
  const [voteitems, setvoteitems] = useState([])

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
        .then(data => setvoteitems(data))
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
                <h1 className="text-2xl text-center">Votes</h1>
                </div>
                <VoteItem items={voteitems} />
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
        {currentData?.turn_category || "no category"}
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
      </div>
    </div>
  );
};

export default vote;
