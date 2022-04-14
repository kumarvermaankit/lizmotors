const router = require("express").Router()
const readXlsxFile = require('read-excel-file/node')

router.get("/", (req, res, next) => {


    // Reading excel file
    readXlsxFile("./GPS-DATA.xlsx").then((rows) => {

        // `rows` is an array of rows
        // each row being an array of cells.

        //Sending rows to client server
        res.status(200).json(rows)

    })

})

module.exports = router