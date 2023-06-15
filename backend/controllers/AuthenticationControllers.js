require('dotenv').config();
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const {sendMail} = require('../middlewares/sendMail')
const AuthenticationDatabase = require('../Database/AuthenticationDatabase')


const verificationCode = (req,res)=>{
    const authHeader = req.headers['authorization']
    // console.log(authHeader)
    const token =  authHeader && authHeader.split(' ')[1];
  
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async (err,user)=>{
      
       let newUser = {u_name:user.u_name,email:user.email,code:crypto.randomBytes(3).toString('hex')};
       console.log("consoling the code")
       console.log(newUser.code);
       let jwtToken = jwt.sign(newUser,process.env.ACCESS_TOKEN_SECRET)
    //    console.log("Consoling the jwtToken")
    //    console.log(jwtToken);
            sendMail(newUser)
           
            res.json({auth:true,token:jwtToken});
})}

const Unfollow =(req,res)=>{
    let authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    const u_id = req.body.u_id;
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async (err,user)=>{
        let result = await AuthenticationDatabase.removeFollower(user,u_id);
        if(result.message == 'success'){
            res.json({auth:true})
        }
        else {
            res.json({auth:false})
        }
    })
}

const whoToFollow = async(req,res)=>{
        let authHeader = req.headers['authorization']
        // console.log(authHeader);
        const token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async (err,user)=>{
            // console.log(user)
            let result = await AuthenticationDatabase.findFollower(user);
            if(result.message == 'success'){
                res.json({auth:true,body:result.body})
            }
            else {
                res.json({auth:false})
            }
            
        })
}

 


const fillDetails =async (req,res)=>{
    // console.log(req.file)
    let image;
        if(req.file!=undefined){
            image = req.file.filename
        }
        else {
            image = '';
        }
        let username = req.body.username
        let email = req.body.email
        // console.log(image,username,email)
        let result = await AuthenticationDatabase.updateUsers("profilepic",image,"username",username,email);

        if(result == 'success'){
            res.json({auth:true,body:username})
        }
        else {
            res.json({auth:false,message:'Some error occur while sign up'})
        }

}


const verifyCode = (req,res)=>{
    // console.log(req.body);
    const code = req.body.code
    const authHeader = req.headers['authorization']
    // console.log("printing authheader")
    // console.log(authHeader)
    const token =  authHeader && authHeader.split(' ')[1];
    // console.log(token)
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        // console.log(user)
        if(user.code == code){
            res.json({auth:true})
        }
        else {
            res.json({auth:false,message:'Verification Code does not match'});
        }
    })
}

const generateJwtToken = (req,res)=>{
    const u_name = req.body.u_name
    const email = req.body.email
   let token = jwt.sign({u_name:u_name,email:email},process.env.ACCESS_TOKEN_SECRET);
   res.json({auth:true,token:token})
}
const signupPost = async (req,res)=>{
    console.log("Hello in the signupPost")
    let u_name = req.body.u_name
    let email = req.body.email
    let u_password = req.body.u_password
    let username = `${u_name}${crypto.randomBytes(3).toString('hex')}`

   let result = await AuthenticationDatabase.insertIntoUser(u_name,email,u_password,username);
//    console.log("printing the result")
//    console.log(result)
   if(result.message == 'success'){
       res.json({auth:true});
   }
   else {
    res.json({auth:false});
   }
   
 
   
}

const validateUsername = async(req,res)=>{
    const username = req.body.username;
    const result = await AuthenticationDatabase.findUser('username',username)

    if(result.body.length == 0)
    {
        res.json({auth:true})
    }
    else {
        res.json({auth:false,message:'Username already exists'})
    }
}

const LoginPost = async(req,res)=>{
      const email = req.body.email;
      const u_password = req.body.u_password;
      const result = await AuthenticationDatabase.findUser("email",email);
    //   console.log(result)
    //   console.log(result.body.length)
      //validating the user against the u_name and password provided in the database
      if(result.body.length == 0){
          res.json({auth:false,message:'No user exists '})
        }
        else {
            
            if(email == result.body[0].email && u_password == result.body[0].u_password){
              let token = jwt.sign({email:email,u_name:result.body[0].u_name},process.env.ACCESS_TOKEN_SECRET);
                res.json({auth:true,message:"User Verified",token:token,body:result.body})
          }
          else {
            res.json({auth:false,message:'Wrong Username or Password'});
          }
          
      }
}

