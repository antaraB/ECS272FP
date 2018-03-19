

function getScatterplotData(clusterId){
  console.log("inside the getScatterplotData")

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
    .attr("fill", "#F6F6F6");

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
      

d3.json("@BarackObama_scatter.json", function(error, datascatter) {
  if (error) throw error;
  // var clusterId=0;
  var keys=Object.keys(datascatter[clusterId][clusterId])
  var tweetwords=[]
  // For each tweetID, 
  keys.forEach(function(tweetID) {
      datascatter[clusterId][clusterId][tweetID].forEach(function(d){
      d.textword=d.word;
      d.emotions=d.plutchik;
      d.xvalue = +d.vad[1];
      d.yvalue = +d.vad[0];
      d.tweetID=tweetID;
      tweetwords.push(d);
     })
     
  });

  var points = g2scatter.selectAll("g")
    .data(tweetwords)
    .enter()
    .append("g")
    .attr("transform",function(d) { return "translate("+xscatter(d.xvalue)+","+yscatter(d.yvalue)+")"; })
    .attr("id", function (d,i) { return "chart"+i; })
    .append("g").attr("class","pies");
  
  
  
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
        // console.log(d,i)
        // var m = [1,0,0,1,1,0,1,1]
        if(d.index == 0) return color(1); 
        else if(d.index == 1) return color(10); 
        else if(d.index == 2) return color(20); 
        else if(d.index == 3) return color(30); 
        else if(d.index == 4) return color(40); 
        else if(d.index == 5) return color(50); 
        else if(d.index == 6) return color(60); 
        else if(d.index == 7) return color(70);      
      });
      
  

  gscatter.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + yscatter.range()[0] / 2 + ")")
      .call(d3.axisBottom(xscatter).ticks(5));

  gscatter.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + xscatter.range()[1] / 2 + ", 0)")
      .call(d3.axisLeft(yscatter).ticks(5));
});}