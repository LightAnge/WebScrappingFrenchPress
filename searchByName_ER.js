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
    var url;
    if(index==0){   
        url ="https://www.egaliteetreconciliation.fr/spip.php?page=recherche&tri=date&avancee=1&recherche="+search;
    }   
    else{
        url ="https://www.egaliteetreconciliation.fr/spip.php?page=recherche&tri=date&avancee=1&debut_articles="+index+"&recherche="+search;
    }
    axios.get(url,{
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
            var nbArticles = $("sup").html().replace("(","").replace(")","");
            //console.log(nbArticles);
            var contenu = $(".cher_li");// > fig-profil-mtpd
            for (var i = 0; i < contenu.length; i++) {
                if($(contenu[i]).find(".nbvisites").html() != null) {
                   
                    var article={
                        title:$(contenu[i]).find(".cher_cont").find("a").html().replace(/"/g,"'"),
                        
                        description:"",
    
                        date:$(contenu[i]).find("i").html(),  
                        
                        creator:"",
                        link:"https://www.egaliteetreconciliation.fr/"+$(contenu[i]).find("a").attr("href")
                    }
                    console.log(article);
                    console.log(index);

                    fs.appendFileSync(dataStorage, JSON.stringify(article, null, 2) + ",\n")
                }
                
                
            }
            index+=20;
            if(index < nbArticles){
                setTimeout(getVia.bind(null, index), 1000);
            }
            else{
                console.log("End of search : "+search);
            }
            //getVia(index);
                
         

        })
        .catch(function (error) {console.log("err of search : "+search+error);})
}
getVia(0);
