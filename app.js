const express = require("express")
// const session = require('express-session');
// const RedisStore = require('connect-redis')(session);
// const Redis = require('ioredis');
const app = express()
const cors = require("cors")
const DbConnection = require("./config/database")
app.use(express.json())
app.use(cors())
const userAuthentication = require("./routes/userRoutes")
const port = 3026 || process.env.PORT 

app.use("/api",userAuthentication)

// const redisClient = new Redis({
//     host:process.env.HOST_NAME,
//     port:process.env.REDIS_PORT
// })

// app.use(
//     session({
//         store:new RedisStore({client:redisClient}),
//         secret:process.env.REDIS_SECRET_KEY,
//         resave:false,
//         saveUninitialized:false,
//         cookie:{
//             secure:false,
//             httpOnly:true,
//             maxAge:10*60*1000 //10min
//         }

//     })
// )

app.listen(port,(async() => {
    await DbConnection()
    console.log(`Server Running at :http://localhost:${port}/`)
}))
