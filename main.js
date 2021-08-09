const { exec } = require("child_process");

const execFile =[
  "searchByName_Libération",
  "searchByName_LeFigaro",
//   "searchByName_ER",
  "searchByName_LeMonde",
  //"searchByName_LHumanité"
]
const search = "covid";

execFile.forEach(element => 
  exec("node "+element+".js "+search+" "+search+element.replace("searchByName","")+".log", (error, stdout, stderr) => {    
    //console.log(error);
    console.log(error);
    // console.log(`stdout: ${stdout}`);
    console.log(stdout);
  })
  )
