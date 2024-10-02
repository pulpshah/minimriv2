import React, { useState } from "react";
import { RadarChart } from "../ChartData";
import { StyleChart } from "../Chart/Style.jsx";

interface AnalysisProps {
  ethosScore: number;
  pathosScore: number;
  logosScore: number;
  showChart: boolean;
  isModerator: boolean;
}

const Style: React.FC<AnalysisProps> = ({
  ethosScore,
  pathosScore,
  logosScore,
  showChart,
  isModerator,
}) => {
  const [activeTab, setActiveTab] = useState<string>("ethos");

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
          <div className="analysis-content grid grid-cols-1 xl:grid-cols-2 w-full rounded-[40px] black-card h-fit !bg-[url('/bg/style.webp')] !bg-cover !bg-center p-[10px] py-4 md:p-[20px]">
            <div className="chart box w-full h-fit px-[10%]">
            {activeTab === "summary" && (
              <RadarChart ethos={ethosScore} pathos={pathosScore} logos={logosScore} />
            )}

            {activeTab === "ethos" && (
              <StyleChart turnNum={1} />
            )}

            {activeTab === "pathos" && (
              <RadarChart ethos={ethosScore} pathos={pathosScore} logos={logosScore} />
            )}

            {activeTab === "logos" && (
              <RadarChart ethos={ethosScore} pathos={pathosScore} logos={logosScore} />
            )}

            </div>
            <div className="textual-annotation box flex flex-col gap-[20px]">
              
              {activeTab === "summary" && (
                <div className="summary box ">

                  <div className="!justify-start black-card box rounded-[20px] md:rounded-[40px] p-[10px] md:p-[25px] flex-col">
                  <div className="reasoning w-full text-left">
                    <div className="text-lg text-center md:text-xl">
                      Summary
                    </div>
                    <div className="reasoning poppins text-sm md:text-[14px] md:text-md">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                    </div>
                  </div>
                  </div>
                </div>
              )}
              {activeTab === "ethos" && (
                <div className="ethos box">

                  <div className="!justify-start black-card box rounded-[20px] md:rounded-[40px] p-[10px] md:p-[25px] flex-col">
                  <div className="reasoning w-full text-left">
                    <div className="text-lg text-center md:text-xl">
                      Ethos Reasoning
                    </div>
                    <div className="reasoning poppins text-sm md:text-[14px] md:text-md">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                    </div>
                  </div>
                  </div>
                </div>
              )}
              {activeTab === "pathos" && (
                <div className="pathos box">
                  
                  <div className="!justify-start black-card box rounded-[20px] md:rounded-[40px] p-[10px] md:p-[25px] flex-col">
                  <div className="reasoning w-full text-left">
                    <div className="text-lg text-center md:text-xl">
                      Pathos Reasoning
                    </div>
                    <div className="reasoning poppins  text-sm md:text-[14px] md:text-md">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                    </div>
                  </div>
                  </div>

                </div>
              )}
              {activeTab === "logos" && (
                <div className="logos box">
                  <div className="!justify-start black-card box rounded-[20px] md:rounded-[40px] p-[10px] md:p-[25px] flex-col">
                  <div className="reasoning w-full text-left">
                    <div className="text-lg text-center md:text-xl">
                      Logos Reasoning
                    </div>
                    <div className="reasoning poppins text-sm md:text-[14px] md:text-md">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
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
            className={`px-[10px] py-[1px] rounded-[40px] tab-btn ${
              activeTab === "summary" ? "active" : ""
            }`}
            onClick={() => setActiveTab("summary")}
          >
            1
          </button>
          <button
            className={`px-[10px] py-[1px] rounded-[40px] tab-btn ${
              activeTab === "ethos" ? "active" : ""
            }`}
            onClick={() => setActiveTab("ethos")}
          >
            2
          </button>
          <button
            className={`px-[10px] py-[1px] rounded-[40px] tab-btn ${
              activeTab === "pathos" ? "active" : ""
            }`}
            onClick={() => setActiveTab("pathos")}
          >
            3
          </button>
          <button
            className={` px-[10px] py-[1px] rounded-[40px] tab-btn ${
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

export default Style;
