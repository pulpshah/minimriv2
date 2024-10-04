import React, { useState, useMemo } from "react";
import { RadarChart } from "../ChartData";
import { StyleChart } from "../Chart/Style.jsx";
import StyleData from "@/public/data/Style.json";

interface AnalysisProps {
  ethosScore: number;
  pathosScore: number;
  logosScore: number;
  showChart: boolean;
  isModerator: boolean;
  turnNumber: number;
}

type StyleSubcategory = {
  score: number;
  confidence: number;
  reasoning: string;
};

type StyleCategory = {
  Tone?: StyleSubcategory;
  Humor?: StyleSubcategory;
  Callbacks?: StyleSubcategory;
  Imagery?: StyleSubcategory;
  Symbolism?: StyleSubcategory;
  Metaphors?: StyleSubcategory;
  Analogies?: StyleSubcategory;
  Repetition?: StyleSubcategory;
  Emphasis?: StyleSubcategory;
  Alliteration?: StyleSubcategory;
};

interface Sentence {
  SentenceNum: number;
  Style: StyleCategory | StyleCategory[]; // Update to reflect that Style can be either an object or an array
}

interface Turn {
  Sentence: Sentence[];
}

const Style: React.FC<AnalysisProps> = ({
  ethosScore,
  pathosScore,
  logosScore,
  showChart,
  isModerator,
  turnNumber,
}) => {
  const [activeTab, setActiveTab] = useState<string>("summary");

  // Access the correct turn data from the StyleData array using turnNumber
  const turnData = StyleData[turnNumber - 1]; // Adjust for 0-based indexing

  // Helper function to get the correct Style object
  const getStyleObject = (
    style: StyleCategory | StyleCategory[]
  ): StyleCategory => {
    return Array.isArray(style) ? style[0] : style;
  };

  // Memoized function to compute the highest tone reasoning
  const highestToneReasoning = useMemo(() => {
    if (!turnData || !turnData.Sentence) {
      return "No reasoning available for Tone & Demeanor.";
    }

    let highestScore = -1;
    let highestReasoning = "No reasoning available for Tone & Demeanor.";

    turnData.Sentence.forEach((sentence) => {
      const style = getStyleObject(sentence.Style);
      const toneData = style?.Tone;

      if (toneData && toneData.score > highestScore) {
        highestScore = toneData.score;
        highestReasoning = toneData.reasoning;
      }
    });

    return highestReasoning;
  }, [turnData]);

  // Memoized function to compute the highest rhetorical devices reasoning
  const highestRhetoricalDevicesReasoning = useMemo(() => {
    if (!turnData || !turnData.Sentence) {
      return "No reasoning available for Rhetorical Devices.";
    }

    let highestScore = -1;
    let highestReasoning = "No reasoning available for Rhetorical Devices.";

    turnData.Sentence.forEach((sentence) => {
      const style = getStyleObject(sentence.Style);

      if (style) {
        const keys = [
          "Humor",
          "Callbacks",
          "Imagery",
          "Symbolism",
          "Metaphors",
          "Analogies",
          "Repetition",
          "Emphasis",
          "Alliteration",
        ] as (keyof StyleCategory)[];

        keys.forEach((key) => {
          const subCategory = style[key];
          if (subCategory && subCategory.score > highestScore) {
            highestScore = subCategory.score;
            highestReasoning = subCategory.reasoning;
          }
        });
      }
    });

    return highestReasoning;
  }, [turnData]);

  // Summary reasoning concatenating tone and rhetorical devices reasoning
  const summaryReasoning =
    `${highestToneReasoning} ${highestRhetoricalDevicesReasoning}`.trim();

  return (
    <div className="analysis grid grid-cols-1 w-full h-fit gap-[25px]">
      {/* Appeal content and score */}
      <div className="appeal lg:mt-[50px] grid grid-cols-1 w-full h-fit gap-[20px] md:gap-[25px]">
        <div className="appeal-score box items-center flex-col lg:!justify-between lg:flex-row gap-[25px] lg:gap-[30px]">
          <div className="appeal w-fit h-fit">
            <div className="flex gap-2 text-6xl lg:text-8xl w-fit h-fit outline-text">
              <div className="flex w-fit md:gap-3 lg:gap-4">style</div>
            </div>
          </div>
          <div className="w-fit text-center hidden h-fit lg:text-left lg:w-[802px] lg:flex justify-start text-sm md:text-base">
            Appeal Score evaluates the effectiveness of the speaker's use of
            rhetorical appeals—ethos (credibility), pathos (emotion), and logos
            (logic). It assesses how well the speaker connects with the
            audience, persuades through emotional resonance, and presents
            logical arguments. A higher appeal score indicates a stronger
            persuasive impact on the audience.
          </div>
        </div>
        {showChart && (
          <div className="analysis-content grid grid-cols-1 xl:grid-cols-2 w-full rounded-[20px] black-card h-fit !bg-[url('/bg/style.webp')] !bg-cover !bg-center p-[10px] py-4 md:p-[20px]">
            <div className="chart box w-full h-fit p-6 text-black scale-110 px-[10%]">
              <StyleChart turnNum={turnNumber} />
            </div>
            <div className="textual-annotation box flex flex-col gap-[20px]">
              {activeTab === "summary" && (
                <div className="summary box ">
                  <div className="!justify-start black-card box rounded-[20px] md:rounded-[20px] p-[10px] md:p-[25px] flex-col">
                    <div className="reasoning w-full text-left">
                      <div className="text-lg text-center md:text-xl">
                        Summary
                      </div>
                      <div className="reasoning poppins text-sm md:text-[14px] md:text-md">
                        {summaryReasoning}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "toneAndDemeanor" && (
                <div className="toneAndDemeanor box">
                  <div className="!justify-start black-card box rounded-[20px] md:rounded-[20px] p-[10px] md:p-[25px] flex-col">
                    <div className="reasoning w-full text-left">
                      <div className="text-lg text-center md:text-xl">
                        Tone and Demeanor
                      </div>
                      <div className="reasoning poppins text-sm md:text-[14px] md:text-md">
                        {highestToneReasoning}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "rhetoricalDevices" && (
                <div className="rhetoricalDevices box">
                  <div className="!justify-start black-card box rounded-[20px] md:rounded-[20px] p-[10px] md:p-[25px] flex-col">
                    <div className="reasoning w-full text-left">
                      <div className="text-lg text-center md:text-xl">
                        Use of Rhetorical Devices
                      </div>
                      <div className="reasoning poppins  text-sm md:text-[14px] md:text-md">
                        {highestRhetoricalDevicesReasoning}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div
                className={`tabs flex w-fit !shadow-none text-lg md:text-xl h-fit px-[12px] py-[1px] items-center rounded-full mx-auto gap-2 !bg-transparent ${
                  isModerator ? "white-opaque" : "black-card"
                }`}
              >
                <button
                  className={`px-[10px] py-[1px] rounded-[20px] tab-btn ${
                    activeTab === "summary" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("summary")}
                >
                  1
                </button>
                <button
                  className={`px-[10px] py-[1px] rounded-[20px] tab-btn ${
                    activeTab === "toneAndDemeanor" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("toneAndDemeanor")}
                >
                  2
                </button>
                <button
                  className={`px-[10px] py-[1px] rounded-[20px] tab-btn ${
                    activeTab === "rhetoricalDevices" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("rhetoricalDevices")}
                >
                  3
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Style;
