function getAttributes(attributes){
            var str = ""
            for (const [key, value] of Object.entries(attributes)) {
              str += key + " : "+ value+"<br>";
            }
            return str;
}

function nodeClick(el){
     d3.select(el).select('circle').attr("fill", "#3AA9AD")
        .transition()
          .duration(2000)
    .attr("fill", '#3AA9AD');

    let bird_node = "bird_" + el.id.split("_")[1];

    var node_value = null;

   for (var b of node_b[0]){
       if (b.id === bird_node){
           node_value = b;
           b.dispatchEvent(new Event('click'));
       }
   }



}

var force = d3.layout.force()
        .size([500, 500])
        .nodes(d3.values(nodes))
        .links(links)
        .on("tick", tick)
        .linkDistance(300)
        .charge(-500)
        .start();

 var drag = force.drag()
     .on("dragstart", dragstart);

var svg_simple =d3.select('#main_view').call(d3.behavior.zoom().scaleExtent([0.5, 6]).on("zoom", function () {
         svg_simple.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")

         svg_bird.select('#frame').remove();

        let svgWidth = document.getElementById('main_view').getBoundingClientRect().width;
        let svgHeight = document.getElementById('main_view').getBoundingClientRect().height;

        let mapWidth = document.getElementById('main_g').getBoundingClientRect().width;
        let mapHeight = document.getElementById('main_g').getBoundingClientRect().height;

        let factor = mapWidth / $("#main_g")[0].getBBox().width;

        let factorSvgWidth = svgWidth / $("#main_g")[0].getBBox().width;
        let factorSvgHeight = svgHeight / $("#main_g")[0].getBBox().height;

        let dx = d3.event.translate[0] / d3.event.scale;
        let dy = d3.event.translate[1]  / d3.event.scale;


        svg_bird.append('rect')
          .attr('id', 'frame')
          .attr('width', mapWidth*factorSvgWidth / factor / d3.event.scale )
          .attr('height', mapHeight*factorSvgHeight / factor / d3.event.scale )
          .attr('stroke', '#3AA9AD')
          .attr('fill', 'none')
          .attr('transform', `translate(${-dx},${-dy})`);
      }))
      .append("g").attr('id', 'main_g');

var div = d3.select('.tooltip');
//    // Declare the tooltip div
//    .append('div')
//    // Apply the 'tooltip' class
//    .attr('class', 'tooltip')
//    .style('opacity', 0);

//dodavanje linkova
var link = svg_simple.selectAll('.link')
    .data(links)
    .enter().append('line')
    .attr('class', 'main_view_link');

//dodavanje cvorova
var node = svg_simple.selectAll('.main_view_node')
    .data(force_bird.nodes()) //add
    .enter().append('g')
    .attr('class', 'main_view_node')
    .attr('id', function(d){ return "main_" + d.name;})
    .on('click',function(){
       nodeClick(this);
    })
    .on('mouseover',function(d){
            console.log("d = ");
           console.log(d);

            div.transition()
                .duration(500)
                .style('opacity', 0);
            div.transition()
                .duration(200)
                .style('opacity', 1)
                .style('pointer-events', 'auto')
                .style('visibility','visible');;
            div.html(
                    `<h3 class = 'popover-title' >${ d.naziv }</h3>
                <br>
                <p class='popover-assets'>
                        ${ getAttributes(d.attributes) }
                </p>`)
                .style('left', '20%')
                .style('top', '80px').style('color', '#3AA9AD').style('font-size', '15px');
    })
    .on('mouseout', function() {
                setTimeout(function() {
                    if (!$('.tooltip:hover').length) {
                        div.transition()
                            .duration(500)
                            .style('opacity', 1);
                        div.transition()
                            .duration(500)
                            .style('opacity', 0)
                            .style('pointer-events', 'none')
                            .style('visibility','hidden');
                    }
                }, 0);
     })
    .call(drag);


d3.selectAll('.main_view_node').each(function(d){simpleView(d);});

function simpleView(d) {
    var duzina = 100;
    var textSize = 10;

    // Create a <filter> element with a drop shadow effect
    var filter = d3.select("svg")
      .append("defs")
      .append("filter")
      .attr("id", "circle-shadow")
      .attr("height", "150%");

    filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 3) // Adjust the standard deviation to control the blur effect

    filter.append("feOffset")
      .attr("dx", 2)
      .attr("dy", 2)
      .attr("result", "offsetBlur");

    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Append the circle element
    d3.select("g#" + "main_" + d.name)
      .append('circle')
      .attr('cx', 0) // x-coordinate of the center
      .attr('cy', 0) // y-coordinate of the center
      .attr('r', duzina / 2) // radius of the circle
      .attr('fill', '#3AA9AD')
      .style('filter', 'url(#circle-shadow)'); // Apply the filter to the circle



    //Ubacivanje naziva cvora
    d3.select("g#" + "main_" + d.name)
      .append('text')
      .attr('x', 0) // x-coordinate of the center
      .attr('y', 0) // y-coordinate of the center
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('font-size', textSize+3)
        .style('font-weight', 'bold')
      .attr('font-family', 'sans-serif')
      .attr('fill', '#FFFFFF')
      .text(d.naziv);

}

function dragstart(d) {
    d3.event.sourceEvent.stopPropagation();
    d3.select(this).classed("fixed", d.fixed = true);
}


function tick() {
    link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });

  node.attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")";});
    tick_bird();
}
