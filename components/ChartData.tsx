// components/RadarChartData.tsx
import React from 'react';
import Plot from 'react-plotly.js';

interface RadarChartProps {
  ethos: number;
  pathos: number;
  logos: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ ethos, pathos, logos }) => {
  const radarData = [
    {
      type: "scatterpolar",
      r: [ethos, pathos, logos],  // Dynamic data for each turn
      theta: ["Ethos", "Pathos", "Logos"],  // Labels for the axes
      fill: "toself",
      name: "Performance"
    },
  ];

  const radarLayout = {
    polar: {
      radialaxis: {
        visible: true,
        range: [0, 10], // Assuming the scores are between 0 and 10
      },
    },
    paper_bgcolor: "rgba(0,0,0,0)", // Transparent background
    plot_bgcolor: "rgba(0,0,0,0)",  // Transparent plot background
    autosize: true,
  };

  return (
    <Plot
      data={radarData}
      layout={radarLayout}
      config={{
        displayModeBar: false,
        displaylogo: false,
        responsive: true,
      }}
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
