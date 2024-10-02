import React,{ useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as Plot from '@observablehq/plot';
import StyleData from "@/public/data/newStyle.json";

function transformData(input) 
{
    const output = [];
    
    input.Sentence.forEach(sentenceObj => {
      const sentenceNum = sentenceObj.SentenceNum;
      const styleObj = sentenceObj.Style[0];
  
      for (const style in styleObj) {
        const score = styleObj[style].score || 0;
        
        output.push({
          style: style,
          sentence: sentenceNum,
          score: score
        });
      }
    });
    
    return output;
  }  

export const StyleChart = ({turnNum}) => 
{
  let data = transformData(StyleData.at(turnNum-1))
  const plotRef = useRef();
  
    useEffect(() => {
        const plot = Plot.plot({
            marginLeft: 100,
            width: 500,
            x: {
              type: "linear"
            },
            color: {
              scheme: "Reds",
              legend: true,
              label: "Score"
            },
            marks: [
              Plot.rectX(
                data,
                Plot.binX(
                  { fill: "mean", interval: 1},
                  {
                    x: "sentence",
                    y: "style",
                    fill: "score",
                    sort: { y: "fill", reverse: true },
                    tip: true
                  }
                )
              )
            ]
          })
        
        if (plotRef.current) { // Check if plotRef.current is not null
        if (plotRef.current.firstChild) {
            plotRef.current.removeChild(plotRef.current.firstChild);
        }

        // Append the plot to the div
        plotRef.current.appendChild(plot);
        }

        const svg = d3.select(plotRef.current).select("svg");

    }, [data]);
  
    return <div ref={plotRef}></div>;
};