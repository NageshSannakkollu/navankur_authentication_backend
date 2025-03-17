const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        require:true
    },
    email:{
        type:String,
        unique:true,
        require:true
    },
     password:{
        type:String,
        require:true
    },
    mobile:{
        type:Number,
        require:true 
    },
    verifyToken:{
        type:String,
    }
},{timestamps:true})

const UserModel = mongoose.models.user || mongoose.model("user",UserSchema)
module.exports = UserModel;