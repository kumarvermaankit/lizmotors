const express = require("express")
const app = express()
const cors = require("cors")

const port = process.env.PORT || 5000

const router = require("./routes")

// Allowing Cross origin request
app.use(cors())


app.use("/api", router)



// Listening the port
app.listen(port, () => {
    console.log("Server is running on Port", port)
})