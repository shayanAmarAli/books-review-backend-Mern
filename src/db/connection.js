require("dotenv").config() // load .env variables
const mongoose = require("mongoose") //import fresh mongoose object
const {log} = require("mercedlogger") // import merced logger

//DESTRUCTURE ENV VARIABLES
const {DATABASE_URL} = process.env 

// CONNECT TO MONGO
mongoose.connect = mongoose.connect(
    "mongodb+srv://shayanamaralie:numKVwqqm9wj4YaP@cluster0.dnfxx9v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
     )

// CONNECTION EVENTS
mongoose.connection
.on("open", () => log.green("DATABASE STATE OPEN", "Connection Open"))
.on("close", () => log.magenta("DATABASE STATE CLOSE", "Connection Open"))
.on("error", (error) => log.red("DATABASE STATE ERROR", error))

// EXPORT CONNECTION
module.exports = mongoose