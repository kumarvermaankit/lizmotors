const app=require("./index").app
const pin=require("./routes/pins");
const user=require("./routes/users")


app.use("/api/pins",pin)
app.use("/api/log",user)

module.exports=app