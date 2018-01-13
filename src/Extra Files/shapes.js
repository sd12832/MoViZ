var d3 = require('d3');

var w = 600;
var h = 300;
var padding = 2;
var dataset = [ 5, 10, 15, 20, 25];
var svg = d3.select("body").append("svg")
          .attr("width", w)
          .attr("height", h);

svg.selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("x", function(d, i) {return i * (w / dataset.length);})
  .attr("y", function(d) {return h - (d*4);})
  .attr("width", w / dataset.length - padding)
  .attr("height", function(d) {return d*4;});

  svg.append("circle")
    .attr("cx", 100)
    .attr("cy", 25)
    .attr("r", 25)
    .style("fill", "purple");

  svg.append("text")
    .text("The Quick Brown Fox")
    .attr("y",25)
    .attr("x",200);
