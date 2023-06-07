import React,{useState,useEffect, useContext} from 'react'
import { useLocation,useParams } from 'react-router-dom'
import Post from '../posts/Post';
import styles from './TweetDescription.module.css'
import { axiosApiCall } from '../../middlewares/axios';
import AuthContext from '../../Context/AuthUser'
export default function TweetDescription() {
    const location = useLocation()
    const [comments,setComments] = useState([]);
    const [loading,setLoading] = useState(true)
    const {user,setUser} = useContext(AuthContext);
    
    const [tweet,setTweet] = useState([])
    console.log(tweet); 
    let {t_id} = useParams();
    useEffect(()=>{
        console.log("consoling the t_id in the useEffect")
        console.log(t_id);
      let test =  async()=>{
        let formData = new FormData();
        formData.append('t_id',t_id);
        formData.append('u_id',user.u_id)
        let result = await axiosApiCall('http://localhost:4000/fetchTweets',formData);
        if(result.data.auth == true){
           
            setTweet(result.data.body);
            let response = await axiosApiCall('http://localhost:4000/fetchComments',formData);
            console.log(response)
            console.log("consoling the response")
            if(response.data.auth == true){
                    setComments(response.data.body);
                    
                    setLoading(false)
            }  
        }
        }
        test()
    },[t_id])
  
  return (
      <>
      <h3 style={{marginTop:'0.3rem',marginLeft:'0.3rem'}}>Tweet Description</h3>
  { !loading &&  <div className={styles.container}>
        
       { tweet.map((value)=>{
          return <Post details={value} tweet = {comments} setTweet = {setComments} key = {`descriptions${value.t_id}`}/>}
       )} 
        

        {/* {comments.map((value)=>{
            <Post details = {value} />
        })} */}
     <p style={{textAlign:'center'}}>Comments related to the tweet</p>
     {
        comments.map((value)=>{
           return <Post details = {value} key = {`description${value.t_id}`}/>
        })
     }
    </div>}
    </>
  )
}
