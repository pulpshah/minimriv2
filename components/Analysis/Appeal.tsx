import React, { useState, useMemo } from "react";
import { RadarChart } from "../ChartData";
import { GeneralAppealChart, EthosChart, PathosChart, LogosChart } from "../Chart/Appeal";
import AppealData from '@/public/data/Appeal.json';

interface AnalysisProps {
  ethosScore: number;
  pathosScore: number;
  logosScore: number;
  showChart: boolean;
  isModerator: boolean;
  turnNumber: number;
}

interface AppealSubcategory {
  axis_score: number;
  reasoning: string;
}

interface AppealTurnData {
  ethos: Record<string, AppealSubcategory>;
  pathos: Record<string, AppealSubcategory>;
  logos: Record<string, AppealSubcategory>;
}

const Appeal: React.FC<AnalysisProps> = ({
  ethosScore,
  pathosScore,
  logosScore,
  showChart,
  isModerator,
  turnNumber,
}) => {
  const [activeTab, setActiveTab] = useState<string>("summary");

  const currentTurnData: AppealTurnData | undefined = useMemo(() => {
    return AppealData[turnNumber - 1]; // Adjusting for 0-based index
  }, [turnNumber]);

  const getHighestScoringReasoning = (appealCategory: Record<string, AppealSubcategory>) => {
    if (!appealCategory) return "No reasoning available";
    let highestSubcategory = Object.values(appealCategory).reduce((highest, current) =>
      current.axis_score > highest.axis_score ? current : highest
    );
    return highestSubcategory.reasoning;
  };

  const ethosReasoning = currentTurnData
    ? getHighestScoringReasoning(currentTurnData.ethos)
    : "No reasoning available";

  const pathosReasoning = currentTurnData
    ? getHighestScoringReasoning(currentTurnData.pathos)
    : "No reasoning available";

  const logosReasoning = currentTurnData
    ? getHighestScoringReasoning(currentTurnData.logos)
    : "No reasoning available";

  return (
    <div className="analysis grid grid-cols-1 w-full h-fit gap-[25px]">
      {/* Appeal content and score */}
      <div className="appeal lg:mt-[50px] grid grid-cols-1 w-full h-fit gap-[20px] md:gap-[25px]">
        <div className="appeal-score box items-center flex-col lg:!justify-between lg:flex-row gap-[25px] lg:gap-[30px]">
          <div className="appeal w-fit h-fit">
            <div className="flex gap-2 text-6xl lg:text-8xl w-fit h-fit outline-text">
              <div className="flex w-fit md:gap-3 lg:gap-4">appeal</div>
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
          <div className="analysis-content grid grid-cols-1 xl:grid-cols-2 w-full rounded-[20px] black-card h-fit !bg-[url('/bg/appeal.webp')] !bg-cover !bg-center p-[10px] py-4 md:p-[20px]">
            <div className="chart box w-full h-fit px-[10%]">
            {activeTab === "summary" && (
              <GeneralAppealChart turnNum={turnNumber} />
            )}

            {activeTab === "ethos" && (
              <EthosChart turnNum={turnNumber} />
            )}

            {activeTab === "pathos" && (
              <PathosChart turnNum={turnNumber} />
            )}

            {activeTab === "logos" && (
              <LogosChart turnNum={turnNumber} />
            )}

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
                    {`${ethosReasoning} ${pathosReasoning} ${logosReasoning}`}
                    </div>
                  </div>
                  </div>
                </div>
              )}
              {activeTab === "ethos" && (
                <div className="ethos box">

                  <div className="!justify-start black-card box rounded-[20px] md:rounded-[20px] p-[10px] md:p-[25px] flex-col">
                  <div className="reasoning w-full text-left">
                    <div className="text-lg text-center md:text-xl">
                      Ethos
                    </div>
                    <div className="reasoning poppins text-sm md:text-[14px] md:text-md">
                      {ethosReasoning}
                    </div>
                  </div>
                  </div>
                </div>
              )}
              {activeTab === "pathos" && (
                <div className="pathos box">
                  
                  <div className="!justify-start black-card box rounded-[20px] md:rounded-[20px] p-[10px] md:p-[25px] flex-col">
                  <div className="reasoning w-full text-left">
                    <div className="text-lg text-center md:text-xl">
                      Pathos
                    </div>
                    <div className="reasoning poppins text-sm md:text-[14px] md:text-md">
                      {pathosReasoning}
                    </div>
                  </div>
                  </div>

                </div>
              )}
              {activeTab === "logos" && (
                <div className="logos box">
                  <div className="!justify-start black-card box rounded-[20px] md:rounded-[20px] p-[10px] md:p-[25px] flex-col">
                  <div className="reasoning w-full text-left">
                    <div className="text-lg text-center md:text-xl">
                      Logos
                    </div>
                    <div className="reasoning poppins text-sm md:text-[14px] md:text-md">
                      {logosReasoning}
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
              activeTab === "ethos" ? "active" : ""
            }`}
            onClick={() => setActiveTab("ethos")}
          >
            2
          </button>
          <button
            className={`px-[10px] py-[1px] rounded-[20px] tab-btn ${
              activeTab === "pathos" ? "active" : ""
            }`}
            onClick={() => setActiveTab("pathos")}
          >
            3
          </button>
          <button
            className={` px-[10px] py-[1px] rounded-[20px] tab-btn ${
              activeTab === "logos" ? "active" : ""
            }`}
            onClick={() => setActiveTab("logos")}
          >
            4
          </button>
        </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Appeal;
