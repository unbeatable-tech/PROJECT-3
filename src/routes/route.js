const express=require('express')
const router=express.Router()

const User=require('../controller/userController')
router.post('/register',User.createUser)
router.post('/login',User.login)




module.exports=router