let radius = Math.min(graph_2_width, graph_2_height) / 2 - margin.top

let svg_pie = d3.select("#piechart")
    .append("svg")
    .attr("width", graph_2_width)
    .attr("height", graph_2_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top + graph_2_height/2})`)

// Set up reference to tooltip
let tooltip_pie = d3.select("#piechart")     // HINT: div id for div containing scatterplot
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Create dummy data
// var data_test = {Action: 9, Racing: 20, Shooting:30, Puzzle:8, Misc:12}
// for (var i=0; i < data_test.length; i++) {
//     console.log(data_test[i])
// }

function setPieRegionData(attr) {
    d3.csv(FILEPATH).then(function(data) {

        //remove previous pie chart, title, and legend
        d3.select("#piechart").selectAll("path").remove()
        d3.select("#piechart").selectAll("text").remove()

        data = filterPieData(data, attr);
        
        console.log(data)

        var NUM_GENRES = Object.keys(data).length

        let color_pie = d3.scaleOrdinal()
            .domain(data)
            .range(["#e8f5b8", "#d9ed92", "#b5e48c", "#99d98c", "#76c893", "#52b69a", "#34a0a4", "#168aad", "#1a759f", "#1e6091", "#184e77", "#114166"])
            // .range(d3.quantize(d3.interpolateHcl("#7400b8", "#80ffdb"), NUM_GENRES));

        let title_pie = svg_pie.append("text")
            .attr("transform", `translate(${0}, ${-(graph_2_height - margin.top)/2})`)
            .style("text-anchor", "middle")
            .style("font-size", 15)

        var pie = d3.pie()
            .value(function(d) { return d.value; })

        var pie_data = pie(d3.entries(data))
        console.log(pie_data)

        let mouseover = function(d) {
            let html = `Genre: <b>${d.data.key}</b><br><b>${d.data.value.toFixed(2)}</b> million Sales`;
        
            tooltip_pie.html(html)
                .style("left", `${(d3.event.pageX) + 10}px`)
                .style("top", `${(d3.event.pageY) - 600}px`)
                .style("box-shadow", `2px 2px 5px`)
                .transition()
                .duration(200)
                .style("opacity", 0.9)
        };

        let mouseout = function(d) {
            tooltip_pie.transition()
                .duration(200)
                .style("opacity", 0);
        };

        svg_pie
            .selectAll('path')
            .data(pie_data)
            .enter()
            .append('path')
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .attr('d', d3.arc()
                .innerRadius(80)
                .outerRadius(radius))
            .attr('fill', function(d){ return(color_pie(d.data.key)) })
            .transition()
            .duration(1000)
            .attr("stroke", "black")
            .style("stroke-width", ".75px")
            .style("opacity", 0.9)

        if (attr == 'Global_Sales') {
            title_pie.text("Sales by Genre Globally");
        } else if (attr == 'NA_Sales') {
            title_pie.text("Sales by Genre in North America");
        } else if (attr == 'EU_Sales') {
            title_pie.text("Sales by Genre in Europe");
        } else if (attr == 'JP_Sales') {
            title_pie.text("Sales by Genre In Japan");
        } else {
            title_pie.text("Sales by Genre Outside North America, Europe, and Japan");
        }

        const legend = svg_pie
            .append('g')
            .attr('transform', `translate(${radius + 20},-200)`);

        legend
            .selectAll(null)
            .data(pie_data)
            .enter()
            .append('rect')
            .attr('y', function(d) { return 10 * d.index * 1.8; })
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', function(d) { return color_pie(d.index); })
            .attr('stroke', 'grey')
            .style('stroke-width', '1px')
            .style("opacity", 0.9)

        legend
            .selectAll(null)
            .data(pie_data)
            .enter()
            .append('text')
            .text(function(d) { return d.data.key; })
            .attr('x', 10 * 1.2)
            .attr('y', function(d) { return 10 * d.index * 1.8 + 10; })
            .style('font-family', 'sans-serif')
            .style('font-size', `${10}px`);

    });

}

/**
 * Cleans the provided data using the given comparator then strips to first numExamples
 * instances
 */
 function filterPieData(data, region) {
    var genres = {}

    for (var i = 0; i < data.length; i++) {
        if (data[i]['Genre'] in genres) {
            genres[data[i]['Genre']] = genres[data[i]['Genre']] + parseFloat(data[i][region])
        } else {
            genres[data[i]['Genre']] = parseFloat(data[i][region])
        }
    }

    return genres
};

// On page load, render the barplot with the artist data
setPieRegionData('Global_Sales');