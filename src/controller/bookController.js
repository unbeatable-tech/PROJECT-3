const bookModel = require("../model/bookModel");
const mongoose = require("mongoose");
const validator = require("../validators/validator");
const moment = require("moment");

const createBook = async function (req, res) {
  try {
    const bookData = req.body;

    if (!validator.isValidRequestBody(bookData)) {
      return res.status(400).send({ status: false, msg: "pls add details" });
    }

    let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } =
      bookData;
    if (!validator.isValid(title)) {
      return res.status(400).send({ status: false, msg: "pls add tittle" });
    }
    if (!validator.isValid(excerpt)) {
      return res.status(400).send({ status: false, msg: "pls add excerpt" });
    }
    if (!validator.isValid(category)) {
      return res.status(400).send({ status: false, msg: "pls add category" });
    }
    if (!validator.isValid(subcategory)) {
      return res
        .status(400)
        .send({ status: false, msg: "pls add subcategory" });
    }
    if (!validator.isValid(ISBN)) {
      return res.status(400).send({ status: false, msg: "pls add ISBN" });
    }

    if (!validator.isValid(userId)) {
      return res.status(400).send({ status: false, msg: "Userid is required" });
    }
    if (!validator.isValidObjectId(userId)) {
      return res.status(400).send({ status: false, msg: "invalid userId" });
    }
    // ISBN validation using regex
    if (!/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN))
      return res.status(400).send({ status: false, msg: "ISBN is invalid" });
    // excerpt validation using regex

    if (!/^[0-9a-zA-Z,\-.\s:;]+$/.test(excerpt))
      return res.status(400).send({ status: false, msg: "excerpt is invalid" });

    const sameISBN = await bookModel.findOne({ ISBN: ISBN, isDeleted: false });
    if (sameISBN)
      return res
        .status(400)
        .send({ status: false, msg: `${ISBN} already exists` });

    const sameTitle = await bookModel.findOne({
      title: title,
      isDeleted: false,
    });
    if (sameTitle)
      return res
        .status(400)
        .send({ status: false, msg: `${title} already exists` });

    if (!validator.isValid(releasedAt)) {
      return res
        .status(400)
        .send({ status: false, message: "Date of release is required." });
    }

    if (req["decodedToken"].userId != userId) {
      return res
        .status(403)
        .send({ status: false, message: "You are not authorized" });
    }

    let object = {
      title,
      excerpt,
      ISBN,
      category,
      subcategory,
      userId,
      releasedAt,
    };

    // object["releasedAt"] = moment().format("YYYY-MM-DD");

    const books = await bookModel.create(object);
    return res
      .status(200)
      .send({ status: true, message: "success", data: books });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};



const getBooks = async function (req, res) {
  try {
    let filters = { isDeleted: false };
    let book = req.query.userId;
    if (book) {
      if (!validator.isValidObjectId(book)) {
        return res
          .status(400)
          .send({ status: false, message: "invalid UserId" });
      }
      filters["userId"] = book;
    }
    let cat = req.query.category;
    if (cat) {
      if (!validator.isValid(cat)) {
        return res.status(400).send({ status: false, msg: "invalid category" });
      }
      filters["category"] = cat;
    }
    let subcat = req.query.sucategory;
    if (subcat) {
      if (!validator.isValid(subcat)) {
        return res
          .status(400)
          .send({ status: false, msg: "invalid subcategory" });
      }
      filters["subcategory"] = subcat;
    }
    let bookData = await bookModel.find(filters).select({
      _id: 1,
      title: 1,
      excerpt: 1,
      userId: 1,
      category: 1,
      reviews: 1,
      releasedAt: 1,
    });                                           

    const bookDetails = bookData.sort(function (a, b) {
      if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return -1;
      }
      if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1;
      }
      return 0;
    }); 
    if (bookData.length > 0) {
      return res.status(200).send({
        status: true,
        count: bookDetails.length,
        message: "Book List",
        data: bookDetails,
      });
    } else {
      return res.status(404).send({ status: false, msg: "No books found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, msg: error.message });
  }
};




const getbookbyId = async function (req, res) {
  try {
    let Id = req.params.bookId;
    if (!validator.isValid(Id)) {
      return res
        .status(400)
        .send({ status: false, msg: "pls provide the book id" });
    }
    if (!validator.isValidObjectId(Id)) {
      return res
        .status(400)
        .send({ status: false, msg: "pls provide valid bookId" });
    }

    let findId = await bookModel.findOne({ _id: Id, isDeleted: false });
    if (!findId) {
      return res.status(400).send({ status: false, msg: "book not found" });
    }
    return res.status(201).send({ status: true, msg: "success", data: findId });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, msg: error.message });
  }
};



const deleteBook = async function (req, res) {
  try {
    let bookId = req.params.bookId;
    if (!validator.isValid(bookId)) {
      return res
        .status(400)
        .send({ status: false, msg: "pls provide the book id" });
    }
    if (!validator.isValidObjectId(bookId)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide the valid book id" });
    }

    // Book is present or not in DB.
    let findBook = await bookModel.findOne({ _id: bookId, isDeleted: false });
    if (!findBook) {
      return res
        .status(400)
        .send({ status: false, msg: "there is no book present" });
    }

    //Authorization check 176 - 183

    const docUserId = findBook.userId;
    const requestedUser = req["decodedToken"].userId;

    if (docUserId != requestedUser) {
      return res
        .status(403)
        .send({ status: false, msg: "You are not authorized" });
    }

    let deleteBook = await bookModel.findByIdAndUpdate(
      { _id: bookId, isDeleted: false },
      { isDeleted: true, deletedAt: Date.now() },
      { new: true }
    );
    if (!deleteBook) {
      return res
        .status(400)
        .send({ status: false, msg: "Book already deleted" });
    } else {
      return res.status(200).send({
        status: false,
        msg: "Book deleted successfully",
        data: deleteBook,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, msg: error.message });
  }
};



const updateBook = async function (req, res) {
  try {
    const bookId = req.params.bookId;

    if (!validator.isValid(bookId)) {
      return res
        .status(400)
        .send({ status: false, msg: "pls provide the book id" });
    }
    if (!validator.isValidObjectId(bookId)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide the valid book id" });
    }

    const data = req.body;
    const { title, excerpt, releasedAt, ISBN } = data;

    // Some validations
    if (!validator.isValid(title)) {
      return res
        .status(400)
        .send({ status: false, message: "title is required" });
    }
    if (!validator.isValid(excerpt)) {
      return res
        .status(400)
        .send({ status: false, message: "excerpt is required" });
    }
    if (!validator.isValid(releasedAt)) {
      return res
        .status(400)
        .send({ status: false, message: "releasedAt is required" });
    }
    if (!validator.isValid(ISBN)) {
      return res
        .status(400)
        .send({ status: false, message: "ISBN is required" });
    }
    if (!/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN)) {
      return res.status(400).send({ status: false, msg: "ISBN is invalid" });
    }

    // Checking if book exist or not in our DB.
    const isBookExist = await bookModel.findOne({
      _id: bookId,
      isDeleted: false,
    });

    if (!isBookExist) {
      return res
        .status(404)
        .send({ status: false, message: "Requested Book is not present." });
    }

    //checking Authorization
    if (req["decodedToken"].userId != isBookExist.userId) {
      return res
        .status(403)
        .send({ status: false, message: "You are not authorized." });
    }

    //Updating the given data...
    const savedData = await bookModel.findByIdAndUpdate(
      { _id: bookId, isDeleted: false },
      { $set: data },
      { new: true }
    );

    return res
      .status(200)
      .send({ status: true, message: "Success", Data: savedData });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, msg: error.message });
  }
};
module.exports = { createBook, getBooks, deleteBook, updateBook, getbookbyId };
