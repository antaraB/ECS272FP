

function getScatterplotData(clusterId){
  console.log("inside the getScatterplotData")

var emotion_name = ["anger","anticipation","disgust","fear","joy","sadness","surprise","trust"];
var svg2 = d3.select("#scatter"),
    margin = {top: 10, right: 10, bottom: 10, left: 10},
    widthscatter = +svg2.attr("width"),
    heightscatter = +svg2.attr("height"),
    domainwidth = widthscatter - margin.left - margin.right,
    domainheight = heightscatter - margin.top - margin.bottom;
  
var xscatter = d3.scaleLinear()
    .domain([0,10])
    .range([0, domainwidth]);

var yscatter = d3.scaleLinear()
    .domain([0,10])
    .range([domainheight, 0]);
  
var gscatter = svg2.append("g")
		.attr("transform", "translate(" + margin.top + "," + margin.top + ")");
  
gscatter.append("rect")
    .attr("width", widthscatter - margin.left - margin.right)
    .attr("height", heightscatter - margin.top - margin.bottom)
    .attr("fill", "none");

var g2scatter = svg2.append("g");



var color = d3.scaleThreshold()
    .domain([10,20,30,40,50,60,70])
    .range(["violet", "indigo", "blue", "green", "yellow", "orange", "red", "black"]);
    //.range(["#E43054", "#9F78BA", "#FADB4D", "#4EABC3", "#F4AB5B", "#35A450", "#82A6CA", "#ACCC6C"]);



var arc = d3.arc()
      .innerRadius(0)
      .outerRadius(function(d){
        // console.log("d dr :", d);
        return 5;
      });
      
var pie = d3.pie()
      .sort(null)
      .value(function(d) { return d; });
      

d3.json(selectedFilename + "_scatter.json", function(error, datascatter) {
  if (error) throw error;
  //console.log((datascatter[clusterId]));
  
  var keys=datascatter[clusterId];
  var tweetwords=[]
  // For each tweetID, 
  keys.forEach(function(tweetID) {
      tweetID.words.forEach(function(d){
      d.textword=d.word;
      d.emotions=d.plutchik;
      d.xvalue = +d.vad[1];
      d.yvalue = +d.vad[0];
      d.tweetID=tweetID.tweetid;
      tweetwords.push(d);
     })
  });

  //console.log("data scatter", datascatter);

  var points = g2scatter.selectAll("g")
    .data(tweetwords)
    .enter()
    .append("g")
    .attr("transform",function(d) { return "translate("+xscatter(d.xvalue)+","+yscatter(d.yvalue)+")"; })
    .attr("id", function (d,i) { return "chart"+i; })
    .append("g").attr("class","pies")
    .on("mouseover",function(d){
      //console.log("Points being hovered ", d);
      d3.select(this).attr("stroke","black")
      divtooltip.transition()
        .duration(500)  
        .style("opacity", 0);
      divtooltip.transition()
        .duration(200)  
        .style("visibility", "visible")
        .style("opacity", .9);
      var html;   
      var sum = 0;
      html = '<p><em>'+d.word+'</em></p> <p><strong>valence</strong> ' + d.vad[0] + '</p> <p><strong>arousal</strong> ' + d.vad[1] + '</p> <p><strong>dominance</strong> ' + d.vad[2] + '</p> <p><strong>emotion</strong> ';
      d.emotions.forEach(function(val,i) {
        //console.log(d,i,val);
                if (val!= 0 && i< 8) {
                    html = html + emotion_name[i] + " ";
                }})
      //html = html + '<h3></h3>';

      divtooltip .html(html) 
          .style("left", (d3.event.pageX) + "px")          
          .style("top", (d3.event.pageY - 28) + "px");

    })
    .on("mouseout", function(d){
      d3.select(this).attr("stroke","none");

    });
  
  
  
    // Select each g element we created, and fill it with pie chart:
  var pies = points.selectAll(".pies")
    .data(function(d){
      return pie(d.emotions);
    }) 
    .enter()
    .append('g')
    .attr('class','arc');

  pies.append("path")
    .attr('d',arc)  
      .attr("fill",function(d,i){
        if(d.index == 0) return emotioncolors["anger"]; 
        else if(d.index == 1) return emotioncolors["anticipation"]; 
        else if(d.index == 2) return emotioncolors["disgust"]; 
        else if(d.index == 3) return emotioncolors["fear"]; 
        else if(d.index == 4) return emotioncolors["joy"]; 
        else if(d.index == 5) return emotioncolors["sadness"]; 
        else if(d.index == 6) return emotioncolors["surprise"]; 
        else if(d.index == 7) return emotioncolors["trust"];      
      });
      

  gscatter.append("text").attr("class", "axislabel").attr("x", 145).attr("y", 8).text("Valence");
  gscatter.append("text").attr("class", "axislabel").attr("x", 240).attr("y", 135).text("Arousal");

  gscatter.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + yscatter.range()[0] / 2 + ")")
      .call(d3.axisBottom(xscatter).ticks(5));

  gscatter.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + xscatter.range()[1] / 2 + ", 0)")
      .call(d3.axisLeft(yscatter).ticks(5));
});
}