const fetchForYouTweets = (req,res)=>{
      const authHeader = req.headers['authorization']
    //   console.log("Consoling the authHeader");
    //   console.log(authHeader);
      const token = authHeader && authHeader.split(' ')[1]
      jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async (err,user)=>{
        // console.log("consoling in the fetchForYouTweets")
        // console.log(user);
        let output = await AuthenticationDatabase.findTweets(user);
      
       
        if(output.message == 'success'){
            res.json({auth:true,body:output.body})
        }
        else {
            res.json({auth:false})
        }
      })
}
const followersTweets = (req,res)=>{
    const authHeader = req.headers['authorization']
  //   console.log("Consoling the authHeader");
  //   console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1]
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async (err,user)=>{
      // console.log("consoling in the fetchForYouTweets")
      // console.log(user);
      let output = await AuthenticationDatabase.findFollowersTweets(user);
    
     
      if(output.message == 'success'){
          res.json({auth:true,body:output.body})
      }
      else {
          res.json({auth:false})
      }
    })
}

const fetchProfileTweets =async (req,res)=>{
    const {u_id,user_id} = req.body;
    // console.log("consoling the body")
    // console.log(req.body);
    // console.log('Consoling the u_id')
    // console.log(u_id,user_id)
    const result = await AuthenticationDatabase.findProfileTweets(u_id,user_id);
    if(result.message == 'success'){
        res.json({auth:true,body:result.body})
    }
    else {
        res.json({auth:false})
    }
}

const fetchProfileReplies =async (req,res)=>{
    const {u_id,user_id} = req.body;
    const result = await AuthenticationDatabase.findProfileReplies(u_id,user_id);
    if(result.message == 'success'){
        res.json({auth:true,body:result.body})
    }
    else {
        res.json({auth:false})
    }
}

const setMessage = async(req,res) =>{
    const {s_id,r_id,msg} = req.body;
    const result = await AuthenticationDatabase.insertMessage(s_id,r_id,msg);
    if(result.message == 'success'){
        res.json({auth:true,body:result.body});
    }
    else {
        res.json({auth:false});
    }
}
const getMessage = async(req,res)=>{
    
    const {s_id,r_id} = req.body;
    // console.log("printing the s_id and r_id in the getMessage function",s_id,r_id)
    const result = await AuthenticationDatabase.fetchMessage(s_id,r_id);
    if(result.message == 'success'){
        res.json({auth:true,body:result.body});
    }
    else {
        res.json({auth:false});
    }
}

const getUserChatters = async(req,res)=>{
    const {s_id}  = req.body
    const result = await AuthenticationDatabase.fetchUserChatters(s_id);
    if(result.message == 'success'){
        res.json({auth:true,body:result.body});
    }
    else {
        res.json({auth:false});
    }
}
const fetchProfileLikes = async (req,res)=>{
    const {u_id,user_id} = req.body
    const result = await AuthenticationDatabase.findProfileLikes(u_id,user_id)
    if(result.message == 'success'){
        res.json({auth:true,body:result.body})
    }
    else {
        res.json({auth:false})
    }
}

const tweet = (req,res)=>{
    // const image = req.file.filename;
    let image ;
    if(req.file!=undefined){
     image = req.file.filename
    }else{
        image = null;
    }
    const description = req.body.description
    const t_id = req.body.t_id;
    const mention = req.body.mention
    const hashTag = req.body.hashTag
    // console.log("mention")
    // console.log(mention)
    // console.log(typeof mention)
    const authHeader = req.headers['authorization']
    const token =  authHeader && authHeader.split(' ')[1];
  
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async (err,user)=>{
    //    console.log("consoling the user")
    //    console.log(user);
       let output = await AuthenticationDatabase.makeTweet({image:image,description:description,t_id:t_id,email:user.email},mention,hashTag);
    //    console.log(output)
       if(output.message == 'success'){
        res.json({auth:true,body:{u_name:user.u_name,body:output.body}});
       }
       else {
        res.json({auth:false});
       }
    })
}

const notifications =async (req,res)=>{
    let {u_id} = req.body 
    // console.log("consoling the notifications in the notifications controller"+u_id)
    let result = await AuthenticationDatabase.findNotifications(u_id);
    if(result.message == 'success'){
        res.json({auth:true,body:result.body})
    }
    else {
        res.json({auth:false});
    }
}

const fetchTweets = async (req,res)=>{
    let t_id = req.body.t_id;
    let u_id = req.body.u_id;
    let result = await AuthenticationDatabase.giveTweet(t_id,u_id);
    if(result.message == 'success'){
        res.json({auth:true,body:result.body});
    }
    else {
        res.json({auth:false});
    }
}

//comment
const comment = async (req,res)=>{
    let t_id = req.body.t_id;
    let description = req.body.description;
    let image = req.file.filename;

    const authHeader = req.headers['authorization']
    const token =  authHeader && authHeader.split(' ')[1];
  
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async (err,user)=>{
    //    console.log("consoling the user")
    //    console.log(user);
       let output = await AuthenticationDatabase.makeComment({t_id:t_id,description:description,image:image},user.u_name)
    //    console.log(output)
       if(output.message == 'success'){
        res.json({auth:true});
       }
       else {
        res.json({auth:false});
       }
    })
    //saving the comment 
   

}

const follow = (req,res)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
//    console.log(req.body)    
    const u_id = req.body.u_id;
    
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async (err,user)=>{
        // console.log(user)
        // console.log(u_id)
          let result = await AuthenticationDatabase.insertFollower(user,u_id);
          if(result.message == 'success'){
             res.json({auth:true})
          }
          else {
            res.json({auth:false});
          }
    })
}

const addLike = (req,res)=>{
        // console.log(req.body);
        const t_id = req.body.t_id;
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
    //    console.log(req.body)    
        const u_id = req.body.u_id;
        
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async (err,user)=>{
            // console.log(user)
            // console.log(u_id)
              let result = await AuthenticationDatabase.insertLike(user,t_id);
              if(result.message == 'success'){
                 res.json({auth:true})
              }
              else {
                res.json({auth:false});
              }
        })
}

const removeLike = (req,res)=>{
    const t_id = req.body.t_id;
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
//    console.log(req.body)    
    const u_id = req.body.u_id;
    
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async (err,user)=>{
        // console.log(user)
        // console.log(u_id)
          let result = await AuthenticationDatabase.deleteLike(user,t_id);
          if(result.message == 'success'){
             res.json({auth:true})
          }
          else {
            res.json({auth:false});
          }
    })
}

const fetchUserProfile =async (req,res)=>{
    const {u_id} = req.body;
    // console.log("printing the u_id"+u_id)
    let result = await AuthenticationDatabase.findUserProfile(u_id);
    if(result.message == 'success'){
        res.json({auth:true,body:result.body});
    }
    else {
        res.json({auth:false});
    }
    
}

const fetchComments =async (req,res)=>{
    let t_id = req.body.t_id;
    let u_id = req.body.u_id;
    let result = await AuthenticationDatabase.findComments(t_id,u_id);
    if(result.message == 'success'){
        res.json({auth:true,body:result.body});
    }
    else {
        res.json({auth:false})
    }
}

const getUserNames =async(req,res)=>{
    let username = req.body.username

    let result = await AuthenticationDatabase.findUserLike('username',username);
    if(result.message == 'success'){
        res.json({auth:true,body:result.body});
    }
    else {
        res.json({auth:false});
    }
}

const getHashTags =async(req,res)=>{
     let {hashTag} = req.body

    let result = await AuthenticationDatabase.findHashTags('hashTag',hashTag);
    if(result.message == 'success'){
        res.json({auth:true,body:result.body});
    }
    else {
        res.json({auth:false});
    }
}
const fetchHashTags = async(req,res)=>{
    let result = await AuthenticationDatabase.fetchHashTags();
    if(result.message == 'success'){
        res.json({auth:true,body:result.body})
    }
    else {
        res.json({auth:false})
    }
}
const hashRelatedPosts = async(req,res)=>{
    let {hashTag,u_id} = req.body;
    let result = await AuthenticationDatabase.fetchHashRelatedPosts(hashTag,u_id);
    if(result.message == 'success'){
        res.json({auth:true,body:result.body})
    }
    else {
        res.json({auth:false});
    }
}

module.exports = {hashRelatedPosts,fetchHashTags,getHashTags,signupPost,verificationCode,LoginPost,generateJwtToken,verifyCode,fillDetails,validateUsername,tweet,fetchForYouTweets,comment,whoToFollow,follow,Unfollow,addLike,removeLike,fetchComments,getUserNames,fetchTweets,fetchUserProfile,fetchProfileTweets,fetchProfileReplies,fetchProfileLikes,notifications,setMessage,getMessage,getUserChatters,followersTweets};