
const jwt = require ("jsonwebtoken")

const auth = async function(req,res,next){

    try{
        const token = req.header('x-api-key')
        if(!token) return res.status(400).send({status:false , msg:'Please add token'})
        const decodedToken = jwt.verify(token,"Group-6")
        if(!decodedToken) return res.status(400).send({status:false , msg: 'Invalid token'})
        const tokenExpire = decodedToken.exp
        if(tokenExpire <= Date.now()/1000) return res.status(400).send({status:false , msg: 'token Expires'})
        next();
    }
    catch(error){
        console.log(error)
        return res.status(500).send({status:false,msg:error.msg})
    }

}

module.exports.auth = auth