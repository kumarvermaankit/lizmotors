const router = require("express").Router()
const readXlsxFile = require('read-excel-file/node')
const axios = require('axios')


const { PythonShell } = require("python-shell")
const data = require("../metro-coordinates.json");// retrieving data from JSON file.

// 25 - 85
// 0 - 7

async function Main() {


    const allData = new Object(); // to store data at all coordinates

    var currentLine = ""



    var paths = new Object();  // to store expected shortest route, with corresponding lines , ex: Rithala:red
    var pathsArray = []       // for storing each metro stations name to access them with index

    var locationCheckStatus = new Object() // store whether user location matches corresponding expected metro station. ex: huda:true



    // Data of time between two consecutive metro station in minutes in each line

    const metroLineTimings = {
        blue: 2.02 + 0.9,
        bluebranch: 1.875 + 0.9,
        magenta: 2.36 + 0.9,
        yellow: 2.22 + 0.9,
        red: 2.03 + 0.9,
        green: 2.49 + 0.9,
        greenbranch: 1.33 + 0.9,
        violet: 2.24 + 0.9,
        pink: 2.69 + 0.9,
        pinkbranch: 2.43 + 0.9,
        orange: 5.2 + 0.9,//(Airpot Express Line)
        aqua: 2.86 + 0.9,
        grey: 2.10 + 0.9,
        rapidmetro: 5.2 + 0.9,
        interchange: 6 + 0.9
    }

    var stationsbyName = new Object(); // to store data of stations by name with their long & lat
    var stationsbyCoor = new Object(); // to store data of stations by name with their long & lat
    var networkflag = false

    // var i = 0;
    var currentPosition = {
        lat: "",
        lon: "",
        station: "",
        idx: 0,
        time: ""
    }


    // Mapping of data in object with key station name

    var stationID = 0

    data.map((each) => {
        var values = {
            "id": stationID,
            "line": each.details.line,
            "layout": each.details.layout,
            "longitude": each.details.longitude,
            "latitude": each.details.latitude,
            "connectedVertices": each.connectedVertices
        }

        stationsbyName[each.name.toLowerCase()] = values
        stationID++;
    })


    

    // Mapping of data in object with key station coordinates

    var coorID = 0;

    data.map((each) => {
        var values = {
            "id": coorID,
            "name": each.name,
            "line": each.details.line,
            "layout": each.details.layout,
            "longitude": each.details.longitude,
            "latitude": each.details.latitude,
            "connectedVertices": each.connectedVertices
        }

        stationsbyCoor[each.details.latitude + "_" + each.details.longitude] = values
        coorID++;
    })



    // to return only unique values in an array
    function uniqueArray3(a) {
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }


        var unique = a.filter(onlyUnique);

        return unique;
    }



    // Return the expected route between initial station and final station
    const res = await axios.get('https://us-central1-delhimetroapi.cloudfunctions.net/route-get?from=Botanical Garden&to=Shankar Vihar')
    if (res) {

        console.log(res)

        var i = 0;

        var lines = []

        var j = 1;



        while (true) {


            if (res.data[`line${j}`] === undefined) {
                break
            }
            for (var k = 0; k < res.data[`line${j}`].length; k++) {
                lines.push(res.data[`line${j}`][k])
            }
            j++
        }

        lines = uniqueArray3(lines)
        // console.log(lines)


        while (i <= lines.length - 1) {

            res.data.path.map((each) => {

                if (each == res.data.interchange[i]) {
                    paths[each] = "interchange"
                    pathsArray.push(each)
                    i++;
                }
                else {
                    paths[each] = lines[i]
                    pathsArray.push(each)
                }




            })
            i++
        }


    }





    // [0, 5, 12, 18, 25, 28, 23, 32, 35, 39, 41, 46, 48, 43, 52, 53, 57, 60, 62, 60, 63, 55, 53, 49, 44, 42, 38, 34, 36, 30, 28, 27, 23, 21, 19, 20, 17, 15, 14, 10, 11, 8, 5, 3, 2, 1, 0]


    // To check whether speed of metro follows trend or nor
    // Trend : 0->increases -> reaches a max -> decrease -> 0


    // function trendCheck2(array){
    //     var flag = false
    //     var expected = 0
    //     var errors = 0

    //     for(var i = 0;i<array.length;i++){

    //     }

    // }


    function trendCheck(array) {
        var flag = false;
        var expected = 0;
        var errors = 0;
        for (var i = 1; i < array.length; i++) {
            if (array[i] >= array[i - 1] && flag === false) {
                expected++
            }
            else if (array[i] < array[i - 1] && array[i] < array[i + 1] && flag == false) {
                errors++;
            }
            else if (array[i] <= array[i - 1] && flag == false) {
                expected++;
                flag = true;
            }
            else if (flag === true && array[i] <= array[i - 1]) {
                expected++;
            }
            else if (flag === true && array[i] > array[i - 1]) {
                errors++
            }


        }

        return [expected, errors]

    }

    console.log(trendCheck([0, 5, 12, 18, 25, 28, 23, 32, 35, 39, 41, 46, 48, 43, 52, 53, 57, 60, 62, 60, 63, 55, 53, 49, 44, 42, 38, 34, 36, 30, 28, 27, 23, 21, 19, 20, 17, 15, 14, 10, 11, 8, 5, 3, 2, 1, 0]))

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

    function updateLocation(currentLocation, result) {
        currentPosition.lat = currentLocation.latitude
        currentPosition.lon = currentLocation.longitude

        currentPosition.station = currentLocation.station
        currentPosition.idx = currentLocation.idx
        currentPosition.time = currentLocation.time
    }


    // Check for network and whether data is coming or not and calculating and checking whether user reaches expected point after passing through a area with network disturbance
    async function Checker(currentLocation, accuracy, line, result) {

        // munirka -> shankar vihar
            
        if (networkflag === true && currentLocation && accuracy < 0.3) {
            var noOfStationsPassed = (currentPosition.idx - currentLocation.idx);

            totalTimeElapsed = metroLineTimings[line] * noOfStationsPassed
            var currentTime = Date.parse(new Date())
//2:10

//2:04 + 6.02
//2:10:02
            timeDeviation.push(currentTime - (currentPosition.time + totalTimeElapsed))
            networkflag = false
            updateLocation(currentLocation)

        }

        if (currentLocation && accuracy < 0.3) {
            updateLocation(currentLocation, result)
            networkflag = false
        }
        else {
            networkflag = true
        }





    }












    //  console.log(pathsArray)
    var currentStation = pathsArray[0] // currentstation of user and initialized with starting station
    var currentLine = paths[pathsArray[0]] // currentline of user and initialized with intial metro line
    var currentInterval = metroLineTimings[currentLine] //currentInterval between metro stations
    console.log(paths)
    console.log(currentLine)

    function gps2() {
        var lastTime = Date.parse(new Date())
        readXlsxFile("report.xlsx").then((rows) => {

            console.log(currentInterval)

            var currentIndex = 0

            var ob = {}
            var i = 413;

            var speeds = [] // to store different speeds of metro between stations



            setInterval(() => {

                // console.log(rows[i])

                speeds.push(rows[i][5])


                // retrieving data of current longitude and latitude
                axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${rows[i][3]},${rows[i][2]}.json?types=poi&access_token=pk.eyJ1IjoiZGFya3NpZGVyNTEiLCJhIjoiY2wwZHl6NXY4MGR2NzNjbXo5ZTBtZGE4eSJ9._xuts111DHQXPl5CflCMiQ`)
                    .then((res) => {
                        console.log(res.data)
                        allData[rows[i][3] + "_" + rows[i][2]] = res.data.features.text
                        ob = res.data;
                    })



                var cTime = Date.parse(new Date())
                console.log(cTime - lastTime, currentInterval * 60000)
                
                if (cTime - lastTime >= currentInterval * 60000) {

                    const result = trendCheck(speeds) // Checking whether speed follows expected trend
                    console.log(result, "Speeds Result")
                    console.log(speeds)
                    speeds = []

                    currentIndex++

                    currentStation = pathsArray[currentIndex]
                    currentLine = paths[pathsArray[currentIndex]]
                    currentInterval = metroLineTimings[currentLine]
                    console.log(currentStation)
                    if (stationsbyName[currentStation] !== undefined) {



                        let options = {

                            args: [stationsbyName[currentStation].latitude, stationsbyName[currentStation].longitude]
                        };

                        // Running the script for boundary/polygon creation based on coordinates
                        PythonShell.run('boundary.py', options, function (err, results) {
                            if (err) throw err;
                            // console.log('results: %j', results);


                            // passing polygon coordinates array

                            let options2 = {

                                args: [rows[i][3], rows[i][2], results]
                            };

                            // Verifying whether current points lie inside expected polygon surrounding metro station 
                            PythonShell.run('verify_point.py', options2, function (err, results2) {
                                if (err) throw err;
                                console.log('results2: %j', results2);
                                // locationCheckStatus.push(results2)


                                var newTime = Date.parse(new Date())

                                var CL = {
                                    latitude: rows[i][3],
                                    longitude: rows[i][2],
                                    station: ob.features.text,
                                    idx: currentIndex,
                                    time: newTime

                                }

                                Checker(CL, 0.3, currentLine, results2) // Checker function created on line 198.
                            });
                        });

                    }
                    lastTime = cTime

                    currentIndex++
                }








                i++

            }, 5000)







        })
    }

    gps2()

}



Main()








module.exports = router


