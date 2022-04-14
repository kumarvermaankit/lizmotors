const io = require("./index").io
const MessageRoom = require("./models/messagerooms")
const addUser = require("./fncns").addUser
const getUsers = require("./fncns").getUsers
const removeuser = require("./fncns").removeuser
io.on("connection", (socket) => {
    console.log("connected", socket.id)

    socket.on("chat", (val) => {

        var u = addUser({ socketid: socket.id, room: val })
        console.log(val, "val")



        try {
            MessageRoom.findOne({ RoomName: val })
                .then((u) => {

                    if (!u) {
                        const newRoom = new MessageRoom({
                            RoomName: val,
                            messages: []
                        })
                        const room = newRoom.save()

                    }
                    else {
                        socket.emit("prevMessages", u.messages)
                    }
                })
        }
        catch (err) {
            console.log(err)
        }










        socket.on("remove", () => {
            console.log("remove")
            removeuser(socket.id)
        })

    })


    socket.on("message", (msg) => {

        var users = []

        try {

            MessageRoom.findOne({ RoomName: msg.roomName })
                .then((u) => {

                    u.messages.push(msg.msg)
                    u.save()
                    users = getUsers(msg.roomName)

                    users.map((e) => {
                        io.to(e.socketid).emit("prevMessage", u.messages)

                    })
                })
        }
        catch (err) {
            console.log(err)
        }

        // users=getUsers(val)

        // users.map((e)=>{
        //     io.to(e.socketid).emit("getmessage",msg)

        // })


    })


    socket.on("disconnect ", () => {
        console.log("disconnected")
        removeuser(socket.id)

    })

})


module.exports = io