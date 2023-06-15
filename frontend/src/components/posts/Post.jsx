import React,{useState} from 'react'
import ModeCommentTwoToneIcon from '@mui/icons-material/ModeCommentTwoTone';
// import LoopTwoToneIcon from '@mui/icons-material/LoopTwoTone';
import FavoriteBorderTwoToneIcon from '@mui/icons-material/FavoriteBorderTwoTone';
// import BarChartTwoToneIcon from '@mui/icons-material/BarChartTwoTone';
// import IosShareTwoToneIcon from '@mui/icons-material/IosShareTwoTone';
import styles from './Post.module.css'

// import ScheduleIcon from '@mui/icons-material/Schedule';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { axiosApiCall } from '../../middlewares/axios';
// import Button from '../Button/Button';
import Tweet from '../Tweet/Tweet';
import { useNavigate } from 'react-router-dom';
// import { convertLength } from '@mui/material/styles/cssUtils';

export default function Post(props) {
  
const navigate = useNavigate();
async function like(event,value){
  event.stopPropagation();
  // console.log("like")
  // console.log(value)
  if(color == 'red'){
    // console.log("call for the delete of the entry")
    let formData = new FormData()
    formData.append('t_id',value.t_id);
    let result = await axiosApiCall('http://localhost:4000/removeLike',formData);
    if(result.data.auth==true){
      setColor((color=='red')?'black':'red'); 
      setLikesCount(likesCount-1);
    }
    else {
      console.log("some error occured")
    }

  }
  else {
    let formData = new FormData()
    formData.append('t_id',value.t_id);
    let result = await axiosApiCall('http://localhost:4000/addLike',formData)
    if(result.data.auth == true){
      setColor((color=='red')?'black':'red')
      setLikesCount(likesCount+1);
    }
    else {
      console.log("some error occured")
    }
    // console.log("add into the table")
  }
   

 

}

function showTweet(){
  // console.log("In the showTweet function")
  // console.log(props.details);
  navigate(`/tweetDescription/${props.details.t_id}`)
}

  function cross(){
    setComment(!comment)
  }
  function addEmoji(){
      console.log('Adding emoji')
  }
  function reply(){
    console.log("In the reply function")
  }
  function uploadImage(){
    console.log("In upload image function")
  };
  async function Comment(e,t_id,description,name){
    // console.log("consoling the comment in the comment function")
    // console.log(comment)
    e.stopPropagation();
    // console.log("Printing the tweet id "+t_id);
    setUserInfo({t_id,description,name})
    setComment(!comment)
    
  }
  function openProfile(e){
    e.stopPropagation()
    navigate(`/profile/${props.details.u_id}`)
  }
  //creating the states
    const [description,setDescription] = useState('')
    const [image,setImage] = useState('')
    const [userInfo,setUserInfo] = useState({})
    let [comment,setComment] = useState(false)
    const [cmt,setCmt] = useState([])
    const [color,setColor] = useState((props.details?.likes==true)?'red':'black')
    const [likesCount,setLikesCount] = useState(props.details.likescount);

  return (
   <>
  {comment &&<div  className={styles.commentOuterContainer}> 
  <div className={styles.commentPopUp}>
    <div id={styles.cross} onClick={cross}>X</div> 
    <div><p>{userInfo.name}</p><p>{userInfo.description}</p></div>
    <p id={styles.reply}>Replying to {userInfo.name}</p>{
      props.tweet? <Tweet tweet = {props.tweet} comment={comment} setComment={setComment} t_id={userInfo.t_id} setTweet = {props.setTweet} link='http://localhost:4000/tweet' name='Reply'/>: <Tweet comment={comment} setComment={setComment} t_id={userInfo.t_id}  link='http://localhost:4000/tweet' name='Reply'/>
    }
    
    </div>
   
  </div>
      
    
    } 
   <div className={styles.container} onClick={showTweet}>
    <div className={styles.profileHolder} onClick = {(e)=>openProfile(e)}>
       {props.details.profilepic!= undefined && props.details.profilepic!=''? <div className={styles.profile} style = {{background:`URL(http://localhost:4000/${props.details.profilepic})`,backgroundSize:'cover',backgroundPosition:'center'}}></div>:<AccountCircleIcon style={{color:'#ccc',width:'60px',height:'60px',margin:'0',padding:'0'}}/>}
            <h5>{props.details.u_name}</h5>
    </div>
        <p>
            {props.details.description}
        </p>
        
       {props.details.image!=undefined && <img className={styles.image} src={`http://localhost:4000/${props.details.image}`} alt="" />}
        <div className={styles.icons}>
       <ModeCommentTwoToneIcon onClick={(e)=>Comment(e,props.details.t_id,props.details.description,props.u_name)}/>
            {/* <LoopTwoToneIcon onClick={uploadImage}/> */}
            <div style={{display:'flex',alignItems:'center',gap:'0.3rem'}}>
            <FavoriteBorderTwoToneIcon onClick={(e)=>like(e,props.details)} style = {{color:`${color}`}}/>
            <span>{likesCount}</span>
            </div>
            {/* <BarChartTwoToneIcon/>
            <IosShareTwoToneIcon/>
            <ScheduleIcon/>
            <LocationOnIcon/> */}
        </div>
  </div>
   
   
   </>
  )
}
