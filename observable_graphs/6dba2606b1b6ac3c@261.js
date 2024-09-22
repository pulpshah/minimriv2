import define1 from "./e93997d5089d7165@2303.js";
import define2 from "./736e23cc000dd1b3@17.js";

function _1(md) {
  return (
    md`# Radar chart

A reimplementation of [Nadieh Bremer’s radar chart](http://bl.ocks.org/nbremer/21746a9668ffdf6d8242) in d3 version 5.`
  );
}

function _chart(d3, DOM, width, height, margin, axisCircles, radius, axesDomain, rScale, maxValue, angleSlice, axisLabelFactor, data, device, radarLine, color, dotRadius) {
  const svg = d3.select(DOM.svg(width, height))
    .attr("width", width)
    .attr("height", height)
    .style("border", "1px solid black"); // Debugging border

  // Adjust the container translation to center it within the SVG
  const container = svg.append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);  // Center the chart

  var axisGrid = container.append("g")
    .attr("class", "axisWrapper");

  axisGrid.selectAll(".levels")
    .data(d3.range(1, (axisCircles + 1)).reverse())
    .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", (d, i) => radius / axisCircles * d)
    .style("fill", "#CDCDCD")
    .style("stroke", "#CDCDCD")
    .style("fill-opacity", 0.1);

  const axis = axisGrid.selectAll(".axis")
    .data(axesDomain)
    .enter()
    .append("g")
    .attr("class", "axis");

  axis.append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", (d, i) => rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
    .attr("y2", (d, i) => rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
    .attr("class", "line")
    .style("stroke", "white")
    .style("stroke-width", "2px");

  axis.append("text")
    .attr("class", "legend")
    .style("font-size", "11px")
    .attr("text-anchor", "middle")
    .attr("font-family", "monospace")
    .attr("dy", "0.35em")
    .attr("x", (d, i) => rScale(maxValue * axisLabelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
    .attr("y", (d, i) => rScale(maxValue * axisLabelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
    .text(d => d);

  const plots = container.append('g')
    .selectAll('g')
    .data(data)
    .join('g')
    .attr("data-name", (d, i) => device(i))
    .attr("fill", "none")
    .attr("stroke", "steelblue");

  plots.append('path')
    .attr("d", d => radarLine(d.map(v => v.value)))
    .attr("fill", (d, i) => color(i))
    .attr("fill-opacity", 0.1)
    .attr("stroke", (d, i) => color(i))
    .attr("stroke-width", 2);

  plots.selectAll("circle")
    .data(d => d)
    .join("circle")
    .attr("r", dotRadius)
    .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
    .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
    .style("fill-opacity", 0.8);

  return svg.node();
}


function _3(md) {
  return (
    md`### Configuration`
  );
}

function _4(html, device, color) {
  return (
    html`<style>
g[data-name="${device(0)}"] circle {
  fill: ${color(0)};
  stroke: ${color(0)};
}
g[data-name="${device(1)}"] circle {
  fill: ${color(1)};
  stroke: ${color(1)};
}
g[data-name="${device(2)}"] circle {
  fill: ${color(2)};
  stroke: ${color(2)};
}
</style>`
  );
}

function _curveSelect(select, curveTypes) {
  return (
    select({
      title: "Curve type",
      options: curveTypes,
      value: "curveCardinalClosed"
    })
  );
}

function _axesDomain() { return ["Ethos", "Pathos", "Logos"]; }

function _axesLength(data) { return (
  data[0].length
); }

function _formatPercent(d3) { return (
  d3.format(',.0%')
); }

function _wrapWidth() { return (
  60
); }

function _axisLabelFactor() { return (
  1.12
); }

function _axisCircles() { return (
  2
); }

function _dotRadius() { return (
  4
); }

function _radius(height, margin) { return (
  (height - (margin * 1.5)) / 2
); }

function _margin() { return (
  30
); }

function _width() {
  return 200; // fixed width for now
}

function _height() {
  return 200; // fixed height for now
}



function _16(md) {
  return (
    md`### Plotting`
  );
}

function _radarLine(d3, curveSelect, rScale, angleSlice) {
  return (
    d3.lineRadial()
      .curve(d3[curveSelect])
      .radius(d => rScale(d))
      .angle((d, i) => i * angleSlice)
  );
}

function _angleSlice(axesLength) {
  return (
    Math.PI * 2 / axesLength
  );
}

function _rScale(d3, maxValue, radius) {
  return (
    d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, radius])
  );
}

function _color(d3) {
  return (
    d3.scaleOrdinal()
      .range(["#EDC951", "#CC333F", "#00A0B0"])
  );
}

function _21(md) {
  return (
    md`### Data`
  );
}

function _maxValue(d3, _, data) {
  return (
    d3.max(_.flatten(data).map(d => d.value))
  );
}

function _device() {
  return (
    d => ["iPhone", "Samsung", "Nokia"][d]
  );
}

function _data() {
  return (
    [
      [// Speaker 1's ratings
        { axis: "Ethos", value: 0.75 },
        { axis: "Pathos", value: 0.85 },
        { axis: "Logos", value: 0.90 }
      ],
      [// Speaker 2's ratings
        { axis: "Ethos", value: 0.60 },
        { axis: "Pathos", value: 0.70 },
        { axis: "Logos", value: 0.80 }
      ],
      [// Speaker 3's ratings
        { axis: "Ethos", value: 0.80 },
        { axis: "Pathos", value: 0.75 },
        { axis: "Logos", value: 0.85 }
      ]
    ]
  );
}

function _25(md) {
  return (
    md`### Dependencies`
  );
}

function __(require) {
  return (
    require("underscore")
  );
}

function _d3(require) {
  return (
    require("d3@5")
  );
}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("chart")).define("chart", ["d3", "DOM", "width", "height", "margin", "axisCircles", "radius", "axesDomain", "rScale", "maxValue", "angleSlice", "axisLabelFactor", "data", "device", "radarLine", "color", "dotRadius"], _chart);

  main.variable(observer("width")).define("width", _width);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["html", "device", "color"], _4);
  main.variable(observer("viewof curveSelect")).define("viewof curveSelect", ["select", "curveTypes"], _curveSelect);
  main.variable(observer("curveSelect")).define("curveSelect", ["Generators", "viewof curveSelect"], (G, _) => G.input(_));
  main.variable(observer("axesDomain")).define("axesDomain", ["data"], _axesDomain);
  main.variable(observer("axesLength")).define("axesLength", ["data"], _axesLength);
  main.variable(observer("formatPercent")).define("formatPercent", ["d3"], _formatPercent);
  main.variable(observer("wrapWidth")).define("wrapWidth", _wrapWidth);
  main.variable(observer("axisLabelFactor")).define("axisLabelFactor", _axisLabelFactor);
  main.variable(observer("axisCircles")).define("axisCircles", _axisCircles);
  main.variable(observer("dotRadius")).define("dotRadius", _dotRadius);
  main.variable(observer("radius")).define("radius", ["height", "margin"], _radius);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer("16")).define(["md"], _16);
  main.variable(observer("radarLine")).define("radarLine", ["d3", "curveSelect", "rScale", "angleSlice"], _radarLine);
  main.variable(observer("angleSlice")).define("angleSlice", ["axesLength"], _angleSlice);
  main.variable(observer("rScale")).define("rScale", ["d3", "maxValue", "radius"], _rScale);
  main.variable(observer("color")).define("color", ["d3"], _color);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer("maxValue")).define("maxValue", ["d3", "_", "data"], _maxValue);
  main.variable(observer("device")).define("device", _device);
  main.variable(observer("data")).define("data", _data);
  main.variable(observer()).define(["md"], _25);
  const child1 = runtime.module(define1);
  main.import("select", child1);
  const child2 = runtime.module(define2);
  main.import("curveTypes", child2);
  main.variable(observer("_")).define("_", ["require"], __);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
