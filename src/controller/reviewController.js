const reviewModel = require("../model/reviewModel");
const bookModel = require("../model/bookModel")
const validator = require("../validators/validator")

const moment = require("moment")

const reviewData = async function (req, res) {





    try {
        const Id = req.params.bookId
        const requestBody = req.body
        if (!validator.isValid(Id)) {
            return res.status(400).send({ status: false, msg: " pls add bookId" })
        }
        if (!validator.isValidObjectId(Id)) {
            return res.status(400).send({ status: false, msg: "Invalid Book id" })
        }

        // using Destructer
        const { reviewedBy, rating, review } = requestBody

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, msg: "pls add details" })
        }
        if (!validator.isValid(review)) {
            return res.status(400).send({ status: false, msg: "Review is required" })
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






        const searchBook = await bookModel.findOne({ _id: Id, isDeleted: false })
        if (!searchBook) {
            return res.status(404).send({ status: false, msg: "book is not present" })
        }


        // save review in DB


        requestBody.bookId = searchBook._id
        requestBody.reviewedAt = moment().format("YYYY-MM-DD")

        const saveReview = await reviewModel.create(requestBody)
        if (saveReview) {
            await bookModel.findOneAndUpdate({ _id: Id }, { $inc: { reviews: 1 } })
        }

        const response = await reviewModel.findOne({ _id: saveReview._id }).select({ __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0 })

        return res.status(201).send({ status: true, msg: "success", data: response })
    }
    catch (error) {
        console.log("this is the error", error);
        return res.status(500).send({ status: false, msg: error.message });
    }

}



const updateReview = async function (req, res) {

    try {

        const bookParams = req.params.bookId
        const reviewParams = req.params.reviewId
        const requestupadtedBody = req.body


        const { review, rating, reviewedBy } = requestupadtedBody
        // validation starts


        if (!validator.isValidObjectId(bookParams)) {
            return res.status(400).send({ status: false, msg: "Pls provide valid bookId" })
        }
        if (!validator.isValidObjectId(reviewParams)) {
            return res.status(400).send({ status: false, msg: "invalid reviewId" })
        }

        if (!validator.isValid(rating)) {
            return res.status(400).send({ status: false, msg: "Rating is required" })
        }

        if (!/^[1-5]{1}$/.test(rating)) {
            return res.status(400).send({ status: false, msg: "rating must be in 1 to 5" })
        }

        if (!validator.isValid(review)) {
            return res.status(400).send({ status: false, msg: "review is missing , pls provide review to update" })
        }

        if (!validator.isValid(reviewedBy)) {
            return res.status(400).send({ status: false, msg: "reviewer's name  is missing , pls provide review to update" })
        }


        const searchBook = await bookModel.findOne({ _id: bookParams, isDeleted: false })
        if (!searchBook) {
            return res.status(404).send({ status: false, msg: `${bookParams} book is not present` })
        }
        const searchReview = await reviewModel.findOne({ _id: reviewParams, isDeleted: false })
        if (!searchReview) {
            return res.status(404).send({ status: false, msg: `${reviewParams} review is not present` })
        }
        const updateReviewDetails = await reviewModel.findOneAndUpdate({ _id: reviewParams }, { review: review, rating: rating, reviewedBy: reviewedBy }, { new: true })
        return res.status(200).send({ status: true, msg: "success", data: updateReviewDetails })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: error.message })
    }
}

const deletereview = async function (req, res) {

    try {

        let bookParams = req.params.bookId
        let reviewParams = req.params.reviewId


        //validation starts

        if (!validator.isValidObjectId(bookParams)) {
            return res.status(400).send({ status: false, msg: "in valid book id" })
        }

        if (!validator.isValidObjectId(reviewParams)) {
            return res.status(400).send({ status: false, msg: "invalid review id" })
        }

        const searchBook = await bookModel.findOne({ _id: bookParams,isDeleted:false })
        if (!searchBook) {
            return res.status(404).send({ status: false, msg: "book doesn't exists" })
        }
        const searchReview = await reviewModel.findOne({ _id: reviewParams,isDeleted:false  })
        if (!searchReview) {
            return res.status(404).send({ status: false, msg: "review doesn't exists" })
        }

        
                const delrev = await reviewModel.findOneAndUpdate({ _id: reviewParams }, { isDeleted: true, deletedAt: Date.now() }, { new: true })

                if (delrev) {
                    await bookModel.findOneAndUpdate({ _id: bookParams }, { $inc: { reviews: -1 } })
                }
                return res.status({ status: true, msg: "Review delted successfully", data: delrev })
            
       

    }
    catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: error.message })
    }

}

module.exports = { reviewData, updateReview, deletereview }