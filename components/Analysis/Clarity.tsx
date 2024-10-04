import React, { useState, useMemo } from "react";
import { RadarChart } from "../ChartData";
import { ClarityChart } from "../Chart/Clarity.jsx";
import ClarityData from '@/public/data/Clarity.json';

interface AnalysisProps {
  showChart: boolean;
  isModerator: boolean;
  turnNumber: number;
}

type ClaritySubcategory = {
  score: number;
  confidence: number;
  reasoning: string;
};

type ClarityDataType = {
  IntentionClarity: ClaritySubcategory;
  PrecisionOfLanguage: ClaritySubcategory;
  LackOfAmbiguity: ClaritySubcategory;
  Brevity: ClaritySubcategory;
  AvoidanceOfRedundancy: ClaritySubcategory;
  EfficiencyOfStructure: ClaritySubcategory;
  RelevanceToTopic: ClaritySubcategory;
  AvoidanceOfTangents: ClaritySubcategory;
  ConsistencyWithCentralTheme: ClaritySubcategory;
  LogicalFlow: ClaritySubcategory;
  UseOfTransitions: ClaritySubcategory;
  SentenceConnectivity: ClaritySubcategory;
  OverallStructure: ClaritySubcategory;
  SimplicityOfArgument: ClaritySubcategory;
  ConsistencyOfIdeas: ClaritySubcategory;
};

type ClarityDataArrayType = {
  Clarity: ClarityDataType[];
}[];

