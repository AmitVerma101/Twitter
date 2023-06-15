import React,{useState,useEffect} from 'react'
import Loader from '../Loader/Loader';
import { axiosApiCall } from '../../middlewares/axios';
import { useContext } from 'react';
import AuthContext from '../../Context/AuthUser';
import { useParams } from 'react-router-dom';
import Post from '../posts/Post'
import styles from './HashTagRelatedTweets.module.css'
export default function HashTagRelatedTweets() {

    const {user} = useContext(AuthContext)
   
    const [loading,setLoading] = useState(true);
    const [posts,setPosts] = useState([])
    const {hashTag} = useParams();
   
    const formData = new FormData();

    useEffect(()=>{
       async function test(){
        formData.append('hashTag',`#${hashTag}`);
        formData.append('u_id',user.u_id);
        const result = await axiosApiCall('http://localhost:4000/hashRelatedPosts',formData);
        if(result.data.auth == true){
        //   console.log(result.data.body);
          setPosts(result.data.body);
          setLoading(false);
        }
        else {
            alert("Fail to fetch Hash Related Posts");
        }
        }
        test()
    },[])

  return (
    <div className = {styles.container}>
        <h2 style = {{margin:'0.8rem'}}>HashRelatedPosts</h2>
        {loading && <Loader/>}
        {posts.map((value)=>{
            return <Post key = {value.t_id}  details = {value}/>
        })}
            HashTagRelatedTweets
    </div>
  )
}
