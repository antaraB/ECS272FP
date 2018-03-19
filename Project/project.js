// Init variables
  var svg = d3.select('#emviz_canvas');
  var margin = {top: 20, right: 20, bottom: 110, left: 40};
  var margin2 = {top: 430, right: 20, bottom: 30, left: 40};
  var width = +svg.attr('width') - margin.left - margin.right;
  var height = +svg.attr('height') - margin.top - margin.bottom;
  var height2 = +svg.attr('height') - margin2.top - margin2.bottom;

  // We need to parse the time of our data
  var parseDate = d3.timeParse('%Y-%m-%d');

  // Next, we define the scales for our barchart
  var x = d3.scaleTime().range([0, width]);
  var x2 = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);
  var yr = d3.scaleLinear().range([height, 0]);
  var y2 = d3.scaleLinear().range([height2, 0]);

  // Create axis generators
  var xAxis = d3.axisBottom(x);
  var xAxis2 = d3.axisBottom(x2);
  var yAxis = d3.axisLeft(y);
  var yAxisR = d3.axisRight(yr);

  // Create brush for x axis
  var brush = d3.brushX()
  .extent([[0, 0], [width, height2]])
  .on('brush end', brushed);

  // Add area
  var area = d3.area()
  .curve(d3.curveMonotoneX)
  .x(function(d) { return x(d.week); })
  .y0(height)
  .y1(function(d) { return yr(d.tweetcount); });

  var area2 = d3.area()
  .curve(d3.curveMonotoneX)
  .x(function(d) { return x2(d.week); })
  .y0(height2)
  .y1(function(d) { return y2(d.tweetcount); });

  var areanew = d3.area()
  .curve(d3.curveMonotoneX)
  .x(function(d) { return x(d.data.week); })
  .y0(function(d) {return y(d[0]); })
  .y1(function(d) { return y(d[1]); });

  var stack = d3.stack()
  .keys(["anger", "apple", "sadness", "hate"])
  .order(d3.stackOrderNone)
    //.offset(d3.stackOffsetExpand);
    //.offset(d3.stackOffsetDiverging);
    //.offset(d3.stackOffsetNone);
    .offset(d3.stackOffsetSilhouette);
    //.offset(d3.stackOffsetWiggle);

    var keys = ["anger", "apple", "sadness", "hate"];


    var color = d3.scaleLinear()
    .range(["#51D0D7", "#31B5BB"]);


  // Focus is the main visual part of the visualization
  var focus = svg.append('g')
  .attr('class', 'focus')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Context refers to the selection the user takes with the brush
  var context = svg.append('g')
  .attr('class', 'context')
  .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');

  var pa = svg.append('defs').append('clipPath').attr("class","clippathclass")
  .attr('id', 'clip');

  var ca = focus.append("g").attr("clip-path","url(#clip)").selectAll("rect");

  var va, eea, g1;

  var ea = focus.selectAll("path");

  var c;

  var series;

  //////////////////////////////////
  // Now we need to read the data //
  //////////////////////////////////
  d3.csv('data1.csv', type, function(error, data) {
    if (error) throw error;

    c = data;
    series = stack(data);

    // Calculate domain of x axis
    x.domain(d3.extent(data, function(d) { return d.week; }));
    x2.domain(x.domain());

    // Calculate domain of y axis
    y.domain([-3, 3 * 1.2]);
    yr.domain([0, 1.2 * d3.max(data, function(d) { return d.tweetcount; })]);
    y2.domain(yr.domain());

    // Add clippath to crop area that goes beyond the axises
    /*svg.append('defs').append('clipPath')
    .attr('id', 'clip')*/
    pa.append('path')
    .datum(data)
    .attr('class', 'area')
    .attr('d', area);

    va = ca.data(data)
    .enter().append("rect").attr("class", "emtweets")
    .attr("x", function(k) {
      return x(k.week);
    })
    .attr("y", 0)
    .attr("width", function(l, k) {
      if (k >= data.length - 1) {
        return 0
      }
      return x(data[k + 1].week) - x(l.week)
    })
    .attr("height", height)
    .attr("fill", "steelblue")
    .on("mouseover", function(m) {

    }).on("mouseout", function(m) {

    }).on("click", function(n, m) {

    });



    series.forEach(function(m){
      svg.select('defs').append('clipPath').attr("class","clippathclass").attr('id', 'clip-' + m.key)
      .append('path')
      .attr("class", "bandpath-"+m.key)
      .datum(m)
      .attr('d',areanew)
      .attr('opacity', 0.7);
    });


    keys.forEach(function(m){

      focus.append("g").attr("clip-path","url(#clip-" + m + ")").attr("class", "embandrect-" + m).selectAll("rect").data(data)
      .enter().append("rect").attr("class", "emtweets" + m)
      .attr("x", function(k) {
        return x(k.week);
      })
      .attr("y", 0)
      .attr("width", function(l, k) {
        if (k >= data.length - 1) {
          return 0
        }
        return x(data[k + 1].week) - x(l.week)
      })
      .attr("height", height)
      .attr("fill", function(d) { 
        if(m == "apple") return "green"; 
        else if(m == "anger") return "red";
        else if(m == "sadness") return "yellow";
        else if(m == "hate") return "orange";
        return "black";
      });

    })


    /////////////////////////
    d3.json("data.json", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.value2 = parseDate(d.value2);
      d.value = +d.value;


      var dataa = [];
      var temp = { id : d.id, parentId : undefined, size : undefined };
      dataa.push(temp);
      d.more.forEach(function(x){
        var temp1 = {};
        temp1.id = x.more1;
        temp1.parentId = d.id;
        temp1.size = x.more2.toString();
              dataa.push(temp1);
            });

      const layout = d3.pack()
      .size([75, 75])
      .padding(0)


      dataa.sort(function(x, y){ return d3.ascending(x.size, y.size) })
      if (error) throw error;

      const stratData = d3.stratify()(dataa),
      root = d3.hierarchy(stratData)
      .sum(function (d) {return d.data.size })
      .sort(function(a, b) { return b.value - a.value }),
      nodes = root.descendants()

      layout(root)



      //console.log("nodes : ", nodes );

      nodes.forEach(function(y){
        y.cx = d.value2;
        y.cy = +d.value;
      });

      d.nodes = nodes;

    });




    //console.log("data : ", data);
    //console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaa ");







    g1 = focus.selectAll("points")
    .data(data)
    .enter().append("g").attr("class", "circles");


    g1.append("circle")
    .attr("class", "innerc")
      //.attr("r", 7)
      .attr("r", function(d){
        return 6;
      })
      .attr("cx", function(d) { return x(d.value2); })
      .attr("cy", function(d) { return y(d.value); })
      .style("fill", "darkgray")
      .style("fill-opacity", 0.8)
      .style("stroke", "black");


      g1.append("line")
      .attr("class", "domline")
      .attr("x1",function(d) { return x(d.value2) - 5.590147365513294; })  
      .attr("y1",function(d) { return y(d.value) + 2.179507383; })  
      .attr("x2",function(d) { return x(d.value2) + 5.590147365513294; })  
      .attr("y2",function(d) { return y(d.value) - 2.179507383; })  
      .attr("stroke","white")  
      .attr("stroke-width",2)  
      .attr("marker-end","url(#ahead)");


      var gDetails = g1.append("g").attr("class", "gDetails").attr("visibility", "hidden").attr("opacity", 0);

      gDetails.append("circle")
      .attr("class", "outerr")
      .attr("r", 42)
      .attr("cx", function(d) { return x(d.value2); })
      .attr("cy", function(d) { return y(d.value); })
      .attr("stroke", "black")
      .attr("fill", "lightgreen")
      .attr("fill-opacity", 0.5);


      gDetails.append("circle")
      .attr("class", "outerc")
      .attr("r", 35)
      .attr("cx", function(d) { return x(d.value2); })
      .attr("cy", function(d) { return y(d.value); })
      .attr("stroke", "black")
      .attr("fill", "none");


      var innerCirclesAndArrows = gDetails.append("g").attr("class", "hovercircles");
      innerCirclesAndArrows.selectAll('circle')
      .data(function(d){ 
        return d.nodes;
      })
      .enter()
      .append('circle')
      .attr('class', 'insidecircles')
      .attr('cx', function (d) { return x(d.cx) + d.x - 75/2; })
      .attr('cy', function (d) { return y(d.cy) + d.y - 75/2; })
      .attr('r', function (d) { return d.r; })
      .style("fill", function(d) { if(d.depth == 0) return "red"; else return "green"; });


      innerCirclesAndArrows.selectAll('line')
      .data(function(d){ 
        return d.nodes;
      })
      .enter().append("line")
      .attr("class", "domline")
      .attr("x1",function(d) { return x(d.cx) + d.x - 75/2 - d.r/2; })  
      .attr("y1",function(d) { return y(d.cy) + d.y - 75/2 + d.r; })  
      .attr("x2",function(d) { return x(d.cx) + d.x - 75/2 + d.r/2; })  
      .attr("y2",function(d) { return y(d.cy) + d.y - 75/2 - d.r; })  
      .attr("stroke","white")  
      .attr("stroke-width",2)  
      .attr("marker-end","url(#ahead)")
      .attr("visibility", function(d){if(d.depth == 0) return "hidden"; else return "visibility";});

      g1.on("mouseover", function(d){
        //console.log("d : ",d);
        d3.select(this).select(".gDetails").transition().duration(500).attr("opacity", 1).attr("visibility", "visible");

      }).on("mouseout", function(d){
        d3.select(this).select(".gDetails").transition().duration(500).attr("opacity", 0).attr("visibility", "hidden");
      })




    });

    /////////////////////////

    // Append x axis to focus
    focus.append('g')
    .attr('class', 'axis axis-x')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

    // Append y axis to focus
    focus.append('g')
    .attr('class', 'axis axis-y')
    .call(yAxis);

      // Append y axis to focus
      focus.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', 'translate(' + width + ' ,0)') 
      //.attr('transform', 'translate(0,' + width + ')')
      .call(yAxisR);

    // Append area
    context.append('path')
    .datum(data)
    .attr('class', 'contextarea')
    .attr('d', area2);

    // Append x axis to context
    context.append('g')
    .attr('class', 'axis axis-x')
    .attr('transform', 'translate(0,' + height2 + ')')
    .call(xAxis2);

    // Add brush to context
    context.append('g')
    .attr('class', 'brush')
    .call(brush)
    .call(brush.move, x.range());


  });

