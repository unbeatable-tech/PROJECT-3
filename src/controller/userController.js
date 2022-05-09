const userModel=require('../model/userModel')



const createUser=async function(req,res){


try{

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