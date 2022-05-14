const express=require('express')
const router=express.Router()
const User=require('../controller/userController')
const {createBook, getBooks, deleteBook, updateBook, getbookbyId} = require('../controller/bookController')
const auth1 = require('../middlewares/Auth')
const Review=require('../controller/reviewController')

//API's for User
router.post('/register',User.createUser)
router.post('/login',User.userLogin)

//Books related API's
router.post('/books',auth1.auth,createBook)
router.get('/books',auth1.auth,getBooks)
router.get('/books/:bookId',auth1.auth, getbookbyId)
router.put('/books/:bookId', auth1.auth, updateBook)
router.delete('/books/:bookId',auth1.auth, deleteBook)

// review api

router.post('/books/:bookId/review',Review.reviewData)
router.put('/books/:bookId/review/:reviewId',Review.updateReview)
router.delete('/books/:bookId/review/:reviewId',Review.deletereview)


module.exports=router