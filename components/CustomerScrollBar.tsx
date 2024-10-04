import React from "react";

interface ScrollBarProps {
  turnsData: { turn: number }[];
  currentTurn: number;
  onTurnClick: (turnNumber: number) => void;
  onInputChange: (turnNumber: number) => void;
}

const CustomScrollBar: React.FC<ScrollBarProps> = ({
  turnsData,
  currentTurn,
  onTurnClick,
  onInputChange,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const turnNumber = parseInt(e.target.value, 10);
    if (!isNaN(turnNumber)) {
      onInputChange(turnNumber);
    }
  };

  return (
    <div className="custom-scrollbar flex flex-col items-center h-full w-[50px] bg-gray-300 rounded-l-lg fixed right-0 top-[90px] z-50">
      <input
        type="number"
        className="mb-4 p-2 rounded-lg text-center w-full bg-white"
        placeholder="Jump"
        onChange={handleInputChange}
      />
      <div className="scroll-bar h-full flex flex-col gap-2 w-full">
        {turnsData.map((turn) => (
          <div
            key={turn.turn}
            onClick={() => onTurnClick(turn.turn)}
            className={`scroll-bar-item h-[20px] w-full cursor-pointer bg-gray-400 rounded ${
              currentTurn === turn.turn ? "bg-blue-500" : ""
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default CustomScrollBar;
