var activeusers = []

function addUser(user) {
    const u = activeusers.find((u) => u.room === user.room && u.socketid === user.socketid)

    if (!u || u === undefined) {
        activeusers.push(user)

    }
    return activeusers
}

function getUsers(room) {
    console.log(room)
    const u = []
    activeusers.map((e) => {
        if (e.room === room) {
            u.push(e)
        }
    })
    return u


}

function removeuser(socketid) {
    const u = activeusers.find((u) => u.socketid === socketid)
    const i = activeusers.indexOf(u)
    activeusers.splice(i, 1)
}


module.exports = {
    addUser,
    getUsers,
    removeuser
}

