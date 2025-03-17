const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const DbConnection = require("../config/database");
const UserModel = require("../models/userModel");
const crypto =require("crypto")
const nodemailer = require("nodemailer");
const { response } = require("express");

//User Register

const registerUser = async(req,res) => {
    try{
        const {username,password,email,mobile} = req.body;    
        const hashedPassword = await bcrypt.hash(password,10)
        
        // console.log(hashedPassword)

        const user = {
            username:username,
            password:hashedPassword,
            email:email,
            mobile:mobile
        }
        
        console.log("User:",user)
        await DbConnection();
        
        const existingUser = await UserModel.findOne({$or:[{ username: username },{email:email}]});
        // console.log("existingUser:",existingUser)
        if (existingUser) {
            return res.status(200).json({
                message: "User already exists",
                success:false
            });
        }
        await UserModel.create(user)
        .then(() => {
        res.status(200).json({
          message: "Registration successful",
          success:true
        });
      })

      .catch((error) => {
        res.status(200).json({
          message: "Something went wrong",
          success:false
        });
        console.log(error)
      });

    }catch (error) {
        res.status(200).json({
            message: "Something went wrong",
            success:false
        });
    }
};

///User Login

const loginUser = async(req,res) => {
    const {email,password} = req.body;  
    console.log("userDetails:",email,password)
    // const mySecretKey = process.env.MY_SECRET_KEY;
    // console.log("mySecretKey:",mySecretKey)
    const user = await UserModel.findOne({email:email})
    // console.log("User:",user)

    if(!user){
        return res.status(200).json({
            message:"Invalid Email address"
        })
        }
    const verifyPassword = await bcrypt.compare(password,user.password)
    if(verifyPassword){
        const payload = {
            email:email
        }
        const jwtToken = jwt.sign(payload,process.env.MY_SECRET_KEY);
        res.status(200).send({"jwtToken":jwtToken,success:true})
    }else{
        res.status(200).send({message:"Invalid password",success:false})
        }
    }


//All users

const getAllUsers = async(req,res) => {
    const allUsers = await UserModel.find()
    res.status(200).json({users:allUsers})
}

//Reset Password

const requestEmailResetPassword = async(req,res) => {
    const {email} =req.body;
    console.log("Email:",email)
    const checkEmail = await UserModel.findOne({email:email})
    console.log("checkEmail:",checkEmail)
    if(!checkEmail){
        return res.status(200).json({message:"Invalid Email Address",success:false})
    }
    const token = crypto.randomBytes(32).toString('hex');
    console.log("Token:",token)
    const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
                user: "7f0a49001@smtp-brevo.com",
                pass: "4UgzQG823ZIJFfps",
            },
        });
    const content = `Click here to <a href="http://localhost:3004/reset-password/${token}">Reset Password</a>`
    const resetLink = {
        from: '"Maddison Foo Koch 👻" <nagesh4a2@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "reset link", // Subject line
        text: "new password", // plain text body
        html: content // html body
    }
    const info = await transporter.sendMail(resetLink)
    console.log("Message sent: %s", info.messageId);
    const response = await UserModel.findOneAndUpdate({email:email},{verifyToken:token})
    console.log("update Response:",response)
}

//reset Password 

const resetPasswordController = async(req,res) => {
    const {newPassword} = req.body;
    const {id} = req.params;
    await DbConnection()
    try {
        await UserModel.findOneAndUpdate({verifyToken:id},{password:newPassword})
        res.status(200).json({message:"Password Updated Successfully",success:true})

    } catch (error) {
        res.status(200).json({message:"Invalid Token",success:false})
    }
   
}


module.exports = {registerUser,loginUser,getAllUsers,requestEmailResetPassword,resetPasswordController};
