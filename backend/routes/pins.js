const router = require("express").Router()

const Pin = require("../models/pin")

const EPin = require("../models/emergencypin")
const EvtPin = require("../models/eventpin")

router.post("/:type", async (req, res, next) => {
    console.log(req.params)
    console.log(req.body)
    var newPin;
    if (req.params.type === "travel") {
        newPin = new Pin(req.body)
    }
    else if (req.params.type === "emergency") {
        newPin = new EPin(req.body)
    }
    else if (req.params.type === "event") {
        newPin = new EvtPin(req.body)
    }
    try {
        const savedPin = await newPin.save()
        res.status(200).json(savedPin)
    }
    catch (err) {
        res.status(500).json(err)
    }

})

router.get("/", async (req, res, next) => {
    const pinsarr = []
    console.log("sksh")

    try {
        const pins = await Pin.find()
        pinsarr.push(pins)
    }
    catch (err) {
        res.status(500).json(err)
    }
    try {
        const pins = await EvtPin.find()
        pinsarr.push(pins)
    }
    catch (err) {
        res.status(500).json(err)
    }
    try {
        const pins = await EPin.find()
        pinsarr.push(pins)
    }
    catch (err) {
        res.status(500).json(err)
    }
    res.status(200).json(pinsarr)
})


module.exports = router