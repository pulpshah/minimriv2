import React,{ useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as Plot from '@observablehq/plot';

interface ChartProps {
    turnNum: number,
}

export const GeneralAppealChart: React.FC<ChartProps> = ({turnNum}) => 
{
  
  let points = []
  points.push({"key":"Ethos", "value":AppealData[turnNum-1].EthosScore})
  points.push({"key":"Pathos", "value":AppealData[turnNum-1].PathosScore})
  points.push({"key":"Logos", "value":AppealData[turnNum-1].LogosScore})

  const plotRef = useRef<HTMLDivElement | null>(null); // Specify the type

  useEffect(() => {
    if (points && points.length > 0) {
      const keys = Array.from(new Set(points.map(point => point.key)));

      const longitude = d3
        .scalePoint(keys, [180, -180])
        .padding(0.5)
        .align(1);

      const plot = Plot.plot({
        width: 500,
        projection: {
          type: "azimuthal-equidistant",
          rotate: [0, -90],
          domain: d3.geoCircle().center([0, 90]).radius(1.22)(),
        },
        marks: [
          // Grey discs
          Plot.geo([1.0, 0.8, 0.6, 0.4, 0.2], {
            geometry: (r) => d3.geoCircle().center([0, 90]).radius(r)(),
            stroke: "white",
            fill: "black",
            strokeOpacity: 0.2,
            fillOpacity: 0.2,
            strokeWidth: 0.5,
          }),

          // White axes
          Plot.link(longitude.domain(), {
            x1: longitude,
            y1: 90 - 0.95,
            x2: 0,
            y2: 90,
            stroke: "white",
            strokeOpacity: 0.5,
            strokeWidth: 2.5,
          }),

          // Axes labels
          Plot.text(longitude.domain(), {
            x: longitude,
            y: 90 - 1,
            text: Plot.identity,
            lineWidth: 5,
            fontSize:23,
          }),

          // Areas
          Plot.area(points, {
            x1: ({ key }) => longitude(key),
            y1: ({ value }) => 90 - value,
            x2: 0,
            y2: 90,
            fill: "#4269D0",
            fillOpacity: 0.25,
            stroke: "#4269D0",
            curve: "cardinal-closed",
          }),

          // Points
          Plot.dot(points, {
            x: ({ key }) => longitude(key),
            y: ({ value }) => 90 - value,
            fill: "#4269D0",
            stroke: "white",
          }),

          // Interactive labels
          Plot.text(
            points,
            Plot.pointer({
              x: ({ key }) => longitude(key),
              y: ({ value }) => 90 - value,
              text: (d) => `${d.value * 10}\n(${Math.round(100 * d.value)}%)`,
              textAnchor: "start",
              dx: 4,
              fill: "#4269D0",
              stroke: "white",
              maxRadius: 10,
              fontSize: 23,
            })
          )
        ],
      });

      if (plotRef.current) { // Check if plotRef.current is not null
        if (plotRef.current.firstChild) {
          plotRef.current.removeChild(plotRef.current.firstChild);
        }

        // Append the plot to the div
        plotRef.current.appendChild(plot);
      }

      const svg = d3.select(plotRef.current).select("svg");

      svg
        .append("style")
        .text(`
          g[aria-label=area] path {fill-opacity: 0.1; transition: fill-opacity .2s;}
          g[aria-label=area]:hover path:not(:hover) {fill-opacity: 0.05; transition: fill-opacity .2s;}
          g[aria-label=area] path:hover {fill-opacity: 0.3; transition: fill-opacity .2s;}
        `);
    }
  }, [points]);

  return <div ref={plotRef}></div>;
};

export const EthosChart: React.FC<ChartProps> = ({turnNum}) => 
{
    
    let points = []
    points.push({"key":"Trust", "value":AppealData[turnNum-1].TrustScore})
    points.push({"key":"Influence", "value":AppealData[turnNum-1].InfluenceScore})
    points.push({"key":"Capability", "value":AppealData[turnNum-1].CapabilityScore})
    points.push({"key":"Accuracy", "value":AppealData[turnNum-1].AccuracyScore})
    points.push({"key":"Assurance", "value":AppealData[turnNum-1].AssuranceScore})
    points.push({"key":"Validity", "value":AppealData[turnNum-1].ValidityScore})
    

    const plotRef = useRef<HTMLDivElement | null>(null); // Specify the type

    useEffect(() => {
    if (points && points.length > 0) {
        const keys = Array.from(new Set(points.map(point => point.key)));

        const longitude = d3
        .scalePoint(keys, [180, -180])
        .padding(0.5)
        .align(1);

        const plot = Plot.plot({
        width: 500,
        projection: {
            type: "azimuthal-equidistant",
            rotate: [0, -90],
            domain: d3.geoCircle().center([0, 90]).radius(1.22)(),
        },
        marks: [
            // Grey discs
            Plot.geo([1.0, 0.8, 0.6, 0.4, 0.2], {
            geometry: (r) => d3.geoCircle().center([0, 90]).radius(r)(),
            stroke: "white",
            fill: "black",
            strokeOpacity: 0.2,
            fillOpacity: 0.2,
            strokeWidth: 0.5,
            }),

            // White axes
            Plot.link(longitude.domain(), {
            x1: longitude,
            y1: 90 - 0.95,
            x2: 0,
            y2: 90,
            stroke: "white",
            strokeOpacity: 0.5,
            strokeWidth: 2.5,
            }),

            // Axes labels
            Plot.text(longitude.domain(), {
            x: longitude,
            y: 90 - 1,
            text: Plot.identity,
            lineWidth: 5,
            fontSize:23,
            }),

            // Areas
            Plot.area(points, {
            x1: ({ key }) => longitude(key),
            y1: ({ value }) => 90 - value,
            x2: 0,
            y2: 90,
            fill: "#4269D0",
            fillOpacity: 0.25,
            stroke: "#4269D0",
            curve: "cardinal-closed",
            }),

            // Points
            Plot.dot(points, {
            x: ({ key }) => longitude(key),
            y: ({ value }) => 90 - value,
            fill: "#4269D0",
            stroke: "white",
            }),

            // Interactive labels
            Plot.text(
            points,
            Plot.pointer({
                x: ({ key }) => longitude(key),
                y: ({ value }) => 90 - value,
                text: (d) => `${d.value * 10}\n(${Math.round(100 * d.value)}%)`,
                textAnchor: "start",
                dx: 4,
                fill: "#4269D0",
                stroke: "white",
                maxRadius: 10,
                fontSize: 23,
            })
            )
        ],
        });

        if (plotRef.current) { // Check if plotRef.current is not null
        if (plotRef.current.firstChild) {
            plotRef.current.removeChild(plotRef.current.firstChild);
        }

        // Append the plot to the div
        plotRef.current.appendChild(plot);
        }

        const svg = d3.select(plotRef.current).select("svg");

        svg
        .append("style")
        .text(`
            g[aria-label=area] path {fill-opacity: 0.1; transition: fill-opacity .2s;}
            g[aria-label=area]:hover path:not(:hover) {fill-opacity: 0.05; transition: fill-opacity .2s;}
            g[aria-label=area] path:hover {fill-opacity: 0.3; transition: fill-opacity .2s;}
        `);
    }
    }, [points]);

    return <div ref={plotRef}></div>;
};


export const PathosChart: React.FC<ChartProps> = ({turnNum}) => 
{
    
    let points = []
    points.push({"key":"Evaluation Sentiment", "value":AppealData[turnNum-1].EvaluationSentimentScore})
    points.push({"key":"Planning Sentiment", "value":AppealData[turnNum-1].PlanningSentimentScore})
    points.push({"key":"Problematic Sentiment", "value":AppealData[turnNum-1].ProblematicSentimentScore})
    points.push({"key":"Risk Sentiment", "value":AppealData[turnNum-1].RiskSentimentScore})
    points.push({"key":"Togetherness Sentiment", "value":AppealData[turnNum-1].TogethernessSentimentScore})
    points.push({"key":"Pity Sentiment", "value":AppealData[turnNum-1].PitySentimentScore})
    

    const plotRef = useRef<HTMLDivElement | null>(null); // Specify the type

    useEffect(() => {
    if (points && points.length > 0) {
        const keys = Array.from(new Set(points.map(point => point.key)));

        const longitude = d3
        .scalePoint(keys, [180, -180])
        .padding(0.5)
        .align(1);

        const plot = Plot.plot({
        width: 500,
        projection: {
            type: "azimuthal-equidistant",
            rotate: [0, -90],
            domain: d3.geoCircle().center([0, 90]).radius(1.22)(),
        },
        marks: [
            // Grey discs
            Plot.geo([1.0, 0.8, 0.6, 0.4, 0.2], {
            geometry: (r) => d3.geoCircle().center([0, 90]).radius(r)(),
            stroke: "white",
            fill: "black",
            strokeOpacity: 0.2,
            fillOpacity: 0.2,
            strokeWidth: 0.5,
            }),

            // White axes
            Plot.link(longitude.domain(), {
            x1: longitude,
            y1: 90 - 0.95,
            x2: 0,
            y2: 90,
            stroke: "white",
            strokeOpacity: 0.5,
            strokeWidth: 2.5,
            }),

            // Axes labels
            Plot.text(longitude.domain(), {
            x: longitude,
            y: 90 - 1,
            text: Plot.identity,
            lineWidth: 5,
            fontSize:23,
            }),

            // Areas
            Plot.area(points, {
            x1: ({ key }) => longitude(key),
            y1: ({ value }) => 90 - value,
            x2: 0,
            y2: 90,
            fill: "#4269D0",
            fillOpacity: 0.25,
            stroke: "#4269D0",
            curve: "cardinal-closed",
            }),

            // Points
            Plot.dot(points, {
            x: ({ key }) => longitude(key),
            y: ({ value }) => 90 - value,
            fill: "#4269D0",
            stroke: "white",
            }),

            // Interactive labels
            Plot.text(
            points,
            Plot.pointer({
                x: ({ key }) => longitude(key),
                y: ({ value }) => 90 - value,
                text: (d) => `${d.value * 10}\n(${Math.round(100 * d.value)}%)`,
                textAnchor: "start",
                dx: 4,
                fill: "#4269D0",
                stroke: "white",
                maxRadius: 10,
                fontSize: 23,
            })
            )
        ],
        });

        if (plotRef.current) { // Check if plotRef.current is not null
        if (plotRef.current.firstChild) {
            plotRef.current.removeChild(plotRef.current.firstChild);
        }

        // Append the plot to the div
        plotRef.current.appendChild(plot);
        }

        const svg = d3.select(plotRef.current).select("svg");

        svg
        .append("style")
        .text(`
            g[aria-label=area] path {fill-opacity: 0.1; transition: fill-opacity .2s;}
            g[aria-label=area]:hover path:not(:hover) {fill-opacity: 0.05; transition: fill-opacity .2s;}
            g[aria-label=area] path:hover {fill-opacity: 0.3; transition: fill-opacity .2s;}
        `);
    }
    }, [points]);

    return <div ref={plotRef}></div>;
};

export const LogosChart: React.FC<ChartProps> = ({turnNum}) => 
{
    
    let points = []
    points.push({"key":"Premises", "value":AppealData[turnNum-1].PremisesScore})
    points.push({"key":"Conclusions", "value":AppealData[turnNum-1].ConclusionsScore})
    points.push({"key":"Soundness", "value":AppealData[turnNum-1].SoundnessScore})
    points.push({"key":"Fallacies", "value":AppealData[turnNum-1].FallaciesScore})
    points.push({"key":"Biases", "value":AppealData[turnNum-1].BiasesScore})

    const plotRef = useRef<HTMLDivElement | null>(null); // Specify the type

    useEffect(() => {
    if (points && points.length > 0) {
        const keys = Array.from(new Set(points.map(point => point.key)));

        const longitude = d3
        .scalePoint(keys, [180, -180])
        .padding(0.5)
        .align(1);

        const plot = Plot.plot({
        width: 500,
        projection: {
            type: "azimuthal-equidistant",
            rotate: [0, -90],
            domain: d3.geoCircle().center([0, 90]).radius(1.22)(),
        },
        marks: [
            // Grey discs
            Plot.geo([1.0, 0.8, 0.6, 0.4, 0.2], {
            geometry: (r) => d3.geoCircle().center([0, 90]).radius(r)(),
            stroke: "white",
            fill: "black",
            strokeOpacity: 0.2,
            fillOpacity: 0.2,
            strokeWidth: 0.5,
            }),

            // White axes
            Plot.link(longitude.domain(), {
            x1: longitude,
            y1: 90 - 0.95,
            x2: 0,
            y2: 90,
            stroke: "white",
            strokeOpacity: 0.5,
            strokeWidth: 2.5,
            }),

            // Axes labels
            Plot.text(longitude.domain(), {
            x: longitude,
            y: 90 - 1,
            text: Plot.identity,
            lineWidth: 5,
            fontSize:23,
            }),

            // Areas
            Plot.area(points, {
            x1: ({ key }) => longitude(key),
            y1: ({ value }) => 90 - value,
            x2: 0,
            y2: 90,
            fill: "#4269D0",
            fillOpacity: 0.25,
            stroke: "#4269D0",
            curve: "cardinal-closed",
            }),

            // Points
            Plot.dot(points, {
            x: ({ key }) => longitude(key),
            y: ({ value }) => 90 - value,
            fill: "#4269D0",
            stroke: "white",
            }),

            // Interactive labels
            Plot.text(
            points,
            Plot.pointer({
                x: ({ key }) => longitude(key),
                y: ({ value }) => 90 - value,
                text: (d) => `${d.value * 10}\n(${Math.round(100 * d.value)}%)`,
                textAnchor: "start",
                dx: 4,
                fill: "#4269D0",
                stroke: "white",
                maxRadius: 10,
                fontSize: 23,
            })
            )
        ],
        });

        if (plotRef.current) { // Check if plotRef.current is not null
        if (plotRef.current.firstChild) {
            plotRef.current.removeChild(plotRef.current.firstChild);
        }

        // Append the plot to the div
        plotRef.current.appendChild(plot);
        }

        const svg = d3.select(plotRef.current).select("svg");

        svg
        .append("style")
        .text(`
            g[aria-label=area] path {fill-opacity: 0.1; transition: fill-opacity .2s;}
            g[aria-label=area]:hover path:not(:hover) {fill-opacity: 0.05; transition: fill-opacity .2s;}
            g[aria-label=area] path:hover {fill-opacity: 0.3; transition: fill-opacity .2s;}
        `);
    }
    }, [points]);

    return <div ref={plotRef}></div>;
};
