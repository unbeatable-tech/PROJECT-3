// const { default: mongoose } = require("mongoose")

// const reviewSchema = new mongoose.Schema({
//     bookId: {ObjectId, mandatory, refs to book model},
//     reviewedBy: {string, mandatory, default 'Guest', value: reviewer's name},
//     reviewedAt: {Date, mandatory},
//     rating: {number, min 1, max 5, mandatory},
//     review: {string, optional}
//     isDeleted: {boolean, default: false},
// },{timestamps: true});

// module.exports = mongoose.model('Review', reviewSchema)