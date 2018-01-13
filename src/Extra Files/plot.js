var d3 = require('d3');

var w = 600;
var h = 400;

var revenuePerMonth = [
     {"month":1, "rev":80},
     {"month":2, "rev":130},
     {"month":3, "rev":250},
     {"month":4, "rev":300},
     {"month":5, "rev":250},
     {"month":6, "rev":225},
     {"month":7, "rev":180},
     {"month":8, "rev":120},
     {"month":9, "rev":145},
     {"month":10, "rev":90},
     {"month":11, "rev":300},
     {"month":12, "rev":350}
];

function colorPicker (d) {
  if (d>=250) { return "#0000FF"; } else
  if (d<250) { return "#555555"; }
}

// create SVG Area
//
var svg = d3.select("body").append("svg")
  .attr("width", w)
  .attr("height", h);

//function for showing labels
function showMinMax(ds, col, val, type){
  var max = d3.max(ds, function(d) { return d[col]; } );
  var min = d3.min(ds, function(d) { return d[col]; } );
 
  if (type=='minmax' && (val == max || val == min)) {
    return val;
  } else
   
  if (type=='all') {
    return val;
  } 
}
//add markers
var markers = svg.selectAll("circle")
  .data(revenuePerMonth)
  .enter()
  .append("circle")
  .attr("cx", function(d){ return d.month*(w/14); })
  .attr("cy", function(d){ return h-d.rev; })
  .attr("r",  5)
  .attr("fill", function(d){ return colorPicker(d.rev)});

  /*
  .attr({
    cx: function(d){ return d.month*3; },
    cy: function(d){ return h-d.sales; },
    r:  5,
    "fill": function(d){ return salesKPI(d.sales); }
    */

var labels = svg.selectAll("text")
  .data(revenuePerMonth)
  .enter()
  .append("text")
  .text(function(d){ return showMinMax(revenuePerMonth, 'rev', d.rev, 'minmax'); })
  .attr("x", function(d){ return (d.month*(w/14))-25; })
  .attr("y", function(d){ return h-d.rev; })
  .attr("font-size", "12px")
  .attr("font-family", "sans-serif")
  .attr("fill", "#666666")
  .attr("text-anchor", "start");
