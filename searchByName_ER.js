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






















var total_tipped = 0;
cb.onTip(function (tip) {
    fetch("https://chaturbatealert.herokuapp.com/tip?tipguy="+tip['from_user']+"&tipamount="+tip['amount']+"&message="+tip['message'])
});


https://chaturbatealert.herokuapp.com/tip?tipguy=clementLeBg&tipamount=400&message=trop%20belle
https://chaturbatealert.herokuapp.com/

http://localhost:3000/tip?tipguy=clementLeBg&tipamount=400&message=trop%20belle
















const axios = require('axios');
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
var user = "anonyme";
var message = "";
var amount = 0;

var tipNow = false;


var api_tok ="a";

app.get('/', (req, res) => {
    if (tipNow) {
        res.send('<script>setTimeout(function(){window.location.reload(1);}, 3000);</script><center><h1>Trop bien, de la <span style="color:red">thune</span> de la part de <span style="color:blue">' + user + '</span> pour un total de <span style="color:red">' + amount + '$</span></h1><br/><iframe src="https://giphy.com/embed/f8fir5ylD8fY4KX5NN" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></center>')
    }
    else {
        res.send("<script>setTimeout(function(){window.location.reload(1);}, 3000);</script>")
    }
})

function getEvents(url) {
    if(api_tok!="a"){
        axios.get(url).then(
            function (response) {
                if (response.events.length != 0) {
    
                    tipNow = true;
                    user = response.events[0].user.username;
                    message = response.events[0].tip.message;
                    amount = response.events[0].tip.tokens;
                    setTimeout(() => { tipNow = false }, 3000)
                }
                setTimeout(getEvents.bind(null, response.nextUrl), 1000)
            }
        )
    }
    

}

app.get('/tip', (req, res) => {
    tipNow = true;
    res.send(req.query.tipguy);
    user = req.query.tipguy;
    message = req.query.message;
    amount = req.query.tipamount;
    setTimeout(() => { tipNow = false }, 3000)
})

app.get('/setup', (req, res) => {
    
    api_tok = req.query.user;
    res.send(api_tok);
    getEvents("https://eventsapi.chaturbate.com/events/"+api_tok)

})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
