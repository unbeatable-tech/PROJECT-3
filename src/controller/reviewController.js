const reviewModel = require("../model/reviewModel");
const bookModel=require("../model/bookModel")
const validator = require("../validators/validator")



const reviewData = async function (req, res) {
    




    try {
        const Id = req.params.bookId
        const requestBody = req.body
        if (!validator.isValid(Id)) {
            return res.status(400).send({ status: false, msg: " pl add bookId" })
        }
        if (!validator.isValidObjectId(Id)) {
            return res.status(400).send({ status: false, msg: "Invalid Book id" })
        }

        // using Destructer
        const { reviewedBy, rating, review, reviewedAt } = requestBody
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, msg: "pls add details" })
        }


        if (!validator.isValid(reviewedBy)) {
            return res.status(400).send({ status: false, msg: "reviwed by is required" })
        }

        // using regex validate reviewed by 

        if (!/^[a-zA-Z ]{2,30}$/.test(reviewedBy)) {
            return res
                .status(400)
                .send({ status: false, msg: "please enter reviewer's name in valid format" });
        }


        if (!validator.isValid(rating)) {
            return res.status(400).send({ status: false, msg: "Rating is required" })
        }

        if (!/^[1-5]{1}$/.test(rating)) {
            return res.status(400).send({ status: false, msg: "rating must be in 1 to 5" })
        }

        if (!validator.isValid(reviewedAt)) {
            return res.status(400).send({ status: false, msg: "review date is required." })
        }

        if (!/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(reviewedAt)) {
            return res.status(400).send({ status: false, msg: "Date should follow this structure YYYY-MM-DD" })
        }
        
        const searchBook = await bookModel.findOne({ _id: Id, isDeleted: false })
        if (!searchBook) {
            return res.status(400).send({ status: false, msg: "book is not present" })
        }
        if(searchBook.isDeleted==true){
            return res .status(400).send({status:false,msg:"can't review because book is deleted"})
        }
      
        // save review in DB

         requestBody.bookId=searchBook._id

         const saveReview=await reviewModel.create(requestBody)
         if(saveReview){
             await bookModel.findOneAndUpdate({_id:Id},{$inc:{review:1}})
         }
    const response=await reviewModel.findOne({_id:saveReview._id}).select({__v:0,createdAt:0,updatedAt:0,isDeleted:0})
        
        return res.status(201).send({status:true,msg:"success",data:response})
    }
    catch (error) {
        console.log("this is the error", error);
        return res.status(500).send({ status: false, msg: error.message });
    }

}

module.exports = { reviewData }