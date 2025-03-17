const express = require("express")
const router = express.Router()
const {registerUser,loginUser,getAllUsers,requestEmailResetPassword,resetPasswordController} = require("../controller/userController")
const userAuthentication = require("../middleware/authentication")

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/users",userAuthentication,getAllUsers)
router.post("/reset",requestEmailResetPassword)
router.post("/reset-password/:id",resetPasswordController)

module.exports = router;