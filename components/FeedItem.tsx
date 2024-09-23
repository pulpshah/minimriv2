import React from "react";
import Image from "next/image";
import { RadarChart } from "./ChartData";

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
          <div className="analysis grid grid-cols-1 w-full h-fit gap-[25px]">
            
            {/* Appeal content and score */}
            <div className="appeal lg:mt-[50px] grid grid-cols-1 w-full h-fit gap-[25px]">

              <div className="appeal-score box items-center flex-col lg:!justify-between lg:flex-row gap-[25px] lg:gap-[30px]">
                
                <div className="appeal w-fit h-fit">
                  <div className="flex gap-2 text-7xl lg:text-9xl w-fit h-fit outline-text">
                    <div className="flex w-fit md:gap-3 lg:gap-4">appeal</div>
                  </div>
                </div>
                <div className="w-fit text-center h-fit lg:text-left lg:w-[802px] flex justify-start text-lg">
                  Appeal Score evaluates the effectiveness of the speaker's use of
                  rhetorical appeals—ethos (credibility), pathos (emotion), and
                  logos (logic). It assesses how well the speaker connects with
                  the audience, persuades through emotional resonance, and
                  presents logical arguments. A higher appeal score indicates a
                  stronger persuasive impact on the audience.
                </div>
              </div>
              {showChart && (
                <div className="analysis-content grid grid-cols-1 lg:grid-cols-2 w-full rounded-[40px] black-opaque h-fit !bg-[url('/bg/analysis.webp')] !bg-cover !bg-center p-[24px]">
                  <div className="chart box w-full h-fit">

                      <RadarChart ethos={ethosScore} pathos={pathosScore} logos={logosScore} />
                  </div>
                  <div className="textual-annotation box">
                  {activeTab === "summary" && (
                      <div className="summary box poppins">
                        Ethos refers to the ethical appeal or credibility of the speaker, encompassing attributes like trustworthiness, expertise, and authority.
                      </div>
                    )}
                    {activeTab === "ethos" && (
                      <div className="ethos box poppins">
                        Ethos refers to the ethical appeal or credibility of the speaker, encompassing attributes like trustworthiness, expertise, and authority.
                      </div>
                    )}
                    {activeTab === "pathos" && (
                      <div className="pathos box poppins">
                        Pathos appeals to the emotions of the audience. It involves creating an emotional response to convince the audience of an argument.
                      </div>
                    )}
                    {activeTab === "logos" && (
                      <div className="logos box poppins">
                        Logos refers to the logical appeal or the use of reason. It often includes the use of facts and statistics to support arguments.
                      </div>
                    )}
                  </div>
                </div>
)}

                <div className={`turn flex w-fit !shadow-none text-lg md:text-xl h-fit px-[12px] py-[1px] items-center rounded-full mx-auto gap-3 ${
                  isQuestion ? "white-opaque" : "black-opaque"
                }`}>
                  <button
                    className={`px-2 py-[2px] rounded-[40px] tab-btn ${activeTab === "summary" ? "active" : ""}`}
                    onClick={() => setActiveTab("summary")}
                  >
                    All
                  </button>
                  <button
                    className={`px-2 py-[2px] rounded-[40px] tab-btn ${activeTab === "ethos" ? "active" : ""}`}
                    onClick={() => setActiveTab("ethos")}
                  >
                    Ethos
                  </button>
                  <button
                    className={`px-2 py-[2px] rounded-[40px] tab-btn ${activeTab === "pathos" ? "active" : ""}`}
                    onClick={() => setActiveTab("pathos")}
                  >
                    Pathos
                  </button>
                  <button
                    className={` px-2 py-[2px] rounded-[40px] tab-btn ${activeTab === "logos" ? "active" : ""}`}
                    onClick={() => setActiveTab("logos")}
                  >
                    Logos
                  </button>
                </div>


            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedItem;
