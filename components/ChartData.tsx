import React,{ useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as Plot from '@observablehq/plot';
import { Data } from 'plotly.js'; // Import the correct Data type from Plotly

interface RadarChartProps {
  ethos: number;
  pathos: number;
  logos: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ ethos, pathos, logos }) => {
  let points = []
  points.push({"key":"ethos", "value":ethos/10})
  points.push({"key":"pathos", "value":pathos/10})
  points.push({"key":"logos", "value":logos/10})

  const plotRef = useRef(null);

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
            fill: "white",
            strokeOpacity: 0.2,
            fillOpacity: 0.02,
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
              fontSize: 12,
            })
          )
        ],
      });

      if (plotRef.current.firstChild) {
        plotRef.current.removeChild(plotRef.current.firstChild);
      }

      // Append the plot to the div
      plotRef.current.appendChild(plot);

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
