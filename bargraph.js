let svg = d3.select("#bargraph")
    .append("svg")
    .attr("width", graph_1_width)
    .attr("height", graph_1_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let x = d3.scaleLinear()
    .range([0, graph_1_width - margin.left - margin.right]);

let y = d3.scaleBand()
    .range([0, graph_1_height - margin.top - margin.bottom])
    .padding(0.1);

let color = d3.scaleOrdinal()
    .range(["#d9ed92", "#b5e48c", "#99d98c", "#76c893", "#52b69a", "#34a0a4", "#168aad", "#1a759f", "#1e6091", "#184e77"].reverse())
    // .range(d3.quantize(d3.interpolateHcl("#c20e14", "#ed2f78"), NUM_EXAMPLES));

let countRef = svg.append("g");

let y_axis_label = svg.append("g");

svg.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2},
                                  ${(graph_1_height - margin.top - margin.bottom) + 30})`)
    .style("text-anchor", "middle")
    .text("Sales (in Millions)");

let y_axis_text = svg.append("text")
    .attr("transform", `translate(${-170}, ${(graph_1_height - margin.top - margin.bottom) / 2})rotate(-90)`)
    .style("text-anchor", "middle");

let title = svg.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${-20})`)
    .style("text-anchor", "middle")
    .style("font-size", 15);


/**
 * Set non-constant variables between bar graphs
 */
function setBarData(attr) {
    d3.csv(FILEPATH).then(function(data) {

        if (attr == 'Global_Sales') {
            data = data.slice(0, NUM_EXAMPLES)
        } else {
            data = cleanBarData(data, function(x,y) {return parseFloat(y[attr]) - parseFloat(x[attr]); }, NUM_EXAMPLES);
        };

        //set domain for the x axis of the bargraph
        x.domain([0, d3.max(data, function(d) { return parseFloat(d[attr]); })]);

        y.domain(data.map(function(d) { return d['Name']; }));

        y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10));

        color.domain(data.map(function(d) { return d['Name'] }))

        let bars = svg.selectAll("rect").data(data);

        bars.enter()
            .append("rect")
            .merge(bars)
            .attr("fill", function(d) { return color(d['Name']) })
            .transition()
            .duration(1000)
            .attr("x", x(0))
            .attr("y", function(d) { return y(d['Name']) })
            .attr("width", function(d) { return x(d[attr]); })
            .attr("height",  y.bandwidth());
        
        let counts = countRef.selectAll("text").data(data);

            // TODO: Render the text elements on the DOM
        counts.enter()
            .append("text")
            .merge(counts)
            .transition()
            .duration(1000)
            .attr("x", function(d) { return x(d[attr]) + 10; })
            .attr("y", function(d) { return y(d['Name']) + 12; })
            .style("text-anchor", "start")
            .text(function(d) { return d[attr]; });
         
        y_axis_text.text(attr);
        if (attr == 'Global_Sales') {
            title.text("Top 10 Games Globally");
        } else if (attr == 'NA_Sales') {
            title.text("Top 10 Games In North America");
        } else if (attr == 'EU_Sales') {
            title.text("Top 10 Games In Europe");
        } else if (attr == 'JP_Sales') {
            title.text("Top 10 Games In Japan");
        } else {
            title.text("Top 10 Games Outside North America, Europe, and Japan");
        }
    });

}

/**
 * Cleans the provided data using the given comparator then strips to first numExamples
 * instances
 */
 function cleanBarData(data, comparator, numExamples) {
    // TODO: sort and return the given data with the comparator (extracting the desired number of examples)
    console.clear()
    data = data.sort(comparator)
    data = data.slice(0, numExamples)
    return data
}

// On page load, render the barplot with the artist data
setBarData('Global_Sales');