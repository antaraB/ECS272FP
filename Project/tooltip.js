var legend = d3.select('#legend');

var selectedFilename = "@BarackObama";

var emotions = [ "anger", "anticipation", "disgust", "fear", "joy", "sadness", "surprise", "trust" ];
var emotioncolors = {
        joy: "rgb(250,219,77)",
        trust: "rgb(153,204,51)",
        fear: "rgb(53,164,80)",
        surprise: "rgb(63,165,192)",
        sadness: "rgb(114,157,201)",
        disgust: "rgb(159,120,186)",
        anger: "rgb(228,48,84)",
        anticipation: "rgb(242,153,58)"
    };

var eachlegend = legend.selectAll(".legendc").data(emotions).enter().append("g").attr("class", "legendc");


eachlegend.append("circle").attr("cx", function(f, e) {
        return Math.floor(e / 2) * 75 + 7
    }).attr("cy", function(f, e) {
        return e % 2 == 0 ? 8 : 24
    }).attr("r", 5).attr("stroke", function(e) {
        return emotioncolors[e]
    }).attr("fill", function(e) {
        return emotioncolors[e]
    });

eachlegend.append("text").attr("x", function(f, e) {
        return Math.floor(e / 2) * 75 + 14
    }).attr("y", function(f, e) {
        return e % 2 == 0 ? 11 : 27
    }).text(function(e) {
        return e
    })


var dropdown = d3.select("#userid_text");

var options = ["@BarackObama", "@Cristiano", "@katyperry", "@realDonaldTrump"];

var select = d3.select("#userid_text")
  	.attr('class','select')
    .on('change',onchange)

var options = select
  .selectAll('option')
	.data(options).enter()
	.append('option')
		.text(function (d) { return d; });

function onchange() {
	selectValue = d3.select('select').property('value')
	console.log("Selected baes : ", selectValue);
	selectedFilename = selectValue;
	//getdataproject();
};