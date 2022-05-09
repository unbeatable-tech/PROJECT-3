const mongoose = require('mongoose')
//validations checking function


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false

    return true;

}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
const isValidtitle=function(title){
    return["Mr","Mrs","Miss"].indexOf(title)!=-1
}


module.exports={isValid,isValidRequestBody,isValidtitle}