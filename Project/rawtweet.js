
var parseDate = d3.timeParse('%Y-%m-%d %H:%M:%S');

function getRawTweetData(clusterId){

    d3.json(selectedFilename + "_scatter.json", function(error, datascatter) {
        if (error) throw error;
        var rawtweets = datascatter[clusterId];
        var  i, txt = "";

        for(i in rawtweets){
            var words = [];
            rawtweets[i].words.forEach(function(word){
                words.push(word.word);
            });
            var some = rawtweets[i].tweet.replace(/\w+/g, function(o) {
                var n = o.toLowerCase();
                if (words.includes(o)) {
                    return "<strong>" + o + "</strong>"
                } else {
                    return o
                }
            })
            //console.log("rawtweets[i] : ", rawtweets[i]);
            txt += "<div class=\"textbox\" id=\"textbox-"+ rawtweets[i].tweetid +"\" border='1'>"
            txt += "<p>" + some + "</p>";
            txt += "<p class=\"timep\">" + parseDate(rawtweets[i].tweetdate) + "</p>";
            txt += "</div>"   
        }
        document.getElementById("tweets_box").innerHTML = txt;

        var element = d3.select("#tweets_box").selectAll(".textbox")
        .on("mouseover",function(){
            var curr = d3.select(this).style("background","#FFCC99"); 

            var id = this.id.split("-");

            onRawTweetHover(id[1]);    
        })
        .on("mouseout",function(d){
            d3.select(this).style("background","none");  

            var id = this.id.split("-");
            onRawTweetNotHover(id[1]);             
        });

    });
};

function onCircleHover(tweetid){
    var element = d3.select("#tweets_box").select("#textbox-" + tweetid);
    element.dispatch("mouseover");
}

function onCircleNotHover(tweetid){
    var element = d3.select("#tweets_box").select("#textbox-" + tweetid);
    element.dispatch("mouseout");
}



