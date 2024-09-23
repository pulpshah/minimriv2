import React from "react";
import Image from "next/image";
import { RadarChart } from "./ChartData";
import Analysis from "@/components/Analysis";  // Import the new component
import { useState } from "react";  



interface FeedItemProps {
  turn_number: number;
  title: string;
  topic: string;
  speaker: string;
  ethosScore: number;
  pathosScore: number;
  logosScore: number;
}

interface AnalysisProps {
  ethosScore: number;
  pathosScore: number;
  logosScore: number;
  showChart: boolean;
  activeTab: string; // Add this line
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
}) => {
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
              turn {turn_number}
            </div>

            <button>
              <Image
                className={`cursor-pointer ${isQuestion ? "invert" : ""}`}
                src="/icons/feed-play.svg"
                alt="Fetch"
                height={44}
                width={47}
              />
            </button>
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
        



        {/* Content */}
        {isQuestion ? (
          <div className="question flex"></div>
        ) : (
      <Analysis
        ethosScore={ethosScore}
        pathosScore={pathosScore}
        logosScore={logosScore}
        showChart={showChart}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isQuestion={isQuestion}
      />

        )}
      </div>
    </div>
  );
};

export default FeedItem;
