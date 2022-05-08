const readXlsxFile = require('read-excel-file/node')

// var array = [
//     SHAHEED STHAL ( NEW BUS ADDA)
//     HINDON RIVER
//     ARTHALA
//     MOHAN NAGAR
//     SHYAM PARK
//     MAJOR MOHIT SHARMA RAJENDRA NAGAR
//     RAJ BAGH
//     SHAHEED NAGAR
//     DILSHAD GARDEN
//     JHILMIL
//     MANSAROVAR PARK
//     SHAHDARA
//     WELCOME
//     SEELAMPUR
//     SHASTRI PARK
//     KASHMERE GATE
//     TIS HAZARI
//     PULBANGASH
//     PRATAP NAGAR
//     SHASTRI NAGAR
//     INDER LOK
//     KANHAIYA NAGAR
//     KESHAVPURAM
//     NETAJI SUBHASH PLACE
//     KOHAT ENCLAVE
//     PITAMPURA
//     ROHINI (EAST)
//     ROHINI (WEST)
//     RITHALA]

var array = []

readXlsxFile("./Orange.xlsx").then((rows) => {

// array.push(rows[1])
console.log(rows)

for(var r = 6;r<rows.length;r++){
    var a = rows[r][7].split(',')

    var o = {
        "name": rows[r][1],
        "details": {
            "line": ["Orange"],
            "layout": rows[r][4],
            "longitude": parseFloat(a[0]),
            "latitude": parseFloat(a[1])
        }
    }
    array.push(o)
}

  console.log(JSON.stringify(array))
})

// console.log(array)