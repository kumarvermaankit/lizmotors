const router = require("express").Router()
const bcrypt = require("bcrypt")
const User = require("../models/User")

router.post("/register", async (req, res, next) => {

    try {

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        User.findOne({ username: req.body.username })
            .then((u) => {
                if (!u) {


                    const Usr = new User({
                        username: req.body.username,
                        email: req.body.email,
                        password: hashedPassword,
                        lang: null,
                        lat: null,
                        profile: null
                    });

                    const user = Usr.save()
                    res.status(200).json("success")

                }
                else {
                    res.status(200).json("User already Exists")
                }
            })



    }
    catch (err) {
        res.status(500).json(err)
    }
})


router.post("/login", async (req, res, next) => {
    try {

        const user = await User.findOne({ username: req.body.username })


        !user && res.status(400).json("Wrong username or password")

        const validPassword = await bcrypt.compareSync(req.body.password, user.password)
        !validPassword && res.status(400).json("Wrong username or password")
        res.status(200).json(user._id)
    }
    catch (err) {
        res.status(500).json(err)
    }
})


router.post("/location", async (req, res, next) => {

    try {
        const user = await User.findOne({ username: req.body.username })

        user.lang = req.body.lang
        user.lat = req.body.lat

        user.save()
        res.status(200).json(user)
    }
    catch (err) {
        res.status(200).json(err)
    }





})


router.get("/userpins", async (req, res, next) => {
    try {
        const r = await User.find()

        res.status(200).json(r)
    }
    catch (err) {

    }
})

router.post("/change", async (req, res, next) => {

    console.log(req.body)
    try {

        const user = await User.findOne({ username: req.body.username })

        user[req.body.var] = req.body.c
        user.save()

        res.send(true)


    }
    catch (err) {
        res.send(err)
    }
})



module.exports = router