import React, { useEffect, useRef } from 'react';
import { Runtime, Inspector } from '@observablehq/runtime';
import define from '@/observable_graphs/6dba2606b1b6ac3c@261';

const RadarChart: React.FC<{ data: any }> = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const runtime = new Runtime();
    const main = runtime.module(define, (name: string) => {
      if (name === "chart") return new Inspector(chartRef.current as unknown as HTMLElement);
      if (name === "data") return data;
    });

    return () => runtime.dispose();
  }, [data]);

  return <div ref={chartRef}></div>;
};

export default RadarChart;
