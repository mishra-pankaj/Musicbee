const express = require("express")
const cookieParser = require("cookie-parser")
const connectDb = require("./db/db")
const {connectRedis} = require("./config/redis")
const authRoutes = require("./routes/auth.routes")
const musicRoutes = require("./routes/music.routes")

const app = express()
app.use(express.json())
app.use(cookieParser())
connectRedis()
connectDb()



app.use("/api/auth", authRoutes)
app.use("/api/music", musicRoutes)
module.exports = app