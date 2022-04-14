const router = require("express").Router()
const readXlsxFile = require('read-excel-file/node')
// const fetch = require('node-fetch')
const axios = require('axios')

const data = require("./metro.json");


// 15-21
// minutes between each metro
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
    if (networkflag === true && currentLocation && accuracy > 1.5) {
        var noOfStationsPassed = (currentPosition.idx - idx);
        totalTimeElapsed = metroLineTimings[line] * noOfStationsPassed
        var currentTime = Date.parse(new Date())
        timeDeviation.push(currentTime - currentPosition.time)
        networkflag = false
        updateLocation(currentLocation)

    }


    //



    // 0 ->1,2 3,4,5 6,7  8

    if (currentLocation && accuracy > 1.5) {
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

function gps() {
    readXlsxFile("./GPS-DATA.xlsx").then((rows) => {
        // `rows` is an array of rows
        // each row being an array of cells.

        //Sending rows to client server
        // res.status(200).json(rows)

        var speeds = [];
        var currentspeed = 0;

        var i = 1000;

        setInterval(() => {

            console.log(rows[i])
            speeds.push(rows[i][5])
            var ob = {
                lat: rows[i][2],
                lon: rows[i][3],

            }

            var location = stationsbyCoor[rows[i]]
            Checker()
            if (Number(rows[i][5].substring(0, 3)) >= 0 && Number(rows[i][5].substring(0, 3)) <= 1.5) {
                const result = trendChecker(speeds)
                console.log(speeds)
                console.log(result)
                speeds = []
            }
            i++;

        }, 500)


        // rows.map((each) => {
        //     if (i > 7) {
        //         speeds.push(each[6])
        //     }
        //     // if (Number(each[6].substring(0, 3)) === 0) {
        //     //     const result = trendChecker(speed)
        //     //     speeds = []
        //     // }
        //     i++
        // })

        // console.log(rows[23][5])

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


// avg time between stations = 2 mins 


axios.get('https://us-central1-delhimetroapi.cloudfunctions.net/route-get?from=Munirka&to=Rithala')
    .then((res) => {
        // console.log(res.data)

    })

axios.get("https://api.opencagedata.com/geocode/v1/json?key=68db69f371984d308ea6a293856dcb5c&q=28.71642%2C77.17046&pretty=1")
    .then((res) => {
        console.log(res.data.results)
    })
// api key 
//6b98bbdb5fe0804b6d37cbdd929fcc6e






module.exports = router