// CS235 User Interface Design  -D3 Force directed graph
// Graphify, a Force Driven Graph Movie Vizualizer

// Kevin M. Smith & Sharan Duggirala

// load all the data files, styles and d3 first
var style = require('./style.css');
var d3 = require('d3');

// Initial Nodes at the Start of the Program
var initialArray = new Array();
var graph = require('./miserables.json');

// ---------------------------------------------------------------------//
//                              UI Variables                            //
// Variables that are going to be default or be controlled by the user  //
// ---------------------------------------------------------------------//

// No. of Nodes on the screen at any given time
var noItems = 10; // 10 is default
var node;
var oldInitialArray = [];

// ---------------------------------------------------------------------//
//                          d3.js Intialization                         //
//                           https://d3js.org/                          //
// ---------------------------------------------------------------------//

var containerdiv = document.getElementById("svgcontainer");
var svg = d3.select(containerdiv).append("svg")

// Extract the width and height that was computed by CSS.
var width = containerdiv.clientWidth;
// var width = window.innerWidth;
var height = containerdiv.clientHeight;
// var height = window.innerHeight;

svg.append("rect")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("fill", "black");

// ---------------------------------------------------------------------//
//                  tmdb  Movie Dataset from Kaggle                     //
//           https://www.kaggle.com/tmdb/tmdb-movie-metadata            //
//                 Now with Loading Screen Features                     //
// ---------------------------------------------------------------------//

// Get movies data and parse into a Javascript Array
var mdata = require('./moviesdata.json');
var mArray = Object.keys(mdata).map(function(d) {return mdata[d];});

// ---------------------------------------------------------------------//
//                            Add The Logo                              //
// ---------------------------------------------------------------------//

// Logo is from an online link
svg.append("svg:image")
  .attr('x', -10)
  .attr('y', -25)
  .attr('width', 100)
  .attr('height', 120)
  .attr("xlink:href", "https://i.imgur.com/QQSdNOx.png");

// ---------------------------------------------------------------------//
//                     Primary Simulation Section                       //
// ---------------------------------------------------------------------//

width = containerdiv.clientWidth;
height = containerdiv.clientHeight;

var simulation = d3.forceSimulation()
                  .force("charge", d3.forceManyBody())
                  .force("center", d3.forceCenter(width/2, height/2));

// ---------------------------------------------------------------------//
//                     Bar Chart for Revenue Info                       //
// ---------------------------------------------------------------------//

// This counts as data brushing since I am both representing the size of
// the nodes to be the revenue and the bar chart on the side.

// var	chart = d3.select("body")
// .append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
// .append("g")
//   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// svg.append

// ---------------------------------------------------------------------//
//                   Dynamic Text Input (Search Bar)                    //
// ---------------------------------------------------------------------//

function handleClick(event){

  draw(document.getElementById("myVal").value);
  return false;

}

function draw(val){
  d3.select("body").select("ul").append("li");
  dataset.push(val);
  var p = d3.select("body").selectAll("li")
  .data(dataset)
  .text(function(d,i){return i + ": " + d;})

}

// ---------------------------------------------------------------------//
//                      NodeBar Selection Buttons                       //
// ---------------------------------------------------------------------//

document.getElementById("updatebutton10").onclick = function () {

  noItems = 10;
  var randomArray = arrayRandomizer(mArray,noItems);
  oldInitialArray = initialArray;
  initialArray = [];
  for (var i = 0; i < mArray.length; i++) {
    if (randomArray[i] == 1) {
      initialArray.push(mArray[i]);
    }
  }

  redraw();
}

document.getElementById("updatebutton20").onclick = function () {

  noItems = 20;
  var randomArray = arrayRandomizer(mArray,noItems);
  oldInitialArray = initialArray;
  initialArray = [];
  for (var i = 0; i < mArray.length; i++) {
    if (randomArray[i] == 1) {
      initialArray.push(mArray[i]);
    }
  }

  redraw();
}

document.getElementById("updatebutton30").onclick = function () {

  noItems = 30;
  var randomArray = arrayRandomizer(mArray,noItems);
  oldInitialArray = initialArray;
  initialArray = [];
  for (var i = 0; i < mArray.length; i++) {
    if (randomArray[i] == 1) {
      initialArray.push(mArray[i]);
    }
  }

  redraw();
}

// ---------------------------------------------------------------------//
//               Redraw Function for responsive Windows                 //
//           https://bl.ocks.org/curran/3a68b0c81991e2e94b19            //
// ---------------------------------------------------------------------//

var randomArray = arrayRandomizer(mArray,noItems);
initialArray = [];
for (var i = 0; i < mArray.length; i++) {
  if (randomArray[i] == 1) {
    initialArray.push(mArray[i]);
  }
}

