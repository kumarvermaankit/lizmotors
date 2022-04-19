const router = require("express").Router()
const readXlsxFile = require('read-excel-file/node')
// const fetch = require('node-fetch')
const axios = require('axios')

const data = require("./metro.json");

const {PythonShell} = require("python-shell")

// import {PythonShell} from 'python-shell';
const allData = new Object();

var currentLine = ""
// 15-21
// minutes between each metro

function VerifyPoint(){
    let options = {
        // mode: 'text',
        // pythonPath: 'path/to/python',
        // pythonOptions: ['-u'], // get print results in real-time
        // scriptPath: 'E:/pyshell',
        // args: ['value1', 'value2', 'value3']
      };
      
      PythonShell.run('verify_point.py', options,function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
      });


   
}

function CreateBoundary(longitude,latitude){

    var coorArray = [] 

    let options = {
        // mode: 'text',
        // pythonPath: 'path/to/python',
        // pythonOptions: ['-u'], // get print results in real-time
        // scriptPath: 'E:/pyshell',
        args: [latitude, longitude]
      };

    PythonShell.run('boundary.py', options,async function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
        coorArray = await results
      });

      return coorArray

}

VerifyPoint()
const T = CreateBoundary("sjkja","jbhb")
console.log(T)


var paths = new Object();
var pathsArray = []

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
}

var stationsbyName = new Object();
var stationsbyCoor = new Object();
var networkflag = false

var i = 0;
var currentPosition = {
    lat: "",
    lon: ""
}


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

// console.log(hash)



 
axios.get('https://us-central1-delhimetroapi.cloudfunctions.net/route-get?from=Munirka&to=Mandi House')
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





//moving average


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
var timeDeviation = []


function updateLocation(currentLocation) {
    currentPosition.lat = currentLocation.latitude
    currentPosition.lon = currentLocation.longitude
    currentPosition.station = currentLocation.station
    currentPosition.idx = currentLocation.idx
    currentPosition.time = currentLocation.time
}

async function Checker(currentLocation, accuracy, idx, line) {
    // retrieving data

    //
    if (networkflag === true && currentLocation && accuracy <0.3) {
        var noOfStationsPassed = (currentPosition.idx - idx);
        
        totalTimeElapsed = metroLineTimings[line] * noOfStationsPassed
        var currentTime = Date.parse(new Date())
        timeDeviation.push(currentTime - currentPosition.time)
        networkflag = false
        updateLocation(currentLocation)

    }


    //



    // 0 ->1,2 3,4,5 6,7  8

    if (currentLocation && accuracy < 0.3) {
        updateLocation(currentLocation)
        networkflag = false
    }
    else {
        networkflag = true
    }




    //else

    // whether data is coming or not, if not then
}




// [0, 23, 45, 67, 30, 67, 34, 22, 10, 0]

var idx = 0





// [
//     true,
//     '2022-02-14 20:43:13',
//     28.542204,
//     77.229028,
//     227.7620735168457,
//     '0.0 km/h',
//     '28.542204°, 77.229028°',
//     'batteryLevel=100.0  distance=24.8  totalDistance=24322.03  motion=false'
//   ],
 
var currentStation = pathsArray[0]
var currentLine = paths[pathsArray[0]]
var currentInterval = metroLineTimings[currentLine]

function gps2(){
    readXlsxFile("./GPS-DATA.xlsx").then((rows)=>{
        

        var currentIndex= 0

        var ob = {}
        var i = 1000;

        var speeds = []
        


        setInterval(()=>{
            
            speeds.push(rows[i][5])

            axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${rows[i][3]},${rows[i][2]}.json?types=poi&access_token=pk.eyJ1IjoiZGFya3NpZGVyNTEiLCJhIjoiY2wwZHl6NXY4MGR2NzNjbXo5ZTBtZGE4eSJ9._xuts111DHQXPl5CflCMiQ`)
            .then((res)=>{
                // console.log(res.data)
              allData[rows[i][3]+"_"+rows[i][2]] = res.data.features.text
                ob = res.data;
            })   


            if (Number(rows[i][5].substring(0, 3)) >= 0 && Number(rows[i][5].substring(0, 3)) <= 1.5) {
                const result = trendChecker(speeds)
                console.log(result)
                speeds = []
            }
//   currentPosition.lat = currentLocation.latitude
// currentPosition.lon = currentLocation.longitude
// currentPosition.station = currentLocation.station
// currentPosition.idx = currentLocation.idx
// currentPosition.time = currentLocation.time

            setTimeout(()=>{

                currentPosition++

                currentStation = pathsArray[currentIndex]
                currentLine = paths[pathsArray[currentIndex]]
                currentInterval = metroLineTimings[currentIndex]
                
                CreateBoundary(stationsbyName[currentStation].longitude,stationsbyName[currentStation].latitude)

                var cL = {
                lat : rows[i][3],
                lon : rows[i][2],
                // station : res.data.features.text,
                // idx : pathsArray.indexOf(res.data.features.text),
                

                }
            },currentInterval)


            i++

        },1500)


        


    

    })
}

gps2()


function gps() {
    readXlsxFile("./GPS-DATA.xlsx").then((rows) => {
        // `rows` is an array of rows
        // each row being an array of cells.

        //Sending rows to client server
        // res.status(200).json(rows)

        var speeds = [];
        

        var i = 1000;

        
        var CheckTimer = 0;
        setInterval(() => {

            // console.log(rows[i])
            speeds.push(rows[i][5])
            var ob = {
                lat: rows[i][2],
                lon: rows[i][3],

            }
           

            

            var result = {}

            axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${rows[i][3]},${rows[i][2]}.json?types=poi&access_token=pk.eyJ1IjoiZGFya3NpZGVyNTEiLCJhIjoiY2wwZHl6NXY4MGR2NzNjbXo5ZTBtZGE4eSJ9._xuts111DHQXPl5CflCMiQ`)
            .then((res)=>{
                console.log(res.data.features.text)
              allData[rows[i][3]+"_"+rows[i][2]] = res.data.features.text
                result = res.data;
            })    

            
            
            if (Number(rows[i][5].substring(0, 3)) >= 0 && Number(rows[i][5].substring(0, 3)) <= 1.5) {
                const result = trendChecker(speeds)
                console.log(speeds)
                console.log(result)
                speeds = []
            }
//
            if(CheckTimer % 8 === 0){
                ob["station"] = res.data.features.text
                ob["time"] = Date.parse(new Date())
                Checker(ob,1,idx)
            }

            i++;
            CheckTimer++;
        }, 1500)
  

    })
}

// gps()


// gps()

// router.get("/", (req, res, next) => {

//     // Reading excel file
//     readXlsxFile("./GPS-DATA.xlsx").then((rows) => {
//         // `rows` is an array of rows
//         // each row being an array of cells.

//         //Sending rows to client server
//         res.status(200).json(rows)

//         var speeds = [];
//         var currentspeed = 0;

//         console.log(rows)

//     })



// })


//Magenta Line




function uniqueArray3(a) {
    function onlyUnique(value, index, self) { 
        return self.indexOf(value) === index;
    }
  
    // usage
    var unique = a.filter( onlyUnique ); // returns ['a', 1, 2, '1']
  
    return unique;
  }


 





module.exports = router