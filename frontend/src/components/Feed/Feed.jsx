import React,{useState,useEffect} from 'react'
import styles from './Feed.module.css'
import Button from '../Button/Button'
import Tweet from '../Tweet/Tweet'
import Post from '../posts/Post'

import { axiosApiCall } from '../../middlewares/axios';
export default function Feed() {
function showTweet(value){
  console.log("Inside showTweet");
}

async function fetchData(){
  let formData = new FormData()
  formData.append('name','user');
   let response = await axiosApiCall('http://localhost:4000/fetchForYouTweets',formData);
   console.log("consoling the response in fetchData")
   console.log(response)
   if(response.data.auth == true){
       setTweets([...response.data.body]);
   }
}
//useEffect
useEffect( () => {
  setTimeout(()=>{
    fetchData();
  },300)
}, []);

 async function forYou(){
    console.log("For you component")
    let formData = new FormData()
    formData.append('name','user');
     let response = await axiosApiCall('http://localhost:4000/fetchForYouTweets',formData);
     console.log("consoling the response in fetchData")
     console.log(response)
     if(response.data.auth == true){
         setTweets([...response.data.body]);
     }
    setSelected(1)
  }
 async function following(){
    console.log("Following button")
    let formData = new FormData()
    formData.append('name','user');
     let response = await axiosApiCall('http://localhost:4000/followersTweets',formData);
     console.log("consoling the response in fetchData")
     console.log(response)
     if(response.data.auth == true){
         setTweets([...response.data.body]);
     }
    setSelected(2)
  }
  const [selected,setSelected] = useState(1);
  const [tweets,setTweets]=useState([])
  const [newTweet,setNewTweet] = useState({});
  return (<>
  
   
    <div className={styles.container}>
        {/* creating the top element */}
        <div className={styles.component}>
            <h2 style = {{marginTop:'1rem',marginLeft:'1.5rem'}}>Home</h2>
            <div className={styles.buttonContainer}>
                <Button name='For You' class='button' onclick = {forYou} selected = {selected==1?'border':'none'}/>
                <Button name='Following' class='button' onclick ={following} selected = {selected==2?'border':'none'}/>
            </div>
        </div>
        <Tweet tweet = {tweets} setTweet = {setTweets} link='http://localhost:4000/tweet' name='Tweet'/>
        
        { tweets.map((value)=>{
        return  (
       <Post key={'tweet'+`${value.t_id}`} name={value.u_name} tweet = {tweets} setTweet = {setTweets} details={value} description={value.description} postImage = {value.image} t_id = {value.t_id}/>
        )
        })}
      
    </div>
    {tweets.length == 0 && (<h2 style={{textAlign:'center',marginTop:'2rem'}}>Nothing to display..</h2>)}
    </>
  )
}
