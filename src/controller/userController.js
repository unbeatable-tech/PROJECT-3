const userModel=require('../model/userModel')

const validator=require('../validators/validator')



const createUser=async function(req,res){


try{

let user=req.body
if(!validator.isValidRequestBody(user)){
    return res.status(400).send({status:false,msg:"Invalid request parameters,please provide details"})
}
const{title,name,email,phone,password,address}=user
const isUserAlready=await userModel.findOne({phone:phone,email:email,password:password})
    if(isUserAlready){
     return res.status(403).send({status:false,meassage:"same user exist"})
    }
    const samePhone=await userModel.findOne({phone:phone})





let data=req.body
let save=await userModel.create(data)
res.status(201)
.send({status:true,data:save})

}
catch(error){
    console.log("this is the error",error)
    res.status(500).send({status:false,msg:error.message})
}



}

module.exports.createUser=createUser