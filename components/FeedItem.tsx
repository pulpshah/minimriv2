import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { RadarChart } from "./ChartData";
import Appeal from "./Analysis/Appeal";
import { Dispatch, SetStateAction } from "react";
import Clarity from "./Analysis/Clarity";
import Critical from "./Analysis/Critical";
import Style from "./Analysis/Style";
import Total from "./Analysis/Total";

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
  onPlay: (turnNumber: number | null) => void; // Updated type to allow null
}

interface AnalysisProps {
  ethosScore: number;
  pathosScore: number;
  logosScore: number;
  showChart: boolean;
  activeTab: string; // Add this line to the interface
  setActiveTab: Dispatch<SetStateAction<string>>;
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
        className={`box gap-[15px] md:gap-[25px] flex-col p-[10px] md:px-[20px] !justify-start white-opaque rounded-[40px] min-h-fit h-full ${
          isQuestion ? "black-opaque" : "white-opaque"
        }`}
      >
        <div className="title-turn-play px-2 md:px-0 flex flex-row justify-between items-center h-fit w-full">
          <div
            className={`feed-text w-fit !text-lg md:!text-xl h-fit flex flex-row items-center justify-start gap-[10px] ${
              isQuestion ? "text-white" : "text-black"
            }`}
          >
            <span>{title}</span>
          </div>

          <div className="turn-play w-fit h-fit flex flex-row justify-end items-center gap-2">
            <div
              className={`turn flex w-fit !shadow-none text-base md:text-lg h-fit px-[3px] max-sm:px-[1px] py-[1px] items-center rounded-full box ${
                isQuestion ? "white-opaque" : "black-opaque"
              }`}
            >
              Turn {turn_number}
            </div>

            <button onClick={handlePlayPause}>
              <Image
                className={`cursor-pointer ${isQuestion ? "invert" : ""}`}
                src={
                  isPlaying ? "/icons/pause-icon.svg" : "/icons/play-icon.svg"
                }
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
            <div
              className={`w-full max-sm:text-3xl max-sm:!leading-none mx-auto ${
                isQuestion ? "text-white" : ""
              }`}
            >
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
          <div className="rounded-[40px] overflow-hidden w-3/4 md:w-fit mx-auto border-[5px] black-opaque border-black h-fit">
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
                isQuestion={isQuestion}
              />
            )}

            {/* You can add conditional rendering for other tabs here */}
            {mainTab === "total" && (
              <div>
                <Total
                  ethosScore={ethosScore}
                  pathosScore={pathosScore}
                  logosScore={logosScore}
                  showChart={showChart}
                  isQuestion={isQuestion}
                />
              </div>
            )}
            {mainTab === "style" && (
              <div>
                <Style
                  ethosScore={ethosScore}
                  pathosScore={pathosScore}
                  logosScore={logosScore}
                  showChart={showChart}
                  isQuestion={isQuestion}
                />
              </div>
            )}
            {mainTab === "clarity" && (
              <div>
                <Clarity
                  ethosScore={ethosScore}
                  pathosScore={pathosScore}
                  logosScore={logosScore}
                  showChart={showChart}
                  isQuestion={isQuestion}
                />
              </div>
            )}
            {mainTab === "criticalThinking" && (
              <div>
                <Critical
                  ethosScore={ethosScore}
                  pathosScore={pathosScore}
                  logosScore={logosScore}
                  showChart={showChart}
                  isQuestion={isQuestion}
                />
              </div>
            )}
            {/* Tab buttons */}
            <div className="tabs flex justify-center gap-5 md:gap-6 my-4 text-xl items-center">
              <button
                className={`flex gap-2 transition-all ${
                  mainTab === "total" ? "opacity-100" : "opacity-50"
                }`}
                onClick={() => setMainTab("total")}
              >
                <div className="hidden md:flex">Total</div>
                <Image
                  src="/icons/arrow-user.svg"
                  alt=""
                  width={28}
                  height={28}
                  className="block mx-auto"
                />
              </button>

              <button
                className={`flex items-center transition-all gap-2 ${
                  mainTab === "appeal" ? "opacity-100" : "opacity-50"
                }`}
                onClick={() => setMainTab("appeal")}
              >
                <div className="hidden md:flex">Appeal</div>
                <Image
                  src="/icons/hearts-icon.svg"
                  alt=""
                  width={28}
                  height={28}
                  className="block mx-auto"
                />
              </button>

              <button
                className={`flex gap-2 items-center transition-all ${
                  mainTab === "style" ? "opacity-100" : "opacity-50"
                }`}
                onClick={() => setMainTab("style")}
              >
                <div className="hidden md:flex">Style</div>
                <Image
                  src="/icons/star-icon.svg"
                  alt=""
                  width={28}
                  height={28}
                  className="block mx-auto"
                />
              </button>

              <button
                className={`flex gap-2 items-center transition-all ${
                  mainTab === "clarity" ? "opacity-100" : "opacity-50"
                }`}
                onClick={() => setMainTab("clarity")}
              >
                <div className="hidden md:flex">Clarity</div>
                <Image
                  src="/icons/target-icon.svg"
                  alt=""
                  width={28}
                  height={28}
                  className="block mx-auto"
                />
              </button>

              <button
                className={`flex gap-2 items-center transition-all ${
                  mainTab === "criticalThinking" ? "opacity-100" : "opacity-50"
                }`}
                onClick={() => setMainTab("criticalThinking")}
              >
                <div className="hidden md:flex">Critical Thinking</div>
                <Image
                  src="/icons/zap-icon.svg"
                  alt="clarity"
                  width={28}
                  height={28}
                  className="block mx-auto"
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedItem;
