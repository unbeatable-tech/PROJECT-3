
const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId
const reviewSchema = new mongoose.Schema({

    bookId: {
        type: ObjectId,
        required: true,
        ref: "Book"
    },
    reviewedBy: {
        type: String,
        default: 'Guest',
        required: true,
        trim:true
        
    },
    reviewedAt: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        
    },
    review: {
        type: String,
        trim:true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })
module.exports = mongoose.model("Review", reviewSchema)
  

