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


axios.get('https://www.liberation.fr/recherche/?query='+search,{
        headers:{
            "Accept":	"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0"
        }
    })
        .then(function (response) {
            var $;
            if(response.data["htmlContent"] == null){
                $ = cheerio.load(response.data );
            }
            else{
                $ = cheerio.load(response.data["htmlContent"] );
            }
            var contenu = $("script");
            for (var i = 0; i < contenu.length; i++) {
                if($(contenu[i]).html().includes("queryly.init")){
                    // console.log($(contenu[i]).attr("src"))
                    console.log($(contenu[i]).html()
                    .replace('queryly.init("',"")
                    .split('",')[0]
                    
                    )
                    getArticles(0,$(contenu[i]).html()
                    .replace('queryly.init("',"")
                    .split('",')[0],search);
                }
                
            }

        })
        .catch(function (error) {console.log(error);})


function getArticles(endindex,apiKey,query){
    axios.get('https://api.queryly.com/json.aspx?queryly_key='+apiKey+'&query='+query+'&endindex='+endindex+'&batchsize=100&callback=searchPage.resultcallback&showfaceted=true&extendeddatafields=creator&timezoneoffset=-60')
        .then(function (response) {
            var contenuBrut;
            // console.log(response);
            if(response.data["htmlContent"] == null){
                contenuBrut = response.data;
                // console.log(response.data);
            }
            else{
                contenuBrut = response.data["htmlContent"];
                // console.log(response.data["htmlContent"]);
            }

            var jsonText = contenuBrut
            .replace("try{","")
            .replace("searchPage.resultcallback(","")
            .replace("catch(e){}","")
            .replace(");","")
            .replace("    }","");
            // console.log(jsonText);

            var jsonObj = JSON.parse(jsonText);


            


            jsonObj.items.forEach(element => {
                var article={
                    title:element.title,
                    description:element.description,
                    date:element.pubdate,
                    creator:element.creator,
                    link:element.link

                }
                console.log(article.title);
                fs.appendFileSync(dataStorage, JSON.stringify(article, null, 2) + ",\n")
                
            });



            if(jsonObj.items[jsonObj.items.length-1].index== jsonObj.metadata.total -1){
                console.log("END")
            }
            else{
                setTimeout(getArticles.bind(null,jsonObj.metadata.endindex,apiKey,query),1000);
            }
        })
        .catch(function (error) {console.log(error);})

}