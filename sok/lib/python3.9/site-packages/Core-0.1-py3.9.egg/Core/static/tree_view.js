"use strict";
var rootNode = treeData.name;

function _drawTree(treeData) {
    // This solves the maximum call stack issue with d3 layout function

    var margin = {
            top: 55,
            right: 20,
            bottom: 30,
            left: 30
        },
        width = 200 - margin.left - margin.right,
        barHeight = 40,
        barWidth = width * 0.40;
    var i = 0,
        duration = 400,
        root;

    var tree = d3.layout.tree()
        .nodeSize([0, 75])
        .children(function(d) {
            return d.children;
        });

    var line = d3.svg.line().interpolate('step') // pomeranje kvadrata //pomeranje linije gore dole
        .x(function(d) {
            return d.x-20;
        })
        .y(function(d) {
            return d.y-40;
        });

    // Define 'div' for tooltips
    var div = d3.select('#tree')
        // Declare the tooltip div
        .append('div')
        // Apply the 'tooltip' class
        .attr('class', 'tooltip')
        .style('opacity', 0);

    var tree_svg = d3.select('#tree').append('svg').attr('class', 'tree_view_svg')
        //.attr('width', width + margin.left + margin.right)
        .append('g')
        .attr('transform', `translate(${ margin.left },${ margin.top })`).attr('class','svg_g');

    function lineData(d) { //pomeranje linija
        var points = [{
            x: d.source.y+barWidth/2,
            y: d.source.x+barHeight-5
        }, {
            x: d.target.y+ 20,
            y: d.target.x + barHeight/1.5
        }];

        return line(points);
    }

    root = treeData;
    root.x0 = 0;
    root.y0 = 0;

    update(root);
    d3.select('.tree_view_svg')
            .attr('width', $(".svg_g")[0].getBBox().width*1.4);

    function update(source) {
        // Compute the flattened node list.
        var tree_nodes = tree.nodes(root);

        var height = Math.max(500, tree_nodes.length * barHeight + margin.top + margin.bottom);

        d3.select('.tree_view_svg').transition()
            .duration(duration)
            .attr('height', height);

        // Compute the layout.
        tree_nodes.forEach(function(n, i) { //PODESAVANJE KOORDINATA KVADRATA
            n.x = i * barHeight/1.2; //d.target.x - barHeight/1.5
        });
        tree_nodes.y = barHeight / 1.5;


        // Update the nodes.
        var tree_node = tree_svg.selectAll('g.tree_node')
            .data(tree_nodes, function(d) {
                return d.id || (d.id = ++i);
            });

        var nodeEnter = tree_node.enter().append('g')
            .attr('class', 'tree_node')
            .attr('transform', function() {
                return `translate(${ source.y0},${ source.x0 })`;
            })
            .style('opacity', 1e-6).style('text-align', 'left');

       function getAttributes(attributes){
            var str = ""
            for (const [key, value] of Object.entries(attributes)) {
              str +=  "- " + key + " : "+ value+"<br>";
            }
            return str;
       }

        // Enter any new nodes at the parent's previous position.
        nodeEnter.append('rect')
            .attr('y', -barHeight / 2) //x i y te tacke
            .attr('height',function(){return barHeight/2})
            .attr('width', function(d) {
                return d.naziv.length*16})
            .style('font-size', '15px').style('fill', function(d) {
                console.log("BOJE")
                console.log(d.color)
                return d.color}).style('text-align', 'center')
            .attr('class', 'ractangle')
            .on('click', click)
            .on('mouseover', function(d) {
                div.transition()
                    .duration(500)
                    .style('opacity', 0);
                div.transition()
                    .duration(200)
                    .style('opacity', 1)
                    .style('pointer-events', 'auto')
                    .style('visibility','visible');
                div.html(
                        `<h3 class = 'popover-title' >${ d.naziv }</h3>
                    <br>
                    <p class='popover-assets'>
                            ${ getAttributes(d.attributes) }
                    </p>`)
                    .style('left', '20%')
                    .style('top', '80px').style('color', '#3AA9AD').style('font-size', '15px');
            }).on('mouseout', function(d) {
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
            });

        // Create anchors for y-offset to display company at the top of page

        // Transition nodes to their new position.
         nodeEnter.append('text').attr('id', function (d){return 'text_' + d.name;})
            .attr('dy', -7)
            .attr('dx', 10.5)
            .style('fill', fontColor).style('text-align', 'left')
            .attr('font-size',10).attr('font-family','sans-serif').text(function(d) {
                if(d.attr === true){
                    return "- " +d.naziv;
                }else{
                    return "+ " +d.naziv;
                }

            });
         tree_node.transition()
            .duration(duration)
            .attr('transform', function(d) {
                return `translate(${ d.y },${ d.x })`;
            })
            .style('opacity', 1)
            .select('rect')
            .select('text')
            .style('fill', fontColor).style('border', function(d) {
                return d.color}).style('fill', function(d) {
                    console.log("Boja")
                return d.color});


         nodeEnter.transition()
            .duration(duration)
            .attr('transform', function(d) {
                return `translate(${ d.y },${ d.x })`;
            })
            .style('opacity', 1);

        // Transition exiting nodes to the parent's new position.
        tree_node.exit().transition()
            .duration(duration)
            .attr('transform', function() {
                return `translate(${ source.y },${ source.x })`;
            })
            .style('opacity', 1e-6)
            .remove();

        // Update the links…
        var tree_link = tree_svg.selectAll('path.link')
            .data(tree.links(tree_nodes), function(d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        tree_link.enter().insert('path', 'g')
            .attr('class', 'link')
            .attr('d', lineData)
            .transition()
            .duration(duration)
            .attr('d', lineData);

        // Transition links to their new position.
        tree_link.transition()
            .duration(duration)
            .attr('d', lineData);

        // Transition exiting nodes to the parent's new position.
        tree_link.exit().transition()
            .duration(duration - 400)
            .attr('d', lineData)
            .remove();

        // Stash the new positions for transition from right
        tree_nodes.forEach(function(d) {
            d.x0 = d.x + 50;
            d.y0 = d.y + 400;
        });

        d3.select('.tree_view_svg')
            .attr('width', $(".svg_g")[0].getBBox().width*1.2);
    }

   // Toggle children on click.
    async function click(d) {
        let main_node = "main_" + d.init_name;
        console.log(main_node);

        for (var b of node[0]){
            console.log(b.__data__.init_name);
           if (b.__data__.init_name == d.init_name){
               b.dispatchEvent(new Event('click'));
           }
       }
        if(d.attr === false){
             if( d3.select('text#text_' + d.name).text() === ("- " +d.naziv))
                d3.select('text#text_' + d.name).text("+ " +d.naziv);
            else
                 d3.select('text#text_' + d.name).text("- " +d.naziv);
        }

        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = await generateChildren(d);
            d._children = null;
        }
        update(d);
    }

    function fontColor(d) {
        return d._children ? '#FFFFFF' : d.children ? '#FFFFFF' : '#FFFFFF';
    }

    function generateChildren(current_node){
        return new Promise(function (resolve, reject) {
            $.get( "/get_children",
            {
                node_id: current_node.name
            }, function( data ) {


                nodes = JSON.parse(data);
                node_data = [];

                for([key, valueA] of Object.entries(current_node.attributes)) {
                        node_val = {
                            name: key,
                            naziv: key + " : " + valueA,
                            attributes: {},
                            children: [],
                            attr : true,
                            color : '#3AA9AD'
                        }
                        node_data.push(node_val);
                    }

                nodes.forEach(function(node){
                    node_val = {
                        name: node.node_id,
                        init_name: node.init_node_id,
                        naziv: node.name,
                        attributes: node.attributes,
                        children: [],
                        attr : false,
                        color: '#3AA9AD'
                    }
                    node_data.push(node_val);
                });
                resolve(node_data);
            });
         });
    }
}

_drawTree(treeData);