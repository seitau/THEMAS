const pack = data => d3.pack()
    .size([width - 2, height - 2])
    .padding(3)
  (d3.hierarchy({children: data})
    .sum(d => d.value))

const width = 932
const height = width
const format = d3.format(",d")
const color = d3.scaleOrdinal().range(d3.schemeCategory10)
const DOM = document.getElementById("result")
const data = {name:"flare",children:[{name:"analytics",children:[{name:"cluster",children:[{name:"AgglomerativeCluster",size:3938},{name:"CommunityStructure",size:3812},{name:"HierarchicalCluster",size:6714},{name:"MergeEdge",size:743}]},{name:"graph",children:[{name:"BetweennessCentrality",size:3534},{name:"LinkDistance",size:5731},{name:"MaxFlowMinCut",size:7840},{name:"ShortestPaths",size:5914},{name:"SpanningTree",size:3416}]},{name:"optimization",children:[{name:"AspectRatioBanker",size:7074}]}]},{name:"animate",children:[{name:"Easing",size:17010},{name:"FunctionSequence",size:5842},{name:"interpolate",children:[{name:"ArrayInterpolator",size:1983},{name:"ColorInterpolator",size:2047},{name:"DateInterpolator",size:1375},{name:"Interpolator",size:8746},{name:"MatrixInterpolator",size:2202},{name:"NumberInterpolator",size:1382},{name:"ObjectInterpolator",size:1629},{name:"PointInterpolator",size:1675},{name:"RectangleInterpolator",size:2042}]},{name:"ISchedulable",size:1041},{name:"Parallel",size:5176},{name:"Pause",size:449},{name:"Scheduler",size:5593},{name:"Sequence",size:5534},{name:"Transition",size:9201},{name:"Transitioner",size:19975},{name:"TransitionEvent",size:1116},{name:"Tween",size:6006}]},{name:"data",children:[{name:"converters",children:[{name:"Converters",size:721},{name:"DelimitedTextConverter",size:4294},{name:"GraphMLConverter",size:9800},{name:"IDataConverter",size:1314},{name:"JSONConverter",size:2220}]},{name:"DataField",size:1759},{name:"DataSchema",size:2165},{name:"DataSet",size:586},{name:"DataSource",size:3331},{name:"DataTable",size:772},{name:"DataUtil",size:3322}]},{name:"display",children:[{name:"DirtySprite",size:8833},{name:"LineSprite",size:1732},{name:"RectSprite",size:3623},{name:"TextSprite",size:10066}]},{name:"flex",children:[{name:"FlareVis",size:4116}]},{name:"physics",children:[{name:"DragForce",size:1082}]}]};

  const root = pack(data);
  
  const svg = d3.select(DOM.svg(width, height))
      .style("width", "100%")
      .style("height", "auto")
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle");

  const leaf = svg.selectAll("g")
    .data(root.leaves())
    .enter().append("g")
      .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

  leaf.append("circle")
      .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
      .attr("r", d => d.r)
      .attr("fill-opacity", 0.7)
      .attr("fill", d => color(d.data.group));

  leaf.append("clipPath")
      .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
    .append("use")
      .attr("xlink:href", d => d.leafUid.href);

  leaf.append("text")
      .attr("clip-path", d => d.clipUid)
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter().append("tspan")
      .attr("x", 0)
      .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
      .text(d => d);

  leaf.append("title")
      .text(d => `${d.data.title}\n${format(d.value)}`);
    
  svg.node();
