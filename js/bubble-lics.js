var size = [1140, 490];
var format = d3.format(",d");
var bubble = d3.layout.pack().sort(null).size(size).padding(1.5);
var baseFontSize = 13;
var baseDy = 4;

// prepare canvas
var main = d3.select("#the-graph")
  .append("svg")
  .attr("width", size[0]).attr("height", size[1])
  .append("g").attr("id", "svg-container")
  // add zoom on all items in container
  .call(d3.behavior.zoom().scaleExtent([1, 96]).on("zoom", zoom))
  .append("rect")
  .attr("width", size[0]).attr("height", size[1])
  .style("fill", "rgb(255, 255, 255)")

// start actual svg
var svg = d3.select("#svg-container")
  .append("g")
  .attr("class", "bubble");

// load json
d3.json("data/license.json", function (err, data) {
  var i, lic = {};
  lic.name = "License";
  lic.children = new Array();

  for(i = 0; i < data.length; i++) {
    var licItem = {};
    licItem.name = data[i][0];
    licItem.value = Number(data[i][1]);
    lic.children.push(licItem);
  }

  var node = svg.selectAll(".node")
    .data(bubble.nodes(lic).filter(function(d) { return !d.children; }))
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    })

  var colour = d3.scale.category20c()

  node.append("title")
    .text(function(d) {
      var titleText = d.name + "\n";
      titleText += "Counts: " + format(d.value);
      return titleText;
    });

  node.append("circle")
    .attr("r", function(d) { return d.r; })
    .style("fill", function(d) { return colour(d.name); });

  node.append("text")
    .attr("dy", baseDy + "px")
    .style("text-anchor", "middle")
    .style("font-size", baseFontSize + "px")
    .text(function(d) {
      if (2 * d.r > d.name.length * 8)
        return d.name;
    });
});

function zoom() {
  // get the scale and translate values
  var scale = d3.event.scale;
  var translate = d3.event.translate;
  // get the nodes
  var node = svg.selectAll(".node > text");

  // scale the image up and translate
  svg.attr("transform", "translate(" + translate + ")scale(" + scale +")");
  // shrink/enlarge font size based on the zoom factor
  // also account for the dy and the width of teh text relative to the node
  node.style("font-size", baseFontSize / scale + "px")
    .attr("dy", baseDy / scale + "px")
    .text(function(d) {
      if (2 * d.r * scale > d.name.length * 9)
        return d.name;
    });
}
