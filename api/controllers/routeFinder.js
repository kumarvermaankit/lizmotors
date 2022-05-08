const router = require("express").Router()
const axios = require('axios')
const data = require("../metro-coordinates.json");// retrieving data from JSON file.


var paths = new Object(); 
var pathsArray = [];

var stationsbyName = new Object();
var allStations = []
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
        allStations.push(each.name)
        stationID++;
    })
 

router.get("/stations",async(req,res,next)=>{
    res.send(allStations)
})    
    
    

router.get("/:from/:to",async (req,res,next)=>{
    var from = req.params.from;
    var to = req.params.to;

    const result = await axios.get(`https://us-central1-delhimetroapi.cloudfunctions.net/route-get?from=${from}&to=${to}`)

    if (result) {

        console.log(result)

        var i = 0;

        var lines = []

        var j = 1;

        for(var k = 0;k<result.data.path.length;k++){
            var each = result.data.path[k]
            console.log(each)
            if(each === "esi hospital"){
                each = "esi-basaidarapur"
            }
            paths[each] = stationsbyName[each]
            pathsArray.push(each)
        }


        // while (true) {
            // 28.693923472849235, 77.15313047609686

        //     if (result.data[`line${j}`] === undefined) {
        //         break
        //     }
        //     for (var k = 0; k < result.data[`line${j}`].length; k++) {
        //         lines.push(result.data[`line${j}`][k])
        //     }
        //     j++
        // }

        // lines = uniqueArray3(lines)
        // console.log(lines)


        // while (i <= lines.length - 1) {

        //     result.data.path.map((each) => {

        //         if (each == result.data.interchange[i]) {
        //             paths[each] = stationsbyName[each]
        //             pathsArray.push(each)
        //             i++;
        //         }
        //         else {
        //             paths[each] = stationsbyName[each]
        //             pathsArray.push(each)
        //         }




        //     })
        //     i++
        // }

// console.log(paths)


    }

    // for()
    console.log(paths)
    res.send(paths)

})

    function uniqueArray3(a) {
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }


        var unique = a.filter(onlyUnique);

        return unique;
    }

module.exports = router