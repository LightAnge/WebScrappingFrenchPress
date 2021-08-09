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
    axios.get("https://www.humanite.fr/search/"+search+"?page="+index+"&f%5B0%5D=type%3Aarticle", {
        headers: {

            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
            "cache-control": "max-age=0",
            "cookie": "visid_incap_1966243=PDyJyzPUR6mktzoCHcDzpo69C2EAAAAAQUIPAAAAAADak3UctDsnVAxoufnaPZxf; incap_ses_1174_1966243=+FQwDi9npmdx9PkkLuNKEI69C2EAAAAAA2XjCBvQzYKCohqBLHut9g==; has_js=1; SERVERID79161=09c7bcb1|YQu9l|YQu9k; atidvisitor=%7B%22name%22%3A%22atidvisitor%22%2C%22val%22%3A%7B%22vrn%22%3A%22-484057-%22%7D%2C%22options%22%3A%7B%22path%22%3A%22%2F%22%2C%22session%22%3A15724800%2C%22end%22%3A15724800%7D%7D; block-souscription=true; atuserid=%7B%22name%22%3A%22atuserid%22%2C%22val%22%3A%2291b813bc-5977-4857-b6c3-ee4869b664e4%22%2C%22options%22%3A%7B%22end%22%3A%222022-09-06T10%3A29%3A40.756Z%22%2C%22path%22%3A%22%2F%22%7D%7D; atauthority=%7B%22name%22%3A%22atauthority%22%2C%22val%22%3A%7B%22authority_name%22%3A%22default%22%2C%22visitor_mode%22%3A%22optin%22%7D%2C%22options%22%3A%7B%22end%22%3A%222022-09-06T10%3A29%3A40.757Z%22%2C%22path%22%3A%22%2F%22%7D%7D; _ga=GA1.2.1439877343.1628159381; _gid=GA1.2.1509814823.1628159381; _gat_UA-56349909-1=1; euconsent-v2=CO5_--ZPKdWffBcAHEFRBlCgAP_AAH_AAAqIIDtf_X_fb39j-_59__t0eY1f9_7_v-wzjhfds-8NyPvX_L8X52M7PF36pq4KuR4ku3bBIQNlHOnUTUmw6okVrTPsak2Mr7NKJ7Lkinsbe2dYGHtfn91TuZKZ7_7s_9fz__-v_v__79f3_-3_3_v59X_--_-_V399wAAAAAAAAAAAAAggOQSYal8BF2JY4Ek0aVQogRhWEh0AoAKKAYWiawgIWBTsrgI9QQMAEJqAjAiBBiCjFgEAAgEASERASAHggEQBEAgABACpAQgAImAQWAFgYBAAKAaFiBFAEIEhBkcFRymBARItFBPJWAJRd7GGEIZRYAUCj-iowESgAAAAAAAAAAAAAAAA.4ZPDegAnABWAC4AG4APQAhABGACmAFkALoAbAA6gB6AD4AIOAQ4BEQCPAJAASYAlQBPgCiAFOAKsAXAAwABiADKAGmANoAcwA7wB4gD9AIGAQoAiABHgCRgE3AJ7AUIBQ4CjAKOAVIAt4BcwDAgGFgMSAxQBjQDLgGdAM-AagA1wBtADcAG9gOAA4IBxQDxAHmAPXAe4B7wD6gH3APzAgoCCwEOAImgReBGACOAEfAJAgSQBJICSwEngLdAXCAukBicDIgMjAZjAzQDNQGegNHAaqA2oBwYDiAHNAOjAdUA9MB6oD2QH1gQAAgGBAeCBIIFAQQAgsBBsCDoEKwIegREAiOBEkCJYEU4IzAjOBG8CO4EfQJAASKAkcBKICUgEqAJYwS0BLUCXYEv4JlAmWBM4CcAE5AJ6AT2An4BQQCgwFCgKKgUbAqCBUyCqgKqgVfAr2BYOCw4LEAWgAtEBamC14LYAW5AuuBegC9gF9QMCAYMAwmBhYDDgGIgMVwYvBjADG4GQwMoAZmAzmBnUDQIGgwNDwaNBo4DSQGoQNRganA1gBrSDXINdAa9A2IBtEDawG2QNygbpA3sBvoDhAHEAOJAchA5GByiDloOXAcwg5kDmYHNQOhgdKA6cB1YDrAHYQO1gd9A8SB5YDzEHqgesg9eD2IHugPpgfXA_WB_MD-8H_gf_BAICAgECAIFAQLAgYBA0CCgEFQINwQdgg9BCGCEwEKQIVQQsghcBDCCGMEMwIbAQ7AiBBEGCIcERQInQRSgiohFWEVgIrgRYgi6BGaCNgEc4I6gR6Aj7BICCQUEhAJDASKgkYBI3CR4JIQSTgkyhJqEm4JPgShQlICUkEqYJWAStAlgBLHCWUJZwS1gluBLgCXIEuwJeQS9gmIBMeCZuEzoTPAmkBNQCa0E2IJtATbAm4hN4E3sJwAnDBOLCc4JzwTqwneCd8E8kJ5gnnBPcCfAE_EKAwoEhQOFBMKCwoMBQeChGFC4UMAodhRGFEkKLAothRgFGQKNAUbAo9hSIFIsKSQpKBSZClIKU4UqhSvCloKXIUwBTFCmQKZYU2hTcCnEFOoKeQU-Qp-Cn-FQQVBgqHBUUCpOFTIVNAqpBVnCs8K0IVpBWoCuAFccK5wroBXcCvEFesK_Ar9hYAFgILBQWFwsOCw8FiQLFIWLBYwCxwFj0LIQskBZMCygFlkLLgsvBZiCzMFmsLOQs8hZ8FpILS4WmhafC1ELUoWqBarC1wLXQWvwthC2KFsgW0QtqC2wFt8LcQtzhb2FvoLg4XChcMC4wFyMLkwuWBcwC5qFzoXPwujC6UF08LqQurBdfC7ELswXagu4hd0F3YLvYXgBeJC8gLy4XoBeiC9qF7oXvQvjC-UF9EL7AvtBffC_IL8wX7wv5C_oF_gL_oYABgNDBEMEoYKhguDBmGDYYOAwgBhEDCWGE4YUQwsDDEGGkMNgw4Bh1DD8MQAYhgxJhiaGJ8MUgxTBivDFoMWwYvwxkDGUGNkMbgxxhjmGO0MeQx6Bj5DIkMi4ZHBkeDJEGScMlgyXhk2GTgMngAAAAAAAAAA",
            "if-modified-since": "Thu, 05 Aug 2021 10:29:04 GMT",
            "if-none-match": "1628159344-1",
            "sec-ch-ua": '"Opera";v="77", "Chromium";v="91", ";Not A Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "cross-site",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36 OPR/77.0.4054.277"


        }
    })
        .then(function (response) {
            var $;
            // console.log(response);
            if (response.data["htmlContent"] == null) {
                $ = cheerio.load(response.data);
            }
            else {
                $ = cheerio.load(response.data["htmlContent"]);
            }

            var contenu = $(".search-results").find(".ds-1col");// > fig-profil-mtpd
            console.log(contenu.length);
            for (var i = 0; i < contenu.length; i++) {
                console.log()
                var titleBrut = $(contenu[i]).find("a").html();
                var descBrut = $(contenu[i]).find("p").html();
                var titleF,descF;
                if(titleBrut != null){
                    titleF=titleBrut
                    .replace(/&nbsp;/g," ")
                    .replace(/&amp;/g,"&")
                    .replace(/"/g,"'")
                    
                    ;
                }
                if(descBrut != null){
                    descF=descBrut
                    .replace(/&nbsp;/g," ")
                    .replace(/&amp;/g,"&")
                    .replace(/&lt;/g,"&")
                    .replace(/P&gt;/g,"&")

                    .replace(/"/g,"'")


                    .replace(/<strong class="mot_cle">/g,"")
                    .replace(/<\/strong>/g,"")
                    
                    .replace(/<span>/g,"")
                    .replace(/<\/span>/g,"")
                    
                    .replace(/<b>/g,"")
                    .replace(/<\/b>/g,"")
                    
                    .replace(/<i>/g,"")
                    .replace(/<\/i>/g,"")
                    
                    ;
                }

                var article = {
                    
                    title: titleF,
                    description: descF,

                    date: $(contenu[i]).find(".date-display-single").html(),

                    creator: $(contenu[i]).find(".group-ft-auteur-date-media").find("a").html(),
                    link: "https://www.humanite.fr"+$(contenu[i]).find("a").attr("href")
                }
                console.log(article.title);
                fs.appendFileSync(dataStorage, JSON.stringify(article, null, 2) + ",\n")
            }
            index++;
            if(contenu.length != 0){
                setTimeout(getVia.bind(null, index), 1000);
            }
            else{
                console.log("End of search : "+search);
            }




        })
        .catch(function (error) { console.log("End of search : " + search + error); })
}
getVia(0);