const express = require('express')
const multer = require('multer')
const router = express.Router()

  const upload = multer({ dest: 'uploads/profile/' });
  const tweetUpload = multer({dest: 'uploads/tweets/'});
  const commentUpload=multer({dest:'uploads/comment/'})

const {userExists} = require('../middlewares/userExists')
const {checkUserAuth} = require('../middlewares/checkUserAuth')
const AuthenticateController = require('../controllers/AuthenticationControllers')

router.post('/generateJwtToken',userExists,AuthenticateController.generateJwtToken)
// defining the signup route
router.post('/signup',AuthenticateController.signupPost)

//defining the login route
router.post('/login',AuthenticateController.LoginPost)

router.post('/verifyCode',AuthenticateController.verifyCode);
router.post('/validateUsername',AuthenticateController.validateUsername);

router.post('/fillDetails',upload.single('image'),AuthenticateController.fillDetails)

router.post('/tweet',tweetUpload.single('image'),AuthenticateController.tweet);

router.post('/fetchForYouTweets',AuthenticateController.fetchForYouTweets);
router.post('/followersTweets',AuthenticateController.followersTweets);

router.post('/fetchTweets',AuthenticateController.fetchTweets);
router.post('/comment',commentUpload.single('image'),AuthenticateController.comment);

router.post('/fetchComments',AuthenticateController.fetchComments);
router.post('/verificationCode',AuthenticateController.verificationCode);
router.post('/checkUserAuth',checkUserAuth)

router.post('/fetchUserProfile',AuthenticateController.fetchUserProfile)
router.post('/whoToFollow',AuthenticateController.whoToFollow);
router.post('/follow',AuthenticateController.follow);

router.post('/fetchProfileTweets',AuthenticateController.fetchProfileTweets)
router.post('/Unfollow',AuthenticateController.Unfollow);

//likes
router.post('/addLike',AuthenticateController.addLike);
router.post('/removeLike',AuthenticateController.removeLike);

router.post('/getUserNames',AuthenticateController.getUserNames)
router.post('/getHashTags',AuthenticateController.getHashTags)



router.post('/fetchProfileReplies',AuthenticateController.fetchProfileReplies)
router.post('/fetchProfileLikes',AuthenticateController.fetchProfileLikes)


router.post('/notifications',AuthenticateController.notifications);

router.post('/setMessage',AuthenticateController.setMessage);
router.post('/getMessages',AuthenticateController.getMessage);
router.post('/getUserChatters',AuthenticateController.getUserChatters)


module.exports = router