var data3 = [
    {"tweet":"This is one tweet"},
    {"tweet":"This is next tweet"},
    {"tweet":"This is next tweet"},
    {"tweet":"This is next tweet"},
    {"tweet":"This is next tweet"},
    {"tweet":"This is next tweet"},
    {"tweet":"This is next tweet"},
    {"tweet":"This is next tweet"},
    {"tweet":"This is next tweet"},
    {"tweet":"This is next tweet"},
    {"tweet":"This is next tweet"},
    {"tweet":"This is next tweet"},
    {"tweet":"This is next tweet"},
    {"tweet":"This is next tweet"},
    {"tweet":"This is next tweet"},
    {"tweet":"This is next tweet"},
    {"tweet":"This is next tweet"},
    {"tweet":"This is next tweet"},
    {"tweet":"This is next tweet"},
    {"tweet":"This is next tweet"},
    {"tweet":"This is next tweet"},
    {"tweet":"This is next tweet"},
    {"tweet":"This is next tweet"},
    {"tweet":"This is last tweet"}
];


  var  i, txt = "";
  
      for (i in data3) {
        txt += "<div class=\"textbox\" border='1'>"
        txt += "<p>" + data3[i].tweet + "</p>";
        txt += "<p class=\"timep\">" + "Date of the tweet" + "</p>";
        txt += "</div>"   
      }
      document.getElementById("tweets_box").innerHTML = txt;
