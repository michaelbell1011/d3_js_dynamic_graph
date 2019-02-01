
// set up chart configurations
// ==========================================================================
var svgWidth = 960;
var svgHeight = 500;
// see code from earlier activities to make responsive

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Define Initial  default axes for first page load
// these need to match the data syntax since they're used
var chosenXAxis = "age";


// these below functions could be refactored by putting into separate js file.
// ===================================================================

// function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
      d3.max(stateData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}


// function used for updating circles abbr labels group with a transition to new circles
function renderLabels(statesGroup, newXScale, chosenXaxis) {

  statesGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]));

  return statesGroup;
}


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "age") {
    var label = "Median Age: ";
  }
  else {
    var label = "Median Income: ";
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}<br> Obesity Rate: ${d.obesity}%`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this); //'this' was not included in some other solutions.
  })
  // onmouseout event
  .on("mouseout", function(data, index) {
    toolTip.hide(data);
  });

  return circlesGroup;
}

// these above functions could be refactored by putting into separate js file.
// ===================================================================
// ===================================================================

  
// Retrieve data from the CSV file and execute everything below
var file = "assets/data/data.csv"
d3.csv(file).then(successHandle, errorHandle);

function errorHandle(error){
  throw error;
}

function successHandle(stateData) {

  // parse data
  stateData.forEach(function(data) {
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
  });

  
  // Step 2: Create scale functions
  // ==============================

  // xLinearScale function above csv import
  var xLinearScale = xScale(stateData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([20, d3.max(stateData, d => d.obesity)])
    .range([height, 0]);

  // Step 3: Create (initial) axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  
   // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // Step 5: Create (initial) Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
  .data(stateData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d.obesity))
  .attr("r", "12")
  .attr("fill", "blue")
  .attr("class", "stateCircle")
  .attr("opacity", ".75");


  // create a statesGroup
  // append text to go above the circles
  // use abbr for text values that will go above the circles
  var statesGroup = chartGroup.selectAll(null)
    .data(stateData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d.obesity))
    .text(function (d) {
      return d.abbr;
      })
    .attr("dy",".35em")
    .attr("class", "stateText");



  // here was tooltip stuff in the basic 'hair' example

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);



  // Create axes labels
  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axis-text")
    .text("Obesity (%)");


  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  // this moves BOTH axis labels as a group
  var medianAgeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "age") // value to grab for event listener
    .classed("active", true)
    .text("Age (median)");

  var medianIncomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Income (median)");


  // x axis labels event listener that changes the axis!!!!
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection, and ensure it isn't already being displayed
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;
        console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(stateData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // update circle abbr labels with new x values
        statesGroup = renderLabels(statesGroup, xLinearScale, chosenXAxis)

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "income") {
          medianIncomeLabel
            .classed("active", true)
            .classed("inactive", false);
          medianAgeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          medianIncomeLabel
            .classed("active", false)
            .classed("inactive", true);
          medianAgeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
}