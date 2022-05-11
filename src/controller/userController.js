const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const validator = require("../validators/validator");



const createUser = async function (req, res) {
  try {
    let user = req.body;
    if (!validator.isValidRequestBody(user)) {
      return res
        .status(400)
        .send({
          status: false,
          msg: "Invalid request parameters,please provide details",
        });
    }
    const { title, name, email, phone, password} = user;
    if (!title) {
      return res.status(400).send({ status: false, message: "pls add title" });
    }
    if (!validator.isValidTitle(title)) {
      return res.status(400).send({ status: false, msg: "title is invalid" });
    }

    if (!validator.isValid(name)) {
      return res.status(400).send({ status: false, msg: "name is required" });
    }

    if (!validator.isValid(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "mobile number is required" });
    }
    if (!validator.isValid(email)) {
      return res.status(400).send({ status: false, msg: "email is required" });
    }
    if (!validator.isValid(password)) {
      return res
        .status(400)
        .send({ status: false, msg: "password is required" });
    }

    const sameEmail = await userModel.findOne({ email: email });
    if (sameEmail) {
      return res
        .status(403)
        .send({ status: false, message: `${email} is already in used` });
    }

    const samePhone = await userModel.findOne({ phone: phone });
    if (samePhone) {
      res
        .status(403)
        .send({
          status: false,
          meassage: `${phone} mobile no is already used`,
        });
    }

    // name validation using regex

    if (!/^[a-zA-Z ]{2,30}$/.test(name)) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter name in valid format" });
    }
    //validating phone number of 10 digits only.
    if (!/^([+]\d{2})?\d{10}$/.test(phone))
      return res
        .status(400)
        .send({
          status: false,
          message: "Invalid Phone number.Phone number must be of 10 digits.",
        });

    //validating email using RegEx.
    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))
      return res
        .status(400)
        .send({ status: false, message: "Invalid Email id." });

    //setting password's mandatory length in between 8 to 15 characters.
    if (password.length >= 8 && password.length <= 15) {
      return res
        .status(400)
        .send({ status: false, message: "Password criteria not fulfilled." });
    }

    let data = req.body;
    let save = await userModel.create(data);
    res.status(201).send({ status: true, data: save });
  } 
  catch (error) {
    console.log("this is the error", error);
    res.status(500).send({ status: false, msg: error.message });
  }
};



const userLogin = async function (req, res) {
  try {
    let credential = req.body;
    if (!validator.isValidRequestBody(credential)) {
      return res
        .status(400)
        .send({
          status: false,
          msg: "Invalid request parameters,please provide details",
        });
    }
    // using destructer
    const { email, password } = credential;

    if (!validator.isValid(email)) {
      return res
        .status(400)
        .send({ status: false, msg: "Email id is required" });
    }
    if (!validator.isValid(password)) {
      return res
        .status(400)
        .send({ status: false, msg: "password is required" });
    }
    if (email && password) {
      let save = await userModel.findOne({ email: email, password: password });
      if (save) {
        let token = jwt.sign({ userId: save._id }, "Group-6", {
          expiresIn: "24h",
        });
        res.header("x-api-key", token);
        return res
          .status(201)
          .send({
            status: true,
            message: "you have successfully logged in",
            data: token,
          });
      } else {
        return res
          .status(400)
          .send({ status: false, message: "invalid credetinals" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, error: error.meassage });
  }
};


module.exports = { createUser, userLogin };