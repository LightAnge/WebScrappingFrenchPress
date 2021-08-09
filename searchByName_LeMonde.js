const axios = require('axios');
const cheerio = require('cheerio');
const fs = require("fs")

var search = "depardieu";
var dataStorage ="data.log";
if (typeof process.argv[2] === "undefined" || typeof process.argv[3] === "undefined") {
    console.log("please specify an search word")
    
    search = search.replace(" ", "%20");
}
else {
    search = process.argv[2].replace(" ", "%20");
    dataStorage = process.argv[3];
}



function getVia(index) {
    console.log('https://www.lemonde.fr/recherche/?search_keywords='+search+"&page="+index);
    axios.get('https://www.lemonde.fr/recherche/?search_keywords='+search+"&page="+index,{
        headers:{
            "Accept":	"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0"
        }
    })
        .then(function (response) {
            var $;
            // console.log(response);
            if(response.data["htmlContent"] == null){
                $ = cheerio.load(response.data );
            }
            else{
                $ = cheerio.load(response.data["htmlContent"] );
            }
            
            var contenu = $(".teaser");// > fig-profil-mtpd
            console.log(contenu.length);
            for (var i = 0; i < contenu.length; i++) {
                console.log()

                var article={
                    title:$(contenu[i]).find("h3").html().replace(/"/g,"'"),
                    
                    description:$(contenu[i]).find("p").html().replace(/"/g,"'"),

                    date:$(contenu[i]).find(".meta__date").html(),  
                    
                    creator:$(contenu[i]).find(".meta__author").html(),
                    link:$(contenu[i]).find("a").attr("href")
                }
                console.log(article);
                fs.appendFileSync(dataStorage, JSON.stringify(article, null, 2) + ",\n")
            }
            index++;
            setTimeout(getVia.bind(null, index), 1000);
            //getVia(index);
                
         

        })
        .catch(function (error) {console.log("End of search : "+search);})
}
getVia(1);