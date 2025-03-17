const { default: mongoose, model } = require("mongoose")
require("dotenv").config()

const uri = process.env.MONGO_URI
// console.log("Uri:",uri)
const DbConnection = async() => {
    try {
        await mongoose.connect(uri)
        console.log("DB Connected Successfully!")
    } catch (error) {
        console.log(`DB Error: ${error.message}`)
    }
}

module.exports = DbConnection