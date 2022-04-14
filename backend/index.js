const express = require("express")
const mongoose = require("mongoose")
const app = express()
const cors = require("cors")
const socket = require("socket.io")
const port = process.env.PORT || 5000
const helmet = require("helmet")
const Server = app.listen(port)

require("dotenv").config()

app.use(cors())
app.use(helmet())

app.use(express.json())

const io = socket(Server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
try {
    connection.once('open', () => {
        console.log("MongoDB database connection established successfully");
    })
}
catch (err) {
    console.log(err);
}


console.log("connected", port)

module.exports = {
    app,
    io

}