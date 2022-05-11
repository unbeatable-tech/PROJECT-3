const express=require('express')
const router=express.Router()

const User=require('../controller/userController')
const Book=require('../controller/bookController')
const auth=require('../middlewares/Auth')
router.post('/register',User.createUser)
router.post('/login',User.login)
router.post('/books',/*auth.auth,*/Book.createBook)
router.get('/books',auth.auth,Book.getBooks)




module.exports=router