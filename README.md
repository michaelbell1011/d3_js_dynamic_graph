# D3 JavaScript dynamic scatter plot

* Note: To populate the visualization locally run `python -m http.server --cgi 8000` from terminal in the same directory as Index.html. This will host the page at `localhost:8000` in your web browser.

## Background
This is an exercise in using D3 JavaScript to create a dynamic data visualzation. The data set includes US state rates of income, obesity, poverty, etc. based on 2014 ACS 1-year estimates from information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System: [https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml). Note: MOE stands for "margin of error."

### Assignment

* Create a scatter plot between a combination of variables in the datasuch as `Healthcare vs. Poverty` or `Smokers vs. Age`.
* Using the D3 techniques, create a scatter plot that represents each state with circle elements. 
* Include state abbreviations in the circles. 
* Create and situate your axes and labels to the left and bottom of the chart.
* Expand the scope of the graph include more demographics and more risk factors. 
* Place additional labels in your scatter plot and give them click events so that your users can decide which data to display. 
* Animate the transitions for your circles' locations as well as the range of your axes.
* Bind the CSV data to the scatter circles. This makes it easier to determine their x or y values when selecting a label.

#### To-Do
* Incorporate d3-tip. Add tooltips to the circles and display each tooltip with the data that the user has selected. Use the `d3-tip.js` plugin developed by [Justin Palmer](https://github.com/Caged)
