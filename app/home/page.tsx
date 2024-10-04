"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import FeedItem from "@/components/FeedItem";
import SearchBar from "@/components/SearchBar";
import { NavBar } from "@/components/NavBar";

type TurnData = {
  turn: number;
  speaker: string;
  role: string;
  rawTotalScore: number;
  headline?: string;
  sentences: {
    Headline: string[];
  }[];
};

type ComprehensiveTurnData = {
  turn: number;
  speaker: string;
  role: string;
  rawTotalScore: number;
  headline: string;
};

const HomePage = () => {
  // State variables
  const [isTranscriptExpanded, setTranscriptExpanded] = useState(false);
  const [isTranscriptOpen, setTranscriptOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [currentTurn, setCurrentTurn] = useState<number>(11);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [currentPlayingTurn, setCurrentPlayingTurn] = useState<number | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSearchMode, setSearchMode] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isInboxOpen, setInboxOpen] = useState(false);
  const [isFetchOpen, setFetchOpen] = useState(false);
  const [wordData, setWordData] = useState<any[]>([]);
  const [sentencesData, setSentencesData] = useState<any[]>([]);
  const [turnCategory, setTurnCategory] = useState<string | null>(null);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<
    number | null
  >(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [isSearchBarExpanded, setSearchBarExpanded] = useState(false);
  const [speakerName, setSpeakerName] = useState<string>("");
  const [speakerRole, setSpeakerRole] = useState<string>("");
  const [headline, setHeadline] = useState<string>("");
  const [rawTotalScore, setRawTotalScore] = useState<number>(0);
  const [turnsData, setTurnsData] = useState<TurnData[]>([]);
  const nextTurn = turnsData.find((turn) => turn.turn === currentTurn + 1);
  const nextSpeaker = nextTurn ? nextTurn.speaker : null;

  const audioRef = useRef<HTMLAudioElement>(null);

  const loadData = async (turnNumber: number) => {
    try {
      const jsonResponse = await fetch("/data/AnnotatedTranscript.json");
      const jsonData = await jsonResponse.json();

      // Find the data for the current turn
      const turnData = jsonData.analysis.find(
        (turn: TurnData) => turn.turn === turnNumber
      );

      if (turnData) {
        // Extract the required fields
        const comprehensiveTurnData: ComprehensiveTurnData = {
          turn: turnData.turn,
          speaker: turnData.speaker,
          role: turnData.role,
          headline:
            turnData.sentences[0]?.Headline[0] || "No headline available",
          rawTotalScore: turnData.rawTotalScore || 0,
        };

        // Update state variables
        setCurrentTurn(comprehensiveTurnData.turn);
        setSpeakerName(comprehensiveTurnData.speaker);
        setSpeakerRole(comprehensiveTurnData.role);
        setHeadline(comprehensiveTurnData.headline);
        setRawTotalScore(comprehensiveTurnData.rawTotalScore);
      }
    } catch (error) {
      console.error("Error loading comprehensive data:", error);
    }
  };

  const loadAllTurnData = async () => {
    try {
      const jsonResponse = await fetch("/data/AnnotatedTranscript.json");
      const jsonData = await jsonResponse.json();

      // Assuming jsonData.analysis contains the array of turn data
      setTurnsData(jsonData.analysis);
    } catch (error) {
      console.error("Error loading all turn data:", error);
    }
  };

  // Call loadAllTurnData when component mounts
  useEffect(() => {
    loadAllTurnData();
  }, []);

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
    setSearchInput(e.target.value); // Extract the input value from the event
  };

  // Audio Handlers
  const loadTurnContent = async (turnNumber: number) => {
    try {
      const jsonUrl = `https://harris-trump-debate-audio.s3.us-east-2.amazonaws.com/turn${
        turnNumber - 10
      }.json`;

      const response = await fetch(jsonUrl);

      if (!response.ok) {
        throw new Error(`Missing JSON for turn ${turnNumber - 10}`);
      }

      const jsonData = await response.json();

      // Update state with word and sentence data
      const words = jsonData.results.channels[0].alternatives[0].words || [];
      const paragraphs =
        jsonData.results.channels[0].alternatives[0].paragraphs.paragraphs ||
        [];

      if (paragraphs.length > 0) {
        const sentences = paragraphs.flatMap(
          (paragraph: { sentences: any }) => paragraph.sentences
        );
        setWordData(words);
        setSentencesData(sentences);
      }

      setTurnCategory(jsonData.category || null);
    } catch (error) {
      console.warn(`No transcript available for turn ${turnNumber - 10}`);
      setWordData([]); // Clear previous words
      setSentencesData([]); // Clear previous sentences
      setTurnCategory(null);
    }

    // Always set audio source even if JSON is missing
    if (audioRef.current) {
      audioRef.current.src = `https://harris-trump-debate-audio.s3.us-east-2.amazonaws.com/turn${
        turnNumber - 10
      }.wav`;
      setIsPlaying(false); // Stop any previous audio
    }
  };

  const getSpeakerImage = (speaker: string) => {
    switch (speaker) {
      case "Donald Trump":
        return "/candidates/trump.webp";
      case "Kamala Harris":
        return "/candidates/harris.webp";
      case "David Muir":
        return "/candidates/muir.webp";
      case "Linsey Davis":
        return "/candidates/davis.webp";
      default:
        return "/candidates/default.webp";
    }
  };

  useEffect(() => {
    // Load the individual JSON for audio and transcript
    loadTurnContent(currentTurn);

    // Load comprehensive JSON data for additional information
    loadData(currentTurn);
  }, [currentTurn]);

  const handlePlayPauseClick = () => {
    if (audioRef.current) {
      if (isPlaying) {
        // Set state to paused first to prevent re-triggering play
        setIsPlaying(false);
        setCurrentPlayingTurn(null);

        // Then pause the audio
        audioRef.current.pause();
      } else {
        // Set the state to play and ensure the correct turn is active
        setIsPlaying(true);
        handlePlay(currentTurn);
      }
    }
  };

  const handlePlay = (turnNumber: number | null) => {
    if (audioRef.current) {
      // Pause any currently playing audio before starting a new one
      audioRef.current.pause();
  
      if (turnNumber !== null) {
        // Adjust `turnNumber` to reflect the correct turn
        const actualTurnNumber = turnNumber - 10;
  
        setCurrentPlayingTurn(turnNumber);
        setCurrentTurn(turnNumber); // Update current turn for the top-pill
        setIsPlaying(true);
  
        // Set the new audio source using the S3 URL
        const audioFile = `https://harris-trump-debate-audio.s3.us-east-2.amazonaws.com/turn${actualTurnNumber}.wav`;
        audioRef.current.src = audioFile;
  
        // Play the audio once it can play
        audioRef.current.oncanplay = () => {
          audioRef.current
            ?.play()
            .catch((error) => console.error("Error playing audio:", error));
        };
      } else {
        // If no turn is playing, ensure `isPlaying` is set to false
        setIsPlaying(false);
        setCurrentPlayingTurn(null);
      }
    }
  };

  const handleWordClick = (start: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = start;
      audioRef.current.play();
    }
  };

  const handleNextClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (currentTurn < turnsData.length) {
      setCurrentTurn(currentTurn + 1);
      setIsPlaying(false);
    }
  };

  const handleNextTurn = async () => {
    if (audioRef.current) {
      audioRef.current.pause(); // Pause the current audio to switch the source
    }

    let nextTurn = currentTurn + 1;

    // Skip specific turns without JSON
    if (nextTurn === 108) {
      nextTurn++; // Skip over turn 108 if it's missing the JSON
    }

    while (nextTurn <= turnsData.length) {
      try {
        // Attempt to load the next turn JSON file from S3
        const jsonUrl = `https://harris-trump-debate-audio.s3.us-east-2.amazonaws.com/turn${nextTurn}.json`;
        const response = await fetch(jsonUrl);

        // If JSON is missing or response fails, skip to the following turn
        if (!response.ok) {
          throw new Error(`Missing JSON for turn ${nextTurn}`);
        }

        // If JSON exists, parse the data and break out of the loop
        await response.json();
        break;
      } catch (error) {
        console.warn(`Skipping turn ${nextTurn} due to missing JSON`);
        nextTurn++;
      }
    }

    // Ensure we don't go beyond the available turns
    if (nextTurn <= turnsData.length) {
      setCurrentTurn(nextTurn); // Update the state to the next turn
      setCurrentPlayingTurn(nextTurn);

      // Update the audio source to the next turn
      if (audioRef.current) {
        const audioFile = `https://harris-trump-debate-audio.s3.us-east-2.amazonaws.com/turn${nextTurn}.wav`;
        audioRef.current.src = audioFile;

        if (isPlaying) {
          // Set isPlaying to true immediately to ensure the button shows the pause icon
          setIsPlaying(true);

          // Play the next turn's audio when it can play
          audioRef.current.oncanplay = () => {
            audioRef.current?.play().catch((error) => {
              console.error("Error playing next turn audio:", error);
            });
          };
        } else {
          // If audio was paused, ensure it remains paused
          setIsPlaying(false);
        }
      }
    }
  };

  const handleBackTurn = () => {
    if (audioRef.current) {
      audioRef.current.pause(); // Pause the current audio
    }
    setIsPlaying(false);

    // Move to the previous turn if available
    if (currentTurn > 1) {
      setCurrentTurn(currentTurn - 1);
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
          (sentence) =>
            currentTime >= sentence.start && currentTime <= sentence.end
        );

        if (
          foundSentenceIndex !== -1 &&
          foundSentenceIndex !== currentSentenceIndex
        ) {
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
    <div className="min-h-screen bg-cover bg-center backdrop-blur-[50px]">
      <div className="light absolute z-50 inset-0 h-[80px] w-full"></div>

      <div className="overlay bg-opacity-20 absolute z-0 inset-0 backdrop-blur-[200px] opacity-100"></div>

      <div
        className={`mainbody px-[10px] lg:px[20px] xl:px-[10vw] h-screen w-full pt-[90px] pb-[82px] bg-none overflow-y-auto scroll-smooth`}
      >
        <div className="feed w-full h-fit z-40 items-center justify-center flex">
          <div className="grid grid-cols-1 w-full h-fit gap-[24px]">
            <div className="box bg-[url('/bg/starting.webp')] bg-cover bg-center gap-[15px] md:gap-[25px] flex-col p-[10px] py-[20px]  md:px-[20px] !justify-start rounded-[20px] min-h-fit h-full">
                  <div className="box flex-col gap-[24px]">
                    <div className="">
                    <div className="text-4xl md:text-6xl text-center">
                     presidential debate

                    </div>
                    <div className="text-5xl md:text-7xl text-center">
                     2024

                    </div>
                    </div>
            
              <div className="candidates gap-[20px] items-center flex flex-col md:flex-row justify-between w-full">
                
                <div className="kamala">
                  <div className="rounded-[40px] overflow-hidden w-fit md:w-fit mx-auto border-[5px] black-opaque border-black winner h-fit">
                    <Image
                      src={getSpeakerImage("Kamala Harris")}
                      alt="Speaker Image"
                      width={180}
                      height={41}
                      className="block mx-auto"
                    />
                  </div>
                  <div className="text-center text-base md:text-lg poppins pt-1.5">
                    Kamala Harris
                  </div>
                </div>
                
       
                   

    
                    <Image
                              src={"icons/vote-icon.svg"}
                              alt="next"
                              height={60}
                              width={100}
                              />

                <div className="trump">
                  <div className="rounded-[40px] overflow-hidden w-fit md:w-fit mx-auto border-[5px] black-opaque border-black">
                    <Image
                      src={getSpeakerImage("Donald Trump")}
                      alt="Speaker Image"
                      width={180}
                      height={41}
                      className="block mx-auto"
                      />
                  </div>
                  <div className="text-center text-base md:text-lg poppins pt-1.5">
                    Donald Trump
                  </div>
                      </div>
            
                </div>

                

              </div>
            </div>
            {turnsData && turnsData.length > 0 ? (
              turnsData
                .filter((turn) => turn.turn >= 11)
                .map((turn: TurnData, index: number) => {
                  const turnCategory = turn.role || "segment";

                  return (
                    <FeedItem
                      key={index}
                      speaker={turn.speaker}
                      role={turn.role}
                      topic={turn.sentences?.[0]?.Headline?.[0] || "No Topic"}
                      turn_number={turn.turn}
                      turn_category={turnCategory}
                      title={turnCategory}
                      ethosScore={0}
                      pathosScore={0}
                      logosScore={0}
                      isPlaying={currentPlayingTurn === turn.turn}
                      currentPlayingTurn={currentPlayingTurn}
                      onPlay={handlePlay}
                      audioRef={audioRef}
                    />
                  );
                })
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>

        {/* header */}
        <div className="header -top-1 px-[10px] md:px-[20px] z-40 pb-[15px] fixed box flex-col w-full h-fit">
          <div
            onClick={() => setTranscriptOpen(!isTranscriptOpen)}
            className={`top-pill !flex-col cursor-pointer w-full max-w-[500px] nav-bar !blurry transition-all mt-3.5 rounded-[20px] px-[13px] py-[10px] box !justify-between ${
              isTranscriptOpen ? "h-[45vh] !max-w-full" : "h-[60px]"
            }`}
          >
            <div className="box">
              <div className="flex flex-row justify-between items-center gap-3 w-full">
                {/* Speaker Information */}
                <div className="flex flex-row items-center gap-3">
                  <div className="box current-speaker !w-[40px] !h-[40px] shadow justify-center items-center inline-flex rounded-full">
                    <Image
                      src={getSpeakerImage(speakerName)}
                      alt="Speaker Image"
                      width={40}
                      height={41}
                      className="block mx-auto rounded-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="current-name text-sm md:text-base">
                      {speakerName}
                    </div>
                    <div className="flex gap-1">
                      <div className="poppins text-xs md:text-sm -mt-1.5">
                        200 pts
                      </div>
                      <div className="poppins text-xs md:text-sm -mt-1.5">
                        •
                      </div>
                      <div className="poppins text-xs md:text-sm -mt-1.5">
                        {turnCategory || "No Category"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Speakers and Controls */}
                <div className="flex flex-row items-center gap-2">
                  <div
                    className="secondary-speaker hidden sm:flex flex-shrink-0 black-opaque rounded-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {nextSpeaker && (
                      <Image
                        src={
                          nextSpeaker === "Kamala Harris"
                            ? "/candidates/harris.webp"
                            : nextSpeaker === "Donald Trump"
                            ? "/candidates/trump.webp"
                            : nextSpeaker === "David Muir"
                            ? "/candidates/muir.webp"
                            : nextSpeaker === "Linsey Davis"
                            ? "/candidates/davis.webp"
                            : "/candidates/default.webp"
                        }
                        alt={nextSpeaker}
                        width={40}
                        height={40}
                        className="block mx-auto rounded-full"
                      />
                    )}
                  </div>
                  <div className="secondary-speaker">
                    <div className="w-[40px] h-[40px] flex-shrink-0 hidden sm:flex black-opaque rounded-full justify-center items-center text-base">
                      +2
                    </div>
                  </div>
                  <audio ref={audioRef} />
                  <div className="flex gap-4">
                    <button
                      className=""
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
                          width={32}
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
                          src={
                            isPlaying
                              ? "icons/pause-icon.svg"
                              : "icons/play-icon.svg"
                          }
                          alt={isPlaying ? "pause" : "play"}
                          height={40}
                          width={40}
                        />
                      </div>
                    </button>
                    <button
                      className=""
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent event from bubbling up
                        handleNextTurn();
                      }}
                    >
                      <div className="next-turn box invert text-white transition-all flex-shrink-0 w-[40px] h-[40px] opacity-90">
                        <Image
                          src={"icons/next-icon.svg"}
                          alt="next"
                          height={35}
                          width={32}
                        />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Transcript Section */}
            {isTranscriptOpen && (
              <div className="transcript-content custom-scrollbar h-full w-full rounded-[20px] black-opaque px-[15px] pt-[15px] pb-[10px] flex flex-col mt-3 overflow-y-auto">
                <div className="flex flex-row justify-end w-full"></div>
                <div className="flex flex-col">
                  {sentencesData.map((sentence, sentenceIndex) => {
                    // Determine the style for each sentence based on its playback state
                    let sentenceStyle = "text-gray-600 opacity-50"; // Default: Not yet played

                    if (sentenceIndex < currentSentenceIndex) {
                      sentenceStyle = "text-gray-500"; // Played sentences
                    } else if (sentenceIndex === currentSentenceIndex) {
                      sentenceStyle = "text-white"; // Currently playing sentence
                    }
                    return (
                      <div className="" key={sentenceIndex}>
                        <div
                          ref={
                            sentenceIndex === currentSentenceIndex
                              ? (el) => {
                                  if (el) {
                                    el.scrollIntoView({
                                      behavior: "smooth",
                                      block: "nearest",
                                    });
                                  }
                                }
                              : null
                          }
                          className={`${sentenceStyle} text-left !text-xl md:!text-2xl w-full lg:w-3/4 px-3 pb-2 mx-auto`}
                          onClick={(event) => event.stopPropagation()}
                        >
                          {wordData
                            .filter(
                              (word) =>
                                word.start >= sentence.start &&
                                word.end <= sentence.end
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
                                {word.punctuated_word + " "}
                              </span>
                            ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
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

export default HomePage;
