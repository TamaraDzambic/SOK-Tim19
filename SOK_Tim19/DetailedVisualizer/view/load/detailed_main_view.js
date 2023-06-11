function nodeClick(el){
     d3.select(el).select('rect').attr("fill", "#3AA9AD")
        .transition()
          .duration(2000)
    .attr("fill", '#3AB19B');

    let bird_node = "bird_" + el.id.split("_")[1];

   for (var b of node_b[0]){
       if (b.id === bird_node){
           b.dispatchEvent(new Event('click'));
       }
   }

}
var force = d3.layout.force()
        .size([600, 600])
        .nodes(d3.values(nodes))
        .links(links)
        .on("tick", tick)
        .linkDistance(300)
        .charge(-500)
        .start();


var drag = force.drag()
    .on("dragstart", dragstart);


var svg_complex =d3.select('#main_view').call(d3.behavior.zoom().scaleExtent([0.5, 6]).on("zoom", function () {
        svg_complex.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
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

//dodavanje linkova
var link = svg_complex.selectAll('.link')
    .data(links)
    .enter().append('line')
    .attr('class', 'main_view_link');

//dodavanje cvorova
var node = svg_complex.selectAll('.main_view_node')
    .data(force_bird.nodes()) //add
    .enter().append('g')
    .attr('class', 'main_view_node')
    .attr('id', function(d){ return "main_" + d.name;})
    .on('click',function(){
       nodeClick(this);
    })
    .call(drag);


d3.selectAll('.main_view_node').each(function(d){coplexView(d);});

function coplexView(d){
  var duzina=150;
  var brojAtributa =Object.keys(d.attributes).length;
  console.log(brojAtributa);

  var textSize=10;
  var visina=(brojAtributa===0)?textSize:brojAtributa*textSize;
  visina+=textSize;

  //Ubacivanje kvadrata
  d3.select("g#"+ "main_" + d.name).append('rect').
      attr('x',0).attr('y',0).attr('width',duzina).attr('height',visina+20)
      .attr('fill', '#3AA9AD');

  //Ubacivanje naziva cvora
  d3.select("g#"+ "main_" + d.name).append('text').attr('x',duzina/2).attr('y',10)
  .attr('text-anchor','middle')
  .attr('font-size',textSize).attr('font-family','sans-serif')
  .attr('fill','#fff1e6').attr('border', 'bold').text(d.naziv);//d.naziv

  //Ubacivanje razdelnika
  d3.select("g#" + "main_" + d.name).append('line').
  attr('x1',0).attr('y1',textSize).attr('x2',duzina).attr('y2',textSize)
  .attr('stroke','#11172F').attr('stroke-width',1);

 // Ubacivanje atributa za cvorove
    for(var i=0;i<brojAtributa;i++)
    {
        var text = Object.keys(d.attributes)[i] +" : "+ Object.values(d.attributes)[i];
      d3.select("g#"+ "main_" + d.name).append('text').attr('x',0).attr('y',20+i*textSize)
      .attr('text-anchor','start')
      .attr('font-size',textSize).attr('font-family','sans-serif')
      .attr('fill','#fff1e6').attr('border', 'bold').text(text);

    }

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