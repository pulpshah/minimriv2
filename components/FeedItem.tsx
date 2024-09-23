import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { RadarChart } from "./ChartData";
import Appeal from "@/components/Appeal";  // Import the new component
import Clarity from "./Clarity";
import Critical from "./Critical";
import Style from "./Style";
import Total from "./Total";

interface FeedItemProps {
  turn_number: number;
  title: string;
  topic: string;
  speaker: string;
  ethosScore: number;
  pathosScore: number;
  logosScore: number;
  turn_category: string;
  isPlaying: boolean;
  onPlay: (turnNumber: number) => void;
}

interface AnalysisProps {
  ethosScore: number;
  pathosScore: number;
  logosScore: number;
  showChart: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isQuestion: boolean;
}

const FeedItem: React.FC<FeedItemProps> = ({
  turn_number,
  title,
  topic,
  speaker,
  ethosScore,
  pathosScore,
  logosScore,
  turn_category,
  isPlaying,
  onPlay,
}) => {
  const [mainTab, setMainTab] = useState("total");


  const audioRef = useRef<HTMLAudioElement>(null);
  
  const getAudioFile = () => {
    return `/audio/turn${turn_number}.wav`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      onPlay(null);
    } else {
      onPlay(turn_number);
    }
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isPlaying]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const handleEnded = () => onPlay(null);
      audioElement.addEventListener("ended", handleEnded);

      return () => {
        audioElement.removeEventListener("ended", handleEnded);
      };
    }
  }, [onPlay]);

  const audioFile = getAudioFile();

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
  const [activeTab, setActiveTab] = useState<string>("ethos"); 
  const showChart = speaker === "Kamala Harris" || speaker === "Donald Trump";

  const isQuestion = title.toLowerCase() === "question";
  const isRebuttal = title.toLowerCase() === "rebuttal";

  return (
    <div
      className={`graph box w-full h-fit gap-[25px] ${
        isQuestion
          ? "bg-question-color"
          : isRebuttal
          ? "bg-rebuttal-color"
          : "bg-answer-color"
      }`}
    >
      <div
        className={`box gap-[25px] flex-col p-[20px] !justify-start white-opaque rounded-[40px] min-h-fit h-full ${
          isQuestion ? "black-opaque" : "white-opaque"
        }`}
      >
        <div className="title-turn-play flex flex-row justify-between items-center h-fit w-full">
          <div
            className={`feed-text w-fit !text-lg md:!text-xl h-fit flex flex-row items-center justify-start gap-[10px] ${
              isQuestion ? "text-white" : "text-black"
            }`}
          >
            <span>{title}</span>
          </div>

          <div className="turn-play w-fit h-fit flex flex-row justify-end items-center gap-[5px]">
            <div
              className={`turn flex w-fit !shadow-none text-lg md:text-xl h-fit px-[5px] py-[1px] items-center rounded-full box ${
                isQuestion ? "white-opaque" : "black-opaque"
              }`}
            >
              Turn {turn_number}
            </div>

            <button onClick={handlePlayPause}>
              <Image
                className={`cursor-pointer ${isQuestion ? "invert" : ""}`}
                src={isPlaying ? "/icons/pause-icon.svg" : "/icons/feed-play.svg"} 
                alt={isPlaying ? "Pause" : "Play"}
                height={44}
                width={47}
              />
            </button>
            <audio ref={audioRef} src={audioFile} preload="auto" />
          </div>
        </div>

        <div className="w-full h-full box">
          <div className="topic-text auth-text !text-black flex flex-col md:flex-row gap-[8px]">
            <div className={`w-full mx-auto ${isQuestion ? "text-white" : ""}`}>
              {isQuestion
                ? "Let's talk about"
                : isRebuttal
                ? "My rebuttal On"
                : "My thoughts on"}
              <div className="text-white topic-outline">
                {isQuestion || isRebuttal ? `${topic}.` : `${topic},`}
              </div>
            </div>
          </div>
        </div>

        <div className="candidate">
          <div className="rounded-[40px] overflow-hidden w-fit border-[5px] black-opaque border-black h-fit">
            <Image
              src={getSpeakerImage(speaker)}
              alt="Speaker Image"
              width={180}
              height={41}
              className="block mx-auto"
            />
          </div>
          <div className="text-center text-base md:text-lg poppins pt-1.5">
            {speaker}
          </div>
        </div>

        {isQuestion ? (
          <div className="question flex"></div>
        ) : (
          <div className="box flex-col">
        
          {/* Conditionally render the Appeal component only when the Appeal tab is active */}
          {mainTab === "appeal" && (
            <Appeal
              ethosScore={ethosScore}
              pathosScore={pathosScore}
              logosScore={logosScore}
              showChart={showChart}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isQuestion={isQuestion}
            />
          )}
        
          {/* You can add conditional rendering for other tabs here */}
          {mainTab === "total" && <div>
            <Total
              ethosScore={ethosScore}
              pathosScore={pathosScore}
              logosScore={logosScore}
              showChart={showChart}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isQuestion={isQuestion}
            />
          </div>}
          {mainTab === "style" && <div>
            <Style
              ethosScore={ethosScore}
              pathosScore={pathosScore}
              logosScore={logosScore}
              showChart={showChart}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isQuestion={isQuestion}
            />
          </div>}
          {mainTab === "clarity" && <div>
            <Clarity
              ethosScore={ethosScore}
              pathosScore={pathosScore}
              logosScore={logosScore}
              showChart={showChart}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isQuestion={isQuestion}
            /></div>}
          {mainTab === "criticalThinking" && <div>
            <Critical
              ethosScore={ethosScore}
              pathosScore={pathosScore}
              logosScore={logosScore}
              showChart={showChart}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isQuestion={isQuestion}
            />
            </div>}
          {/* Tab buttons */}
          <div className="tabs flex justify-center gap-5 md:gap-6 my-4 text-xl items-center">
            <button className="flex gap-2" onClick={() => setMainTab("total")}>
            <div className="hidden md:flex">Total</div>
              <Image
              src="/icons/hearts-icon.svg"
              alt=""
              width={28}
              height={28}
              className="block mx-auto"
              />

            </button>
            <button className="flex items-center gap-2" onClick={() => setMainTab("appeal")}>
             <div className="hidden md:flex">Clarity</div>
              <Image
              src="/icons/hearts-icon.svg"
              alt=""
              width={28}
              height={28}
              className="block mx-auto"
              />
            </button>

            <button className="flex gap-2 items-center" onClick={() => setMainTab("style")}>
              <div className="hidden md:flex">Style</div>
            <Image
              src="/icons/star-icon.svg"
              alt=""
              width={28}
              height={28}
              className="block mx-auto"
              />
            </button>

            <button className="flex gap-2 items-center" onClick={() => setMainTab("clarity")}>
              <div className="hidden md:flex">Clarity</div>
              <Image
              src="/icons/target-icon.svg"
              alt=""
              width={28}
              height={28}
              className="block mx-auto"
              />
            </button>

            <button className="flex gap-2 items-center" onClick={() => setMainTab("criticalThinking")}>
              <div className="hidden md:flex">Critical Thinking</div>
              <Image
              src="/icons/zap-icon.svg"
              alt="clarity"
              width={28}
              height={28}
              className="block mx-auto"
              /></button>
          </div>
        </div>
        

        )}
      </div>
    </div>
  );
};

export default FeedItem;
