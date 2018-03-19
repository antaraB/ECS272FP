
var parseDate = d3.timeParse('%Y-%m-%d %H:%M:%S');

function getRawTweetData(clusterId){

    d3.json("@BarackObama_scatter.json", function(error, datascatter) {
        if (error) throw error;
        var rawtweets = datascatter[0];
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

            txt += "<div class=\"textbox\" border='1'>"
            txt += "<p>" + some + "</p>";
            txt += "<p class=\"timep\">" + parseDate(rawtweets[i].tweetdate) + "</p>";
            txt += "</div>"   
        }
        document.getElementById("tweets_box").innerHTML = txt;
    });
};





