const userModel = require('../model/userModel')
const bookModel = require('../model/bookModel')
const validator = require('../validators/validator')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const { isValidObjectId } = require('mongoose')

// 3rd api to create Book
const createBook=async function(req,res)
   {
       try{
const bookData=req.body

if(!validator.isValidRequestBody(bookData)){
    return res.status(400).send({status:false,msg:"pls add details"})
}

 const{ title, excerpt, userId, ISBN, category, subcategory }=bookData
if(!validator.isValid(title)){
    return res.status(400).send({status:false,msg:"pls add tittle"})
}
if(!validator.isValid(excerpt)){
    return res.status(400).send({status:false,msg:"pls add excerpt"})
}
if(!validator.isValid(category)){
    return res.status(400).send({status:false,msg:"pls add category"})
}
if(!validator.isValid(subcategory)){
    return res.status(400).send({status:false,msg:"pls add subcategory"})
}
if(!validator.isValid(ISBN)){
    return res.status(400).send({status:false,msg:"pls add ISBN"})
}

if(!validator.isValid(userId)){
    return res.status(400).send({status:false,msg:"Userid is required"})
}
if(!validator.isValidObjectId(userId)){
    return res.status(400).send({status:false,msg:"invalid userId"})
}
// ISBN validation using regex
if(!/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN))
return res.status(400).send({status:false,msg:"ISBN is invalid"})
// excerpt validation using regex

if(!/^[0-9a-zA-Z,\-.\s:;]+$/.test(excerpt))
return res.status(400).send({status:false,msg:"excerpt is invalid"})

const sameISBN=await bookModel.findOne({ISBN:ISBN,isDeleted:false})
if(sameISBN)
return res.status(400).send({status:false,msg:`${ISBN} already exists`})

const sameTitle=await bookModel.findOne({title:title,isDeleted:false})
if(sameTitle)
return res.status(400).send({status:false,msg:`${title} already exists`})




let object = { title, excerpt, ISBN, category, subcategory, userId }

        object["releasedAt"] = moment().format("YYYY-MM-DD")
        const books=await bookModel.create(object)
        return res.status(200).send({status:false,msg:"sucess",data:books})


       }
       catch(error){
           console.log(error)
           return res.status(500).send({status:false,msg:error.message})
       }
   }




module.exports.createBook=createBook


const getBooks = async function (req, res) {

    try {

        let filters = { isDeleted: false }
        let book = req.query.userId
        if(!book){
            return res.status(400).send({status:false,msg:"pls add userId"})
        }
        if (book) {
            if (!isValidObjectId(book)) {
                return res.status(400).send({ status: false, message: "invalid UserId" })
            }
            filters["userId"] = book
        }
        let cat = req.query.category
        if(!cat){
            return res.status(400).send({status:false,msg:"pls add category"})
        }
        if (cat) {
            if (!validator.isValid(cat)) {
                return res.status(400).send({ status: false, msg: "invalid category" })
            }
            filters["category"] = cat
        }
        let subcat = req.query.sucategory
        if (subcat) {
            if (!validator.isValid(subcat)) {
                return res.status(400).send({ status: false, msg: "invalid subcategory" })
            }
            filters["subcategory"] = subcat

        }
        let bookData = await bookModel.find(filters).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 })

        const bookDetails = bookData.sort(function (a, b) {



            if (a.title.toLowerCase() < b.title.toLowerCase()) { return -1 }
            if (a.title.toLowerCase() > b.title.toLowerCase()) { return 1 }
            return 0;
        })
        if (bookData.length > 0) {
            return res.status(200).send({ status: true, count: bookDetails.length, message: "Book List", data: bookDetails })
        } else {
            return res.status(404).send({ status: false, msg: "No books found" })
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: error.message })

    }



}
module.exports.getBooks=getBooks