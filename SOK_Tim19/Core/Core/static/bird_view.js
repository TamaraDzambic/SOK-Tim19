function birNodeClick(node){
    d3.select(node).select('circle')
        .attr("fill", "#3AA9AD")
        .transition()
        .duration(2000)
        .attr("fill", '#FFFFFF');


}
var zoom = d3.behavior
	.zoom()
	.scaleExtent([1/4, 4])
	.on('zoom.zoom', function () {
		svg_bird.attr('transform',
			   'translate(' + d3.event.translate + ')' + 'scale(' + d3.event.scale   + ')');
	});

var svg_bird = d3.select('#bird_svg')
        .append("g").attr("id", "bird_g")
        .call(zoom);

console.log(links);
var force_bird = d3.layout.force()
        .size([500, 500])
        .nodes(d3.values(nodes))
        .links(links)
        .on("tick", tick_bird)
        .linkDistance(300)
        .charge(-500)
        .start();

//dodavanje linkova
var link_b = svg_bird.selectAll('.link')
    .data(links)
    .enter().append('line')
    .attr('class', 'bird_view_link');

//dodavanje cvorova
var node_b = svg_bird.selectAll('.bird_view_node')
    .data(force_bird.nodes()) //add
    .enter().append('g')
    .attr('class', 'bird_view_node')
    .attr('id', function(d){ return "bird_" + d.name;})
    .on("click", function(){ birNodeClick(this);});

// svg_bird.on('mousedown', function (){d3.event.stopPropagation()});
// svg_bird.on('wheel', function (){d3.event.stopPropagation()});

d3.selectAll('.bird_view_node').each(function(d){birdView(d);});

function lapsedZoomFit(ticks, transitionDuration) {
    for (var i = ticks || 100; i > 0; --i) force_bird.tick();
    force_bird.stop();
    zoomFit(transitionDuration);
}

lapsedZoomFit(undefined, 500);
zoomFit(500);

function zoomFit(transitionDuration) {
    var bounds = svg_bird.node().getBBox(); // g
    var parent = svg_bird.node().parentElement; // svg
    var fullWidth = parent.clientWidth || parent.parentNode.clientWidth,
        fullHeight = parent.clientHeight || parent.parentNode.clientHeight;
    var width = bounds.width,
        height = bounds.height;
    console.log("Sirina " + width);
    console.log("Visina " + height);

    if (width == 0 || height == 0) return; // nothing to fit
    if (width < 300 && height < 300){
        width = 300;
        height = 300;
    }
    var scale = 0.15 / Math.max(width / fullWidth, height / fullHeight);

     var translate = [fullWidth / 3.5 , fullHeight / 3.5];

    svg_bird
        .transition()
        .duration(transitionDuration || 0) // milliseconds
        .call(zoom.translate(translate).scale(scale).event);
        svg_bird.on('.zoom', null);
}

function birdView(d){

  d3.select("g#"+ "bird_" + d.name).append('circle').
      attr('r',10)
      .attr('fill', '#FFFFFF');
}

function tick_bird() {

     node_b.attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; });

    node_b.attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")";});

    link_b.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });
}

$(document).ready(function (){
    // kreiranje okvira za pracenje pozicije na main view-u

    var gDimensions = document.getElementById('main_view').getBoundingClientRect();

    var littleGHeight = gDimensions.height;
    var littleGWidth = gDimensions.width;

    console.log("aaa");
    console.log(littleGHeight);
    console.log(littleGWidth);

    svg_bird.append('rect')
        .attr('height', littleGHeight )
        .attr('width', littleGWidth)
        .attr('fill', 'none')
        .attr('stroke', '#3AA9AD')
        .attr('id', 'frame');
    svg_bird.append('rect')
        .attr('height', littleGHeight )
        .attr('width', littleGWidth)
        .attr('fill', 'none')
        .attr('stroke', '#FFFFFF');

})


