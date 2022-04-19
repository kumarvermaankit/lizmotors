const router = require("express").Router()
const readXlsxFile = require('read-excel-file/node')
const axios = require('axios')

const data = require("./metro.json");// retrieving data from JSON file.

const {PythonShell} = require("python-shell")

const allData = new Object(); // to store data at all coordinates

var currentLine = ""



var paths = new Object();  // to store expected shortest route, with corresponding lines , ex: Rithala:red
var pathsArray = []       // for storing each metro stations name to access them with index

var locationCheckStatus = new Object() // store whether user location matches corresponding expected metro station. ex: huda:true



// Data of time between two consecutive metro station in minutes in each line

const metroLineTimings = {
    Blue: 2.02,
    BlueBranch: 1.875,
    Magenta: 2.36,
    Yellow: 2.22,
    Red: 2.03,
    Green: 2.49,
    GreenBranch: 1.33,
    Violet: 2.24,
    Pink: 2.69,
    PinkBranch: 2.43,
    Orange: 5.2,//(Airpot Express Line)
    Aqua: 2.86,
    Grey: 2.10,
    RapidMetro: 5.2,
    Interchange: 6
}

var stationsbyName = new Object(); // to store data of stations by name with their long & lat
var stationsbyCoor = new Object(); // to store data of stations by name with their long & lat
var networkflag = false

// var i = 0;
var currentPosition = {
    lat: "",
    lon: "",
    station:"",
    idx:0,
    time:""
}


// Mapping of data in object with key station name

data.map((each) => {
    var values = {
        "id": i,
        "line": each.details.line,
        "layout": each.details.layout,
        "longitude": each.details.longitude,
        "latitude": each.details.latitude,
        "connectedVertices": each.connectedVertices
    }

    stationsbyName[each.name.toLowerCase()] = values
    i++;
})

// Mapping of data in object with key station coordinates


data.map((each) => {
    var values = {
        "id": i,
        "name": each.name,
        "line": each.details.line,
        "layout": each.details.layout,
        "longitude": each.details.longitude,
        "latitude": each.details.latitude,
        "connectedVertices": each.connectedVertices
    }

    stationsbyCoor[each.details.latitude + "_" + each.details.longitude] = values
    i++;
})



// to return only unique values in an array
function uniqueArray3(a) {
    function onlyUnique(value, index, self) { 
        return self.indexOf(value) === index;
    }
  
    
    var unique = a.filter( onlyUnique ); 
  
    return unique;
  }



// Return the expected route between initial station and final station
axios.get('https://us-central1-delhimetroapi.cloudfunctions.net/route-get?from=Hauzkhas&to=Mandi House')
    .then((res) => {
        
        var i = 0;
        
        var lines = [] 

        var j = 1;

         

        while(true){
            

            if(res.data[`line${j}`] === undefined){
                break
            }
        for(var k = 0;k<res.data[`line${j}`].length;k++){
                lines.push(res.data[`line${j}`][k])
            }
            j++
        }
      
        lines = uniqueArray3(lines)
        console.log(lines)
        
            
           while(i<=lines.length-1){

            res.data.path.map((each)=>{
                
                if(each == res.data.interchange[i]){
                paths[each] = "interchange"
                pathsArray.push(lines[i])
                i++;
                }
                else{
                    paths[each] = lines[i]
                    pathsArray.push(lines[i])
                }
                

                
               
            })
            i++
           }

         
            })








// To check whether speed of metro follows trend or nor
// Trend : 0->increases -> reaches a max -> decrease -> 0

function trendChecker(array) {

    var flag = false;

    

    for (var i = 1; i < array.length; i++) {

        if (array[i - 1] > array[i + 1] && flag == false) {
            return false
        }
        else if (array[i - 1] <= array[i + 1] && flag == false) {
            flag = true
        }

    }

    return true;


}

var totalTimeElapsed = 0;

// to store the difference between expected time and arrival time
var timeDeviation = []


// Updation of Location of user

function updateLocation(currentLocation,result) {
    currentPosition.lat = currentLocation.latitude
    currentPosition.lon = currentLocation.longitude

    currentPosition.station = currentLocation.station
    currentPosition.idx = currentLocation.idx
    currentPosition.time = currentLocation.time
}


// Check for network and whether data is coming or not and calculating and checking whether user reaches expected point after passing through a area with network disturbance
async function Checker(currentLocation, accuracy, line,result) {
   

    
    if (networkflag === true && currentLocation && accuracy <0.3) {
        var noOfStationsPassed = (currentPosition.idx - currentLocation.idx);
        
        totalTimeElapsed = metroLineTimings[line] * noOfStationsPassed
        var currentTime = Date.parse(new Date())
        timeDeviation.push(currentTime - (currentPosition.time + totalTimeElapsed))
        networkflag = false
        updateLocation(currentLocation)

    }


    

    if (currentLocation && accuracy < 0.3) {
        updateLocation(currentLocation,result)
        networkflag = false
    }
    else {
        networkflag = true
    }




  
}












 
var currentStation = pathsArray[0] // currentstation of user and initialized with starting station
var currentLine = paths[pathsArray[0]] // currentline of user and initialized with intial metro line
var currentInterval = metroLineTimings[currentLine] //currentInterval between metro stations

function gps2(){
    readXlsxFile("./GPS-DATA.xlsx").then((rows)=>{
        

        var currentIndex= 0

        var ob = {}
        var i = 1000; 

        var speeds = [] // to store different speeds of metro between stations
        


        setInterval(()=>{
            
            speeds.push(rows[i][5])


            // retrieving data of current longitude and latitude
            axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${rows[i][3]},${rows[i][2]}.json?types=poi&access_token=pk.eyJ1IjoiZGFya3NpZGVyNTEiLCJhIjoiY2wwZHl6NXY4MGR2NzNjbXo5ZTBtZGE4eSJ9._xuts111DHQXPl5CflCMiQ`)
            .then((res)=>{
               
              allData[rows[i][3]+"_"+rows[i][2]] = res.data.features.text
                ob = res.data;
            })   


            

            setTimeout(()=>{

                const result = trendChecker(speeds) // Checking whether speed follows expected trend
                console.log(result)
                speeds = []

                currentIndex++

                currentStation = pathsArray[currentIndex]
                currentLine = paths[pathsArray[currentIndex]]
                currentInterval = metroLineTimings[currentIndex]
                

                // Passing expected station's longitude and latitude
                let options = {
                  
                    args: [stationsbyName[currentStation].latitude, stationsbyName[currentStation].longitude]
                  };
            
                // Running the script for boundary/polygon creation based on coordinates
                PythonShell.run('boundary.py', options, function (err, results) {
                    if (err) throw err;
                    console.log('results: %j', results);
                    

                    // passing polygon coordinates array
                    let options2 = {
                       
                        args: [rows[i][3], rows[i][2], results]
                      };
                      
                    // Verifying whether current points lie inside expected polygon surrounding metro station 
                      PythonShell.run('verify_point.py', options2,function (err, results2) {
                        if (err) throw err;
                        console.log('results: %j', results2);
                        locationCheckStatus.push(results2)


                        var newTime = Date.parse(new Date())

                        var CL ={
                            latitude:rows[i][3],
                            longitude:rows[i][2],
                            station: ob.features.text,
                            idx:currentIndex,
                            time:newTime

                           }

                           Checker(CL,0.3,currentLine,results2) // Checker function created on line 198.
                      });
                  });


                    
                currentIndex++
            },currentInterval)


           


            


            i++

        },1500)


        


    

    })
}

gps2()








 





module.exports = router