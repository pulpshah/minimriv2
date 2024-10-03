import React,{ useEffect, useRef } from 'react';
import * as d3 from 'd3';
import ClarityData from "@/public/data/Clarity.json";
  
  function transformData(inputData) {
    const clarityData = inputData["Clarity"][0];
  
    return {
      name: "Clarity",
      children: [
        {
          name: "Explicitness",
          children: [
            { name: "Intention Clarity", value: clarityData["IntentionClarity"].score * 0.9 },
            { name: "Precision of Language", value: clarityData["PrecisionOfLanguage"].score * 0.09 },
            { name: "Lack of Ambiguity", value: clarityData["LackOfAmbiguity"].score * 0.01}
          ]
        },
        {
          name: "Concision",
          children: [
            { name: "Brevity", value: clarityData["Brevity"].score * 0.9},
            { name: "Avoidance of Redundancy", value: clarityData["AvoidanceOfRedundancy"].score * 0.09 },
            { name: "Efficiency of Structure", value: clarityData["EfficiencyOfStructure"].score * 0.01 }
          ]
        },
        {
          name: "Focus",
          children: [
            { name: "Relevance to Topic", value: clarityData["RelevanceToTopic"].score * 0.9 },
            { name: "Avoidance of Tangents", value: clarityData["AvoidanceOfTangents"].score * 0.09 },
            { name: "Consistency with Central Theme", value: clarityData["ConsistencyWithCentralTheme"].score * 0.01 }
          ]
        },
        {
          name: "Cohesion",
          children: [
            { name: "Logical Flow", value: clarityData["LogicalFlow"].score * 0.9  },
            { name: "Use of Transitions", value: clarityData["UseOfTransitions"].score * 0.09  },
            { name: "Sentence Connectivity", value: clarityData["SentenceConnectivity"].score * 0.01  }
          ]
        },
        {
          name: "Coherence",
          children: [
            { name: "Overall Structure", value: clarityData["OverallStructure"].score * 0.9  },
            { name: "Clarity of Argument", value: clarityData["SimplicityOfArgument"].score * 0.09  },
            { name: "Consistency of Ideas", value: clarityData["ConsistencyOfIdeas"].score * 0.01  }
          ]
        }
      ]
    };
  }

