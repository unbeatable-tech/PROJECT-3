const express=require('express')
const router=express.Router()
const User=require('../controller/userController')
const {createBook, getBooks, deleteBook} = require('../controller/bookController')
const auth1 = require('../middlewares/Auth')

router.post('/register',User.createUser)
router.post('/login',User.userLogin)

router.post('/books',auth1.auth,createBook)

router.get('/books',auth1.auth,getBooks)

router.delete('/books/:bookId',auth1.auth, deleteBook)



module.exports=router