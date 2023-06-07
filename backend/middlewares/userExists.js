const AuthenticationDatabase = require('../Database/AuthenticationDatabase')
async function userExists(req,res,next){
    console.log("In user Exists")
    let output = await AuthenticationDatabase.findUser('email',req.body.email);
    console.log(output)
   // next()
    if(output.body && output.body.length!=0){
        res.json({auth:false,message:'User already exists'})
    }
    else {
        next();
    }
}
module.exports = {userExists}