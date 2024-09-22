import React from 'react';
import Plot from 'react-plotly.js';
import { Data } from 'plotly.js'; // Import the correct Data type from Plotly

interface RadarChartProps {
  ethos: number;
  pathos: number;
  logos: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ ethos, pathos, logos }) => {
  const radarData: Data[] = [
    {
      type: "scatterpolar", 
      r: [ethos, pathos, logos],
      theta: ["Ethos", "Pathos", "Logos"], 
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
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)", 
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
