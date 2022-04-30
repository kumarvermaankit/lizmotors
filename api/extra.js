
const axios = require('axios')

const readXlsxFile = require('read-excel-file/node')

// function gps() {
//     readXlsxFile("./GPS-DATA.xlsx").then((rows) => {
//         // `rows` is an array of rows
//         // each row being an array of cells.

//         //Sending rows to client server
//         // res.status(200).json(rows)

//         var speeds = [];


//         var i = 1000;


//         var CheckTimer = 0;
//         setInterval(() => {

//             // console.log(rows[i])
//             speeds.push(rows[i][5])
//             var ob = {
//                 lat: rows[i][2],
//                 lon: rows[i][3],

//             }




//             var result = {}

//             axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${rows[i][3]},${rows[i][2]}.json?types=poi&access_token=pk.eyJ1IjoiZGFya3NpZGVyNTEiLCJhIjoiY2wwZHl6NXY4MGR2NzNjbXo5ZTBtZGE4eSJ9._xuts111DHQXPl5CflCMiQ`)
//             .then((res)=>{
//                 console.log(res.data.features.text)
//               allData[rows[i][3]+"_"+rows[i][2]] = res.data.features.text
//                 result = res.data;
//             })    



//             if (Number(rows[i][5].substring(0, 3)) >= 0 && Number(rows[i][5].substring(0, 3)) <= 1.5) {
//                 const result = trendChecker(speeds)
//                 console.log(speeds)
//                 console.log(result)
//                 speeds = []
//             }
// //
//             if(CheckTimer % 8 === 0){
//                 ob["station"] = res.data.features.text
//                 ob["time"] = Date.parse(new Date())
//                 Checker(ob,1,idx)
//             }

//             i++;
//             CheckTimer++;
//         }, 1500)


//     })
// }








// function VerifyPoint(longitude,latitude,polygon){
//     let options = {
//         // mode: 'text',
//         // pythonPath: 'path/to/python',
//         // pythonOptions: ['-u'], // get print results in real-time
//         // scriptPath: 'E:/pyshell',
//         args: [latitude, longitude, polygon]
//       };

//       PythonShell.run('verify_point.py', options,function (err, results) {
//         if (err) throw err;
//         // results is an array consisting of messages collected during execution
//         console.log('results: %j', results);

//       });



// }


// var coorArray = []

// function CreateBoundary(longitude,latitude){

//     let options = {
//         // mode: 'text',
//         // pythonPath: 'path/to/python',
//         // pythonOptions: ['-u'], // get print results in real-time
//         // scriptPath: 'E:/pyshell',
//         args: [latitude, longitude]
//       };

//     PythonShell.run('boundary.py', options,async function (err, results) {
//         if (err) throw err;
//         // results is an array consisting of messages collected during execution
//         console.log('results: %j', results);
//        coorArray = results
//       });

//     return coorArray

// }




//  //   currentPosition.lat = currentLocation.latitude
// // currentPosition.lon = currentLocation.longitude
// // currentPosition.station = currentLocation.station
// // currentPosition.idx = currentLocation.idx
// // currentPosition.time = currentLocation.time


// // [
// //     true,
// //     '2022-02-14 20:43:13',
// //     28.542204,
// //     77.229028,
// //     227.7620735168457,
// //     '0.0 km/h',
// //     '28.542204°, 77.229028°',
// //     'batteryLevel=100.0  distance=24.8  totalDistance=24322.03  motion=false'
// //   ],


// if (Number(rows[i][5].substring(0, 3)) >= 0 && Number(rows[i][5].substring(0, 3)) <= 1.5) {
//     const result = trendChecker(speeds)
//     console.log(result)
//     speeds = []
// }


// // gps()


// // gps()

// // router.get("/", (req, res, next) => {

// //     // Reading excel file
// //     readXlsxFile("./GPS-DATA.xlsx").then((rows) => {
// //         // `rows` is an array of rows
// //         // each row being an array of cells.

// //         //Sending rows to client server
// //         res.status(200).json(rows)

// //         var speeds = [];
// //         var currentspeed = 0;

// //         console.log(rows)

// //     })



// // })


// //Magenta Line



// axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/Janakpuri West Metro Staion,New Delhi.json?types=poi&access_token=pk.eyJ1IjoiZGFya3NpZGVyNTEiLCJhIjoiY2wwZHl6NXY4MGR2NzNjbXo5ZTBtZGE4eSJ9._xuts111DHQXPl5CflCMiQ`)
//     .then((res) => {
//         console.log(res.data.features)

//     })

// axios.get("https://nominatim.openstreetmap.org/search?q=Munirka+Metro+Station,New+Delhi&format=xml&polygon_geojson=1&addressdetails=1")
//     .then((res) => {
//         console.log(res)
//     })
// 6b98bbdb5fe0804b6d37cbdd929fcc6e

const ar = [
    [28.6297834612038, 77.0776940796179],
    [28.6159564861556, 77.0851987905795],
    [28.6024673324942, 77.0826940403147],
    [28.5899197905856, 77.082994447627],
    [28.5777751058903, 77.1113060419964],
    [28.5656541796848, 77.1224616476836],
    [28.5608811110548, 77.140341237451],
    [28.557925961712, 77.1609827694922],
    [28.5580423572399, 77.174046892439],
    [28.5503114738711, 77.1852115824157],
    [28.5471937628216, 77.1938027232322],
    [28.5434774222149, 77.2053582322162],
    [28.5423484614174, 77.2204900311667],
    [28.5412425337959, 77.2293798189428],
    [28.5418624769814, 77.2382024764913],
    [28.5458880083749, 77.2511576999558],
    [28.5503080443963, 77.2565918554361],
    [28.55479188199, 77.2648317676421],
    [28.5595514879644, 77.2747188135864],
    [28.5630027634972, 77.2863170790844],
    [28.5615276353709, 77.2920845226246],
    [28.5459748080479, 77.2964764987725],
    [28.542912703242, 77.3101028762629],
    [28.5532678268239, 77.3230637795121],
    [28.5640950792416, 77.3357711688027],

]

var name = [
    "Janakpuri West",
    "Dabri Mor",
    "Dashrathpuri",
    "Palam",
    "Sadar Bazar Cantonment",
    "IGI Airport Terminal 1",
    "Shankar Vihar",
    "Vasant Vihar",
    "Munirka",
    "RK Puram",
    "IIT Delhi",
    "Hauz Khas ",
    "Panchsheel Park",
    "Chirag Delhi",
    "Greater Kailash",
    "Nehru Enclave",
    " Kalkaji Mandir",
    "Okhla NSIC",
    "Sukhdev Vihar",
    "Jamia Millia Islamia",
    "Okhla Vihar",
    "Jasola Vihar",
    "Kalindi Kunj",
    "Okhla Bird Sanctuary",
    "Botanical Garden"
]

var ob = new Object();

// {
//     "name": "Dwarka Sector 14",
//         "details": {
//         "line": [
//             "Blue Line"
//         ],
//             "layout": "Elevated",
//                 "longitude": 77.02588,
//                     "latitude": 28.60223
//     }

// var a = []
// for (var i = 0; i < ar.length; i++) {
//     var o = {
//         name: name[i],
//         details: {
//             line: ["Magenta Line"],
//             layout: "Underground",
//             longitude: ar[i][1],
//             latitude: ar[i][0]
//         }
//     }
//     a.push(o);
// }


// readXlsxFile("report.xlsx").then((rows) => {}





// const options = {
//     method: 'GET',
//     url: 'https://trueway-geocoding.p.rapidapi.com/ReverseGeocode',
//     params: { location: '28.6024673324942,77.0826940403147', language: 'en' },
//     headers: {
//         'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com',
//         'X-RapidAPI-Key': '3288ed22fcmsh0a533a154a15741p1c7f7fjsnb3d92524bf5f'
//     }
// };

// axios.request(options).then(function (response) {
//     console.log(response.data);
// }).catch(function (error) {
//     console.error(error);
// });

var speeds = []
var i = 0;
readXlsxFile("report.xlsx").then((rows) => {

    setInterval(() => {
        console.log(i)
        speeds.push(rows[i][5])
        console.log(speeds)
        i++;
    }, 100)


})

console.log(speeds)