const Clarity: React.FC<AnalysisProps> = ({
  showChart,
  isModerator,
  turnNumber,
}) => {
  const [activeTab, setActiveTab] = useState<string>("summary");

  // Extract data for the given turn number
  const turnData = (ClarityData as ClarityDataArrayType)[turnNumber];
  const memoizedChart = useMemo(() => <ClarityChart turnNum={turnNumber} />, [turnNumber]);

  // Helper function to get the highest scoring subcategory's reasoning
  const getHighestReasoning = (categoryKeys: (keyof ClarityDataType)[]) => {
    let highestScore = -1;
    let highestReasoning = "";

    categoryKeys.forEach((key) => {
      const subCategory = turnData?.Clarity[0]?.[key];
      if (subCategory && subCategory.score > highestScore) {
        highestScore = subCategory.score;
        highestReasoning = subCategory.reasoning;
      }
    });

    return highestReasoning;
  };

  const explicitnessKeys: (keyof ClarityDataType)[] = [
    "IntentionClarity",
    "PrecisionOfLanguage",
    "LackOfAmbiguity"
  ];
  const concisionKeys: (keyof ClarityDataType)[] = [
    "Brevity",
    "AvoidanceOfRedundancy",
    "EfficiencyOfStructure"
  ];
  const focusKeys: (keyof ClarityDataType)[] = [
    "RelevanceToTopic",
    "AvoidanceOfTangents",
    "ConsistencyWithCentralTheme"
  ];
  const cohesionKeys: (keyof ClarityDataType)[] = [
    "LogicalFlow",
    "UseOfTransitions",
    "SentenceConnectivity"
  ];
  const coherenceKeys: (keyof ClarityDataType)[] = [
    "OverallStructure",
    "SimplicityOfArgument",
    "ConsistencyOfIdeas"
  ];

  const explicitnessReasoning = getHighestReasoning(explicitnessKeys);
  const concisionReasoning = getHighestReasoning(concisionKeys);
  const focusReasoning = getHighestReasoning(focusKeys);
  const cohesionReasoning = getHighestReasoning(cohesionKeys);
  const coherenceReasoning = getHighestReasoning(coherenceKeys);


  return (
    <div className="analysis grid grid-cols-1 w-full h-fit gap-[25px]">
      {/* Appeal content and score */}
      <div className="appeal lg:mt-[50px] grid grid-cols-1 w-full h-fit gap-[20px] md:gap-[25px]">
        <div className="appeal-score box items-center flex-col lg:!justify-between lg:flex-row gap-[25px] lg:gap-[30px]">
          <div className="appeal w-fit h-fit">
            <div className="flex gap-2 text-6xl lg:text-8xl w-fit h-fit outline-text">
              <div className="flex w-fit md:gap-3 lg:gap-4">clarity</div>
            </div>
          </div>
          <div className="w-fit text-center hidden h-fit lg:text-left lg:w-[802px] lg:flex justify-start text-sm md:text-base">
            Appeal Score evaluates the effectiveness of the speaker's use of
            rhetorical appeals—explicitness (credibility), concision (emotion), and focus
            (logic). It assesses how well the speaker connects with the
            audience, persuades through emotional resonance, and presents
            logical arguments. A higher appeal score indicates a stronger
            persuasive impact on the audience.
          </div>
        </div>
          <div className="analysis-content grid grid-cols-1 xl:grid-cols-2 w-full rounded-[20px] black-card h-fit !bg-[url('/bg/clarity.webp')] !bg-cover !bg-center p-[10px] py-4 md:p-[20px]">
            <div className="chart scale-[118%] ps-6 p-20 box w-full ">
              {memoizedChart}
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
                      {`${explicitnessReasoning} ${concisionReasoning} ${focusReasoning} ${cohesionReasoning} ${coherenceReasoning}`}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "explicitness" && (
                <div className="explicitness box">
                  <div className="!justify-start black-card box rounded-[20px] md:rounded-[20px] p-[10px] md:p-[25px] flex-col">
                    <div className="reasoning w-full text-left">
                      <div className="text-lg text-center md:text-xl">
                        Explicitness
                      </div>
                      <div className="reasoning poppins text-sm md:text-[14px] md:text-md">
                        {explicitnessReasoning}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "concision" && (
                <div className="concision box">
                  <div className="!justify-start black-card box rounded-[20px] md:rounded-[20px] p-[10px] md:p-[25px] flex-col">
                    <div className="reasoning w-full text-left">
                      <div className="text-lg text-center md:text-xl">
                        Concision
                      </div>
                      <div className="reasoning poppins text-sm md:text-[14px] md:text-md">
                        {concisionReasoning}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "focus" && (
                <div className="focus box">
                  <div className="!justify-start black-card box rounded-[20px] md:rounded-[20px] p-[10px] md:p-[25px] flex-col">
                    <div className="reasoning w-full text-left">
                      <div className="text-lg text-center md:text-xl">
                        Focus
                      </div>
                      <div className="reasoning poppins text-sm md:text-[14px] md:text-md">
                        {focusReasoning}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "cohesion" && (
                <div className="focus box">
                  <div className="!justify-start black-card box rounded-[20px] md:rounded-[20px] p-[10px] md:p-[25px] flex-col">
                    <div className="reasoning w-full text-left">
                      <div className="text-lg text-center md:text-xl">
                        Cohesion
                      </div>
                      <div className="reasoning poppins text-sm md:text-[14px] md:text-md">
                        {cohesionReasoning}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "coherence" && (
                <div className="focus box">
                  <div className="!justify-start black-card box rounded-[20px] md:rounded-[20px] p-[10px] md:p-[25px] flex-col">
                    <div className="reasoning w-full text-left">
                      <div className="text-lg text-center md:text-xl">
                        Coherence
                      </div>
                      <div className="reasoning poppins text-sm md:text-[14px] md:text-md">
                        {coherenceReasoning}
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
              activeTab === "explicitness" ? "active" : ""
            }`}
            onClick={() => setActiveTab("explicitness")}
          >
            2
          </button>
          <button
            className={`px-[10px] py-[1px] rounded-[20px] tab-btn ${
              activeTab === "concision" ? "active" : ""
            }`}
            onClick={() => setActiveTab("concision")}
          >
            3
          </button>
          <button
            className={` px-[10px] py-[1px] rounded-[20px] tab-btn ${
              activeTab === "focus" ? "active" : ""
            }`}
            onClick={() => setActiveTab("focus")}
          >
            4
          </button>
          <button
            className={` px-[10px] py-[1px] rounded-[20px] tab-btn ${
              activeTab === "cohesion" ? "active" : ""
            }`}
            onClick={() => setActiveTab("cohesion")}
          >
            5
          </button>
          <button
            className={` px-[10px] py-[1px] rounded-[20px] tab-btn ${
              activeTab === "coherence" ? "active" : ""
            }`}
            onClick={() => setActiveTab("coherence")}
          >
            6
          </button>
        </div>
            </div>
          </div>
        
      </div>
    </div>
  );
};

export default Clarity;
