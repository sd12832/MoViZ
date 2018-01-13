// CS235 User Interface Design  -D3 Plotting using JavaScript
//
// This is a more complex 2D plot example using D3 and JavaScript.
// A highly modified version of the source code from this example
//
// https://bl.ocks.org/mbostock/3883245
//
// Modifications I made for the class:
// 1) Data import using "require"  for dsv and json files (using appropriate loaders)
// 2) SVG space created inside .js insted of HTML
// 3) Example Interactivity using Mouse  (tooltip which is just a placeholder circle)
// 4) Added comments throughout and reorganized code
//    to make it more readable
//
// Kevin M. Smith
//


var d3   = require('d3');
var data = require('./data.csv');

/* Note: you can also load json files this way
var data = require('/data.json');
*/

// Setup SVG Area
//
var svg = d3.select("body").append("svg").attr("fill", "black").attr("width", 960).attr("height", 500),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").style("background-color", "black").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// focus area for tooltip components to display  (in this case will be a circle)
//

var focus = g.append("g")
    .style("display", "none");

// Setup viewport/graph window
//
var x = d3.scaleTime()
  .rangeRound([0, width]);

var y = d3.scaleLinear()
  .rangeRound([height, 0]);

// format the data in csv file
//
var parseTime = d3.timeParse("%d-%b-%y");
data.forEach(function(d) {
  d.date = parseTime(d.date);
  d.close = +d.close;
});

x.domain(d3.extent(data, function(d) { return d.date; }));
y.domain(d3.extent(data, function(d) { return d.close; }));

// create bottom Axis
//
g.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .select(".domain")
  .remove();

// create left Axis
//
g.append("g")
  .call(d3.axisLeft(y))
  .append("text")
  .attr("fill", "#000")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text("Price ($)");

// generate path (using line iterator)
//

//  line points iterator
//
var line = d3.line()
.x(function(d) { return x(d.date); })
.y(function(d) { return y(d.close); });

g.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-linejoin", "round")
  .attr("stroke-linecap", "round")
  .attr("stroke-width", 1.5)
  .attr("d", line);


//  Small circle created for the tooltip
//  we will display it and draw it at the mouse/line intersection point
//  later in the callback.  (see below)
//
focus.append("circle")
  .attr("class", "y")
  .style("fill", "none")
  .style("stroke", "blue")
  .attr("r", 4);



// invisible overlay rectangle drawn over graph to accept mouse events
//
g.append("rect")
  .attr("width", width)
  .attr("height", height)
  .style("fill", "none")
  .style("pointer-events", "all")
  .on("mouseover", function() { focus.style("display", null); })
  .on("mouseout", function() { focus.style("display", "none"); })
  .on("mousemove", mousemove);


var bisectDate = d3.bisector(function(d) { return d.date; }).left;

//  Mouse move callback
//
//  For more info on how to implement tooltips in line charts, see link below
//  http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html
//
function mousemove() {

  // figure out which data point on the line the mouse is near
  //
  var x0 = x.invert(d3.mouse(this)[0]),
       i = bisectDate(data, x0, 1),
      d0 = data[i - 1],
      d1 = data[i],
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;

  // translate the circle to the (x,y) value at that point.
  //
  focus.select("circle.y")
      .attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
};