export const ClarityChart = ({turnNum, width=700, height=1000}) => 
{
  let data = transformData(ClarityData.at(turnNum-1))
  const chartRef = useRef();
  
    useEffect(() => {
        const marginRight = 30
        const marginBottom = 0
        const marginLeft = 100
        const marginTop = 30

        let x = d3.scaleLinear().range([marginLeft, width - marginRight])

        let root = d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value)
            .eachAfter(d => d.index = d.parent ? d.parent.index = d.parent.index + 1 || 0 : 0)

        let xAxis = g => g
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${marginTop})`)
            .call(d3.axisTop(x).ticks(width / 80, "s"))
            .call(g => (g.selection ? g.selection() : g).select(".domain").remove())
            
        let yAxis = g => g
            .attr("class", "y-axis")
            .attr("transform", `translate(${marginLeft + 0.5},0)`)
            .call(g => g.append("line")
                .attr("stroke", "currentColor")
                .attr("y1", marginTop)
                .attr("y2", height - marginBottom))
        
                let color = d3.scaleOrdinal([true, false], ["#D83FB7", "#D83F41"]);  // Green for parent, Yellow for child

        let barStep = 27
        let barPadding = 3 / barStep
        let duration = 750
        let max = 5;
        let height = max * barStep + marginTop + marginBottom;

        function stagger() {
            let value = 0;
            return (d, i) => {
              const t = `translate(${x(value) - x(0)},${barStep * i})`;
              value += d.value;
              return t;
            };
          }

        function stack(i) {
        let value = 0;
        return d => {
            const t = `translate(${x(value) - x(0)},${barStep * i})`;
            value += d.value;
            return t;
        };
        }

        function up(svg, d) {
            if (!d.parent || !svg.selectAll(".exit").empty()) return;
          
            // Rebind the current node to the background.
            svg.select(".background").datum(d.parent);
          
            // Define two sequenced transitions.
            const transition1 = svg.transition().duration(duration);
            const transition2 = transition1.transition();
          
            // Mark any currently-displayed bars as exiting.
            const exit = svg.selectAll(".enter")
                .attr("class", "exit");
          
            // Update the x-scale domain.
            x.domain([0, d3.max(d.parent.children, d => d.value)]);
          
            // Update the x-axis.
            svg.selectAll(".x-axis").transition(transition1)
                .call(xAxis);
          
            // Transition exiting bars to the new x-scale.
            exit.selectAll("g").transition(transition1)
                .attr("transform", stagger());
          
            // Transition exiting bars to the parent’s position.
            exit.selectAll("g").transition(transition2)
                .attr("transform", stack(d.index));
          
            // Transition exiting rects to the new scale and fade to parent color.
            exit.selectAll("rect").transition(transition1)
                .attr("width", d => x(d.value) - x(0))
                .attr("fill", color(true));
          
            // Transition exiting text to fade out.
            // Remove exiting nodes.
            exit.transition(transition2)
                .attr("fill-opacity", 0)
                .remove();
          
            // Enter the new bars for the clicked-on data's parent.
            const enter = bar(svg, down, d.parent, ".exit")
                .attr("fill-opacity", 0);
          
            enter.selectAll("g")
                .attr("transform", (d, i) => `translate(0,${barStep * i})`);
          
            // Transition entering bars to fade in over the full duration.
            enter.transition(transition2)
                .attr("fill-opacity", 1);
          
            // Color the bars as appropriate.
            // Exiting nodes will obscure the parent bar, so hide it.
            // Transition entering rects to the new x-scale.
            // When the entering parent rect is done, make it visible!
            enter.selectAll("rect")
                .attr("fill", d => color(!!d.children))
                .attr("fill-opacity", p => p === d ? 0 : null)
              .transition(transition2)
                .attr("width", d => x(d.value) - x(0))
                .on("end", function(p) { d3.select(this).attr("fill-opacity", 1); });
        }

        function down(svg, d) {
            if (!d.children || d3.active(svg.node())) return;
          
            // Rebind the current node to the background.
            svg.select(".background").datum(d);
          
            // Define two sequenced transitions.
            const transition1 = svg.transition().duration(duration);
            const transition2 = transition1.transition();
          
            // Mark any currently-displayed bars as exiting.
            const exit = svg.selectAll(".enter")
                .attr("class", "exit");
          
            // Entering nodes immediately obscure the clicked-on bar, so hide it.
            exit.selectAll("rect")
                .attr("fill-opacity", p => p === d ? 0 : null);
          
            // Transition exiting bars to fade out.
            exit.transition(transition1)
                .attr("fill-opacity", 0)
                .remove();
          
            // Enter the new bars for the clicked-on data.
            // Per above, entering bars are immediately visible.
            const enter = bar(svg, down, d, ".y-axis")
                .attr("fill-opacity", 0);
          
            // Have the text fade-in, even though the bars are visible.
            enter.transition(transition1)
                .attr("fill-opacity", 1);
          
            // Transition entering bars to their new y-position.
            enter.selectAll("g")
                .attr("transform", stack(d.index))
              .transition(transition1)
                .attr("transform", stagger());
          
            // Update the x-scale domain.
            x.domain([0, d3.max(d.children, d => d.value)]);
          
            // Update the x-axis.
            svg.selectAll(".x-axis").transition(transition2)
                .call(xAxis);
          
            // Transition entering bars to the new x-scale.
            enter.selectAll("g").transition(transition2)
                .attr("transform", (d, i) => `translate(0,${barStep * i})`);
          
            // Color the bars as parents; they will fade to children if appropriate.
            enter.selectAll("rect")
                .attr("fill", color(true))
                .attr("fill-opacity", 1)
              .transition(transition2)
                .attr("fill", d => color(!!d.children))
                .attr("width", d => x(d.value) - x(0));
        }

        // Creates a set of bars for the given data node, at the specified index.
        function bar(svg, down, d, selector) {
          const g = svg.insert("g", selector)
              .attr("class", "enter")
              .attr("transform", `translate(0,${marginTop + barStep * barPadding})`)
              .attr("text-anchor", "end")
              .style("font", "10px sans-serif");
      
              const bar = g.selectAll("g")
              .data(d.children || [])  // Ensure d.children exists or pass an empty array
              .join("g")
              .attr("cursor", d => d.children ? "pointer" : null)
              .on("click", (d) => down(svg, d));
          
          bar.append("text")
              .attr("x", marginLeft - 6)
              .attr("y", barStep * (1 - barPadding) / 2)
              .attr("dy", ".35em")
              .text(d => d.data.name);  // Access the actual name from d.data
          
          bar.append("rect")
              .attr("x", x(0))
              .attr("width", d => x(d.value) - x(0))
              .attr("height", barStep * (1 - barPadding))
              .attr("fill", d => color(!!d.children));  // Color the bar based on whether it has children          
      
          return g;
      }
      



        const svg = d3.select(chartRef.current)
            .attr('viewBox', [0, 0, width, height])
            .attr('width', width)
            .attr('height', height)
            .attr('style', 'max-width: 100%; height: auto;');

        x.domain([0, root.value]);

        svg.append("rect")
            .attr("class", "background")
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .attr("width", width)
            .attr("height", height)
            .attr("cursor", "pointer")
            .on('click', () => down(svg, root));
        
        svg.append("g")
            .call(xAxis);
      
        svg.append("g")
            .call(yAxis);
        
        down(svg, root);
  
      return () => {
        svg.selectAll('*').remove();  // Cleanup the SVG before unmounting
      };
    }, [data, width, height]);
  
    return <svg ref={chartRef}></svg>;
};