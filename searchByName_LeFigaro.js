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
    axios.get('https://recherche.lefigaro.fr/recherche/'+search+'/?page=' + index)
        .then(function (response) {
            var $;
            if(response.data["htmlContent"] == null){
                $ = cheerio.load(response.data );
            }
            else{
                $ = cheerio.load(response.data["htmlContent"] );
            }
            var contenu = $(".fig-profil");// > fig-profil-mtpd
            console.log(contenu.length);
            for (var i = 0; i < contenu.length; i++) {
                var article={
                    title:$(contenu[i]).find(".fig-profil-headline > a").html()
                    .replace(/<span class="highlight">/g, "").replace(/<\/span>/g, "")
                    .replace(/\n/g, "")
                    .replace(/"/g,"'")
                    .replace(/    /g, "")
                    .replace(/            /g, "")
                    .replace(/                /g, ""),
                    
                    description:$(contenu[i]).find(".fig-profil-chapo").html()
                    .replace(/<span class="highlight">/g, "").replace(/<\/span>/g, "")
                    .replace(/<strong>/g, "").replace(/<\/strong>/g, "")
                    .replace(/<b>/g, "").replace(/<\/b>/g, "")
                    .replace(/"/g,"'")
                    .replace(/\n/g, "")
                    .replace(/    /g, "")
                    .replace(/        /g, "")
                    .replace(/            /g, ""),

                    date:$(contenu[i]).find(".fig-date-pub > time").attr("datetime"),  
                    
                    creator:"",
                    link:$(contenu[i]).find("h2 > a").attr("href")
                }
                console.log(article.title);
                fs.appendFileSync(dataStorage, JSON.stringify(article, null, 2) + ",\n")
            }
            if (!response.data["noMoreArticles"] ) {
                index++;
                setTimeout(getVia.bind(null, index), 1000);
            }
            else {
                console.log("fini")
            }

        })
        .catch(function (error) {console.log(error);})
}
getVia(0);