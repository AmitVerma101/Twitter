import React,{useEffect,useContext,useState} from 'react'
import {useParams} from 'react-router-dom'
import AuthContext from "../../Context/AuthUser";
import styles from './Profile.module.css'
import Button from '../Button/Button'
import userPic from '../../images/userProfileImage.jpg'
import { axiosApiCall } from '../../middlewares/axios'
import Post from '../posts/Post'
export default function Profile() {
  const [id,setId] = useState();
   let {u_id}  = useParams();
  //  setId(u_id);
   console.log("consoling the useParams")
   console.log(useParams())
   console.log(u_id);
   const { user, setUser } = useContext(AuthContext);
  //  console.log("Consoling the value of the user")
  //  console.log(user)
   const [userData,setUserData] = useState({})
   const [tweetData,setTweetData] = useState([])
   const [option,setOption] = useState(1);
   let [loading,setLoading]  = useState(true)
   async function fun(val){
    let formData = new FormData();
    formData.append('u_id',u_id)
    formData.append('user_id',user.u_id);
    let link;
      if(val == 1){
        link = 'http://localhost:4000/fetchProfileTweets'
      }
      else if(val == 2){
        link = 'http://localhost:4000/fetchProfileReplies'
      }
      else if(val == 3){
        link = 'http://localhost:4000/fetchProfileLikes';
      }
      let result = await axiosApiCall(link,formData);
      if(result.data.auth == true){
        setTweetData(result.data.body)
        setOption(val);
      }
      else {
        console.log("Failing to fetch data from the api");
      }

   }
    function follow(){
        console.log("Hello Follow Button");
    }
    useEffect(()=>{
        // console.log("Printing the U-id"+u_id)
        console.log("UseEffect is running")
        let test =async()=>{
            let formData = new FormData()
            formData.append('u_id',u_id);
            formData.append('user_id',user.u_id);
                let result = await axiosApiCall('http://localhost:4000/fetchUserProfile',formData);
                if(result.data.auth == true){
                     console.log(result.data.body)
                  
                    let response = await axiosApiCall('http://localhost:4000/fetchProfileTweets',formData);
                    if(response.data.auth == true){
                      console.log("inside setTweetData")
                        setTweetData([...response.data.body]);
                    }
                    else {
                        console.log("An error occured while fetching the user tweets")
                    }
                    setUserData({...result.data.body[0]})
                }
                else {
                    console.log("An error occured while fetching the user Profile")
                }
                    setLoading(false)
                    // setId(u_id)
        }
        test()
    },[u_id])
  return (
    <div className={styles.container}>
       {!loading && <div className={styles.mainContainer}>
                <h1>{userData.u_name}</h1>
                <div className={styles.coverImage}>
                   
                <div className={styles.profileImage} style={{background:(userData.profilepic!=undefined && userData.profilepic!=''?`URL(http://localhost:4000/${userData.profilepic}`:`URL(${userPic})`)}}>
                        
                </div>
                </div>
                <div className={styles.followButton}>
                    <Button name = 'Follow' class = 'roundedButton' onclick = {follow} style = {{width:'fit-content'}}/>
                </div>
                <div style = {{paddingLeft:'0.5rem'}}>
                    <p style = {{marginBottom:'0.2rem'}}>{userData.u_name}</p>
                    
                    <p>{userData.username}</p>
                </div>
                <div className={styles.followers}>
                    <span>{userData.following} Followers</span>
                    <span>{userData.followers} Following</span>
                </div>
                <div className={styles.buttons}>
                        <Button name = 'Tweets' class = 'button' selected = {option==1?'border':'none'}  onclick = {()=>fun(1)}/>
                        <Button name = 'Replies' class = 'button' selected = {option==2?'border':'none'} onclick = {()=>fun(2)}/>
                        <Button name = 'Likes' class = 'button' selected = {option==3?'border':'none'} onclick = {()=>fun(3)}/>

                </div>
                <div className={styles.tweets}>
                    {tweetData.map((value)=>{
                       return <Post details = {value} key={`description${value.t_id}`}/>
                    })}
                </div>
        </div>}
    </div>
  )
}