function draw(){

    width = containerdiv.clientWidth;
    height = containerdiv.clientHeight;

    simulation.alpha(.8).restart();
    simulation.force("center", d3.forceCenter(width/2, height/2));

    // Use the extracted size to set the size of an SVG element.
    svg
      .attr("width", width)
      .attr("height", height);

    node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(initialArray)
    .enter().append("circle")
    .attr("r", function(d) {
      return dataScaling(initialArray,0.5,0.1,d.FIELD1); })
    .attr("fill", "red")
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    simulation
    .nodes(initialArray)
    .on("tick", ticked);

  }

function redraw(){

  width = containerdiv.clientWidth;
  height = containerdiv.clientHeight;

  simulation.alpha(.8).restart();
  simulation.force("center", d3.forceCenter(width/2, height/2));

  // Use the extracted size to set the size of an SVG element.
  svg
    .attr("width", width)
    .attr("height", height);

  node = node.data(oldInitialArray, function(d) { return d.id;});
  for (var i =0; i < node.length; i++) {
    node.exit().remove();
  }

  node = svg.append("g")
  .attr("class", "nodes")
  .selectAll("circle")
  .data(initialArray)
  .enter().append("circle")
  .attr("r", function(d) {
    return dataScaling(initialArray,0.5,0.1,d.FIELD1); })
  .attr("fill", "red")
  .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  simulation
  .nodes(initialArray)
  .on("tick", ticked);

}

// Draw for the first time to initialize.
draw();

// Redraw based on the new size whenever the browser window is resized.
window.addEventListener("resize", redraw);

// ---------------------------------------------------------------------//
//                     Starting Screen Randomizer                       //
// ---------------------------------------------------------------------//
// In order to randomize the starting screen. aka. randomize the star - //
// ting nodes that are to appear within the array. To achieve this, I   //
// have created an array the size of the input JS data and filled it    //
// with the number of 1s(no .of objects that we want randomly chosen)   //
// that have been specified. The rest of the elements within the array  //
// are filled with 0s.                                                  //
// ---------------------------------------------------------------------//

function arrayRandomizer(db, noOnes) {

  var min = 1;
  var max = db.length-1;

  // Efficient Zero Fill Function
  // https://stackoverflow.com/a/44726020/4805357
  function zeroFill(len, a){

    return len <= (a || (a = [0])).length ?
      a.slice(0, len) :
      zeroFill(len, a.concat(a));

  }

  var selectionArray = zeroFill(db.length);
  var previousArray = zeroFill(noOnes);

  // Recursive function to check previous Array
  function createRandomNumber(prevArray, cRMin, cRMax) {

    var seed = Math.floor(Math.random() * (cRMax - cRMin) + cRMin);
    for (var j = 0; j < prevArray.length; j++) {
      if (seed == prevArray[j]) {
        seed = createRandomNumber(prevArray, cRMin, cRMax);
      }
    }
    return seed;
  }

  for(var i = 0; i < noOnes; i++) {
    var seed = createRandomNumber(previousArray, min, max);
    selectionArray[seed] = 1;
  }

  return selectionArray;

}

// Now we can get the initial Nodes.
var randomArray = arrayRandomizer(mArray,noItems);
initialArray = [];
for (var i = 0; i < mArray.length; i++) {
  if (randomArray[i] == 1) {
    initialArray.push(mArray[i]);
  }
}

// ---------------------------------------------------------------------//
//                 Autonomous Data Scaling Function                     //
// ---------------------------------------------------------------------//
// This function is called whenever there needs to be a new attribute   //
// assigned to an svg object. It checks the range of values of the      //
// element within the JSON file and then proceeds scale the given value //
// by a simple scaling of the searched attribute.                       //                                                   //
// ---------------------------------------------------------------------//

function dataScaling(db,rangeMax,rangeMin,value) {

  // This does not work for some reason. Check it up later on.

  // var min = db[1].FIELD1;
  // var max = min;

  // for (var i=2; i < db.length; i++) {
  //   if (db[i].FIELD1 <= min) {min = db[i].FIELD1;}
  //   else {max = db[i].FIELD1;}
  // }

  // var dScale = d3.scaleLinear()
  //               .domain([min, max])
  //               .range([rangeMin, rangeMax]);

  // return dScale(value);

  // For now, a simple division by this number will suffice. However,
  // this is not a permanent solution
  return value/1000000;

}

// ---------------------------------------------------------------------//
//                          The ticked Function                         //
// ---------------------------------------------------------------------//

function ticked() {
  node
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
}

// ---------------------------------------------------------------------//
//                            Drag Functions                            //
// ---------------------------------------------------------------------//

function dragstarted(d) {
if (!d3.event.active) simulation.alphaTarget(0.3).restart();
d.fx = d.x;
d.fy = d.y;
}

function dragged(d) {
d.fx = d3.event.x;
d.fy = d3.event.y;
}

function dragended(d) {
if (!d3.event.active) simulation.alphaTarget(0);
d.fx = null;
d.fy = null;
}