function brushed() {
    // Ignore Brush-by-zoom
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;

    // Get range of selected area
    var s = d3.event.selection || x2.range();

    // Recalculate domain of x
    x.domain(s.map(x2.invert, x2));

    va.attr("x", function(k) {
      return x(k.week);
    })
    .attr("y", 0)
    .attr("width", function(l, k) {
      if (k >= c.length - 1) {
        return 0
      }
      return x(c[k + 1].week) - x(l.week)
    })
    .attr("height", height)
    .attr("fill", "steelblue");

    // Adjust area
    pa.select('.area').attr('d', area);

    //eea.attr('d', areanew);

    /////////////////////////////////////////////////////////////////////////////////////
    series.forEach(function(m){

      svg.select('defs').select('#clip-' + m.key).select('.bandpath-'+m.key).attr('d',areanew);

    });

    keys.forEach(function(m){

      focus.select(".embandrect-" + m).selectAll('.emtweets'+m).attr("x", function(k) {
        return x(k.week);
      })
      .attr("y", 0)
      .attr("width", function(l, k) {
        if (k >= c.length - 1) {
          return 0
        }
        return x(c[k + 1].week) - x(l.week)
      })
      .attr("height", height)
      .attr("fill", function(d) { 
        if(m == "apple") return "green"; 
        else if(m == "anger") return "red";
        else if(m == "sadness") return "yellow";
        else if(m == "hate") return "orange";
        return "black";
      });
    });

    /////////////////////////////////////////////////////////////////////////////////////


    focus.selectAll(".circles").select('.innerc')
      .attr("cx", function(d) { return x(d.value2); })

    focus.selectAll(".circles").select('.domline')
      .attr("x1",function(d) { return x(d.value2) - 5.590147365513294; })  
      .attr("x2",function(d) { return x(d.value2) + 5.590147365513294; })  ;


    focus.selectAll(".circles").select('.gDetails').select('.outerc')
      .attr("cx", function(d) { return x(d.value2); });


    focus.selectAll(".circles").select('.gDetails').select('.outerr')
      .attr("cx", function(d) { return x(d.value2); });


    focus.selectAll(".circles").select('.gDetails').select('.hovercircles').selectAll('.insidecircles')
      .attr('cx', function (d) { return x(d.cx) + d.x - 75/2; });


    focus.selectAll(".circles").select('.gDetails').select('.hovercircles').selectAll('.domline')
      .attr("x1",function(d) { return x(d.cx) + d.x - 75/2 - d.r/2; })  
      .attr("x2",function(d) { return x(d.cx) + d.x - 75/2 + d.r/2; });







    ///////////////////////////////////////////////////////////////////////////////////////

    // Adjust x axis to new domain
    focus.select('.axis-x').call(xAxis);

   
  }

  function type(d) {
    d.week = parseDate(d.week);
    d.tweetcount = +d.tweetcount;
    d.valance = +d.valance;
    return d;
  }