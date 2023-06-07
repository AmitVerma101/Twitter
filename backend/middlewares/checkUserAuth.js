const AuthenticationDatabase = require('../Database/AuthenticationDatabase')
const jwt = require('jsonwebtoken');
function checkUserAuth(req,res,next){
    const authHeader = req.headers['authorization']
    const token =  authHeader && authHeader.split(' ')[1];
    if(token == null){
        res.json({auth:false,message:'Login First'});
    }
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async (err,user)=>{
        if(err){
            res.json({auth:false,message:'Token expired'})
        }
        else {
            let result = await AuthenticationDatabase.findUser("email",user.email);
            console.log("consoling the result of AuthenticationDatabase")
            console.log(result)
            if(result.body.length == 1){
                res.json({auth:true,body:result.body})
            }
            else {
                res.json({auth:false});
            }
          next()
        }
       
    })
}

module.exports = {checkUserAuth}