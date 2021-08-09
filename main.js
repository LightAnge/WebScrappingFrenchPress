const { exec } = require("child_process");

const execFile =[
  "searchByName_Libération",
  "searchByName_LeFigaro",
  "searchByName_LeMonde",
  //"searchByName_ER",
  //"searchByName_LHumanité"
]



if( typeof process.argv[2] === "undefined"){
  console.log("please specify a query");
  const search = "baguette";
}
else{
  search = process.argv[2];
}

execFile.forEach(element => 
  exec("node "+element+".js "+search+" "+search+element.replace("searchByName","")+".log", (error, stdout, stderr) => {    
    //console.log(error);
    console.log(error);
    // console.log(`stdout: ${stdout}`);
    console.log(stdout);
  })
  )
