const mongoose = require('mongoose')
//validations checking function
const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)

}

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false

    return true;

}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
const isValidTitle=function(value){

    
    if(['Mr','Mrs',"Miss"].indexOf(value)==-1) return false; 

    return true;

}



module.exports={isValid,isValidRequestBody,isValidTitle,isValidObjectId}