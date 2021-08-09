
const fs = require('fs'); //all clips
var search = "covid";


const execFile = [
    "searchByName_Libération",
    "searchByName_LeFigaro",
    //   "searchByName_ER",
    "searchByName_LeMonde",
    //"searchByName_LHumanité"
]
var analyseResult = [];
var listMot =[];
execFile.forEach((element) => {
    if (element == "searchByName_Libération" || true) {
        var analyseData = ("[" + fs.readFileSync(search + element.replace("searchByName", "") + ".log") + "]").replace("},\n]", "}]");
        var jsonObj = JSON.parse(analyseData);
        //console.log(jsonObj);
        jsonObj.forEach((el) => {
            el.title.split(" ").forEach((world) => {
                if (analyseResult[world] == null) {
                    analyseResult[world]=1;
                    listMot.push(world);
                    // analyseResult.push({ world : world, nb:1 });
                }
                else {
                    analyseResult[world]++;
                }

            })
            el.description.split(" ").forEach((world) => {
                if (analyseResult[world] == null) {
                    analyseResult[world]=1;
                    listMot.push(world);
                    // analyseResult.push({ world : world, nb:1 });
                }
                else {
                    analyseResult[world]++;
                }

            })

        })
        // console.log(analyseResult);
        

    }
    listMot.forEach((el) => {
        if(analyseResult[el]>600){
            var ss="";
            for(var i=0;i<analyseResult[el]/100;i++){
                ss+="-";
            }
            console.log(ss+ " " +el )

        }
    })

})
