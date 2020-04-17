(function() {

  const game = document.querySelector("#game_id").innerHTML

  const margin = {top: 10, right: 30, bottom: 30, left: 60}
  const width = 860 - margin.left - margin.right
  const height = 800 - margin.top - margin.bottom

  var svg = d3.select("#graph")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  d3.json(`/statistics/${game}`, (data) => {
    // Average the values
    const totalDurations = {}

    data.forEach((event) => {
      totalDurations[event.round] = totalDurations[event.round] || { total: 0, count: 0 }
      totalDurations[event.round].total += event.duration
      totalDurations[event.round].count += 1
    })

    const averages = []
    for(const round in totalDurations) {
      averages.push({
        round,
        duration: totalDurations[round].total / totalDurations[round].count,
      })
    }

    // Plot the graph
    var x = d3.scaleLinear()
      .domain([0, d3.max(averages, function(d) { return +d.round; })])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
      .domain([0, d3.max(averages, function(d) { return +d.duration; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    svg.append("path")
      .datum(averages)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.round) })
        .y(function(d) { return y(d.duration) })
        )
  })

})();
