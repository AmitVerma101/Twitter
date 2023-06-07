import React from 'react'
import {useState,useEffect} from 'react'
import styles from './Happening.module.css'
import Trending from '../Trending/Trending'
import { axiosApiCall } from '../../middlewares/axios'
export default function Happening() {
  useEffect(()=>{
        let formData = new FormData()
        const test = async ()=>{
        let result = await axiosApiCall('http://localhost:4000/whoToFollow',formData);
        console.log("printing the result in happening component")
        console.log(result);
        if(result.data.auth == true){
            setFollower(result.data.body)
        }

      }
      test();
  },[])
  

    //defining states 
    const [follower,setFollower] = useState([]);
   const [follow,setFollow] = useState(false)



   

  return (
    
    <div className={styles.container}>
     {
        follower.map(function(value,index){
             return <Trending key={index} btnName = {follow} name={value.u_name} username={value.username!=null?value.username:''} image={value.profilePic} details = {value} />
        })
     }
      
    </div>
  )
}
