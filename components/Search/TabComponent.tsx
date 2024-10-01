import { useState } from "react";

const TabComponent = () => {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="feed w-full h-fit z-40 items-center justify-center flex">
      <div className="grid grid-cols-4 w-full h-fit gap-[24px]">
        <div
          className={`cursor-pointer ${
            activeTab === "all" ? "text-blue-500" : ""
          }`}
          onClick={() => setActiveTab("all")}
        >
          All
        </div>
        <div
          className={`cursor-pointer ${
            activeTab === "media" ? "text-blue-500" : ""
          }`}
          onClick={() => setActiveTab("media")}
        >
          Media
        </div>
        <div
          className={`cursor-pointer ${
            activeTab === "topics" ? "text-blue-500" : ""
          }`}
          onClick={() => setActiveTab("topics")}
        >
          Topics
        </div>
        <div
          className={`cursor-pointer ${
            activeTab === "phases" ? "text-blue-500" : ""
          }`}
          onClick={() => setActiveTab("phases")}
        >
          Phases
        </div>
      </div>

      {/* Conditionally rendering content based on activeTab */}
      <div className="tab-content w-full h-fit mt-4">
        {activeTab === "all" && (
          <div>
            <h2>All Content</h2>
            <p>This is the content for the 'All' tab.</p>
          </div>
        )}

        {activeTab === "media" && (
          <div>
            <h2>Media Content</h2>
            <p>This is the content for the 'Media' tab.</p>
          </div>
        )}

        {activeTab === "topics" && (
          <div>
            <h2>Topics Content</h2>
            <p>This is the content for the 'Topics' tab.</p>
          </div>
        )}

        {activeTab === "phases" && (
          <div>
            <h2>Phases Content</h2>
            <p>This is the content for the 'Phases' tab.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabComponent;
