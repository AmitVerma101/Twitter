import React,{useState,useEffect} from 'react'
import Loader from '../Loader/Loader'
import HashTag from './HashTag'
import { axiosApiCall } from "../../middlewares/axios";
import styles from './HashContainer.module.css'
export default function HashContainer() {
  const [loading,setLoading] = useState(true);
  const [hashTags,setHashTags] = useState([])
  const formData = new FormData();
  useEffect(()=>{
      async function test(){
     
       const result = await axiosApiCall('http://localhost:4000/fetchHashTags',formData);
       if(result.data.auth == true){
        setHashTags(result.data.body);
        setLoading(false);
        console.log(result.data.body);
        }
        else {
          alert("Error rise during the fetching of the hashTags");
        }
      }
      test();
  },[])
  return (
    <div className={styles.container}>
       <h2 style={{margin:'0.8rem'}}>Hash Description</h2>
        {loading && <Loader/>}
        {hashTags.map((value)=>{
             return <HashTag key = {value.hashtag}  count = {value.count} hashTag = {value.hashtag}/>
        })}


    </div>
  )
}
