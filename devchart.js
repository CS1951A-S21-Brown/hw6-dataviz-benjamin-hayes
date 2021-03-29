let dev_radius = Math.min(graph_3_width, graph_3_height) / 2 - margin.top

let svg_dev = d3.select("#devchart")
    .append("svg")
    .attr("width", graph_3_width)
    .attr("height", graph_3_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top + graph_3_height/2})`);

// Set up reference to tooltip
let tooltip_dev = d3.select("#devchart")     // HINT: div id for div containing scatterplot
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Create dummy data
// var data_test = {Action: 9, Racing: 20, Shooting:30, Puzzle:8, Misc:12}
// for (var i=0; i < data_test.length; i++) {
//     console.log(data_test[i])
// }

function setDevData(attr) {
    d3.csv(FILEPATH).then(function(data) {

        console.log(attr)

        //remove previous pie chart, title, and legend
        d3.select("#devchart").selectAll("path").remove()
        d3.select("#devchart").selectAll("text").remove()

        data = filterDevData(data, attr);
        
        // console.log(data)

        var NUM_GENRES = Object.keys(data).length

        let color_dev = d3.scaleOrdinal()
            .domain(data)
            // .range(["#e8f5b8", "#d9ed92", "#b5e48c", "#99d98c", "#76c893", "#52b69a", "#34a0a4", "#168aad", "#1a759f", "#1e6091", "#184e77", "#114166"])
            .range(d3.quantize(d3.interpolateHcl("#d9ed92", "#184e77"), NUM_GENRES));

        let title_dev = svg_dev.append("text")
            .attr("transform", `translate(${0}, ${-(graph_3_height - margin.top)/2})`)
            .style("text-anchor", "middle")
            .style("font-size", 15);

        var dev_pie = d3.pie()
            .value(function(d) { return d.value; })

        var dev_data = dev_pie(d3.entries(data))
        console.log(dev_data)

        let mouseover_dev = function(d) {
            let html = `Publisher: <b>${d.data.key}</b><br><b>${d.data.value}</b> million Sales`;
        
            tooltip_dev.html(html)
                .style("left", `${(d3.event.pageX)}px`)
                .style("top", `${(d3.event.pageY) - 100}px`)
                .style("box-shadow", `2px 2px 5px`)
                .transition()
                .duration(200)
                .style("opacity", 0.9)
        };

        let mouseout_dev = function(d) {
            tooltip_dev.transition()
                .duration(200)
                .style("opacity", 0);
        };

        svg_dev
            .selectAll('path')
            .data(dev_data)
            .enter()
            .append('path')
            .on("mouseover", mouseover_dev)
            .on("mouseout", mouseout_dev)
            .attr('d', d3.arc()
                .innerRadius(80)
                .outerRadius(dev_radius))
            .attr('fill', function(d){ return(color_dev(d.data.key)) })
            .attr("stroke", "black")
            .style("stroke-width", ".75px")
            .style("opacity", 0.9)

        title_dev.text("Top 10 Publishers for the " + attr + " Genre");

        const legend = svg_dev
            .append('g')
            .attr('transform', `translate(${radius + 20},-200)`);

        legend
            .selectAll(null)
            .data(dev_data)
            .enter()
            .append('rect')
            .attr('y', function(d) { return 10 * d.index * 1.8; })
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', function(d) { return color_dev(d.index); })
            .attr('stroke', 'grey')
            .style('stroke-width', '1px');

        legend
            .selectAll(null)
            .data(dev_data)
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
 * Cleans the provided data using by getting games only of the provided genre,
 * then taking the top 10 by Global Sales, and adding the rest of the publishers
 * together into an "Other Publishers" catagory
 */
 function filterDevData(data, genre) {
    var publishers = {}

    for (var i = 0; i < data.length; i++) {
        if (data[i]['Genre'] == genre) {
            if (data[i]['Publisher'] in publishers) {
                publishers[data[i]['Publisher']] = publishers[data[i]['Publisher']] + parseFloat(data[i]['Global_Sales'])
            } else {
                publishers[data[i]['Publisher']] = parseFloat(data[i]['Global_Sales'])
            }
        }
    }

    var items = Object.keys(publishers).map(function(key) {
        return [key, publishers[key]];
    });

    items = items.sort(function(a,b) { return b[1] - a[1]; });

    var top10 = items.slice(0, 10)
    var rest = items.slice(10)
    var rest_total = 0.0

    for (var j = 0; j<rest.length; j++) {
        rest_total += parseFloat(rest[j][1])
        delete publishers[rest[j][0]]
    }

    publishers['Other Publishers'] = rest_total

    return publishers
};

// On page load, render the barplot with the artist data
setDevData('Action');