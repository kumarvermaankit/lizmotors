
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








function VerifyPoint(longitude,latitude,polygon){
    let options = {
        // mode: 'text',
        // pythonPath: 'path/to/python',
        // pythonOptions: ['-u'], // get print results in real-time
        // scriptPath: 'E:/pyshell',
        args: [latitude, longitude, polygon]
      };
      
      PythonShell.run('verify_point.py', options,function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
        
      });


   
}


var coorArray = []

function CreateBoundary(longitude,latitude){

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
       coorArray = results
      });

    return coorArray
    
}




 //   currentPosition.lat = currentLocation.latitude
// currentPosition.lon = currentLocation.longitude
// currentPosition.station = currentLocation.station
// currentPosition.idx = currentLocation.idx
// currentPosition.time = currentLocation.time


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


if (Number(rows[i][5].substring(0, 3)) >= 0 && Number(rows[i][5].substring(0, 3)) <= 1.5) {
    const result = trendChecker(speeds)
    console.log(result)
    speeds = []
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

