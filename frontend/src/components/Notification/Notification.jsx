import React,{useEffect,useState} from 'react'
import { axiosApiCall } from '../../middlewares/axios'
import { useParams } from 'react-router-dom'
import styles from './Notification.module.css'
import Post from '../posts/Post'
export default function Notification() {
    const [notifications,setNotifications] = useState([])
    const [loading,setLoading] =useState(true)
    let {u_id} = useParams();
    console.log("consoling u_id")
    console.log(u_id)
    useEffect(()=>{
        let test = async()=>{
            let formData = new FormData()
            formData.append('u_id',u_id);
            let result = await axiosApiCall('http://localhost:4000/notifications',formData) 
            console.log(result);
            if(result.data.auth == true){
                    setNotifications(result.data.body);
                    setLoading(false);
            }
            else {
                console.log("some error occur while fetching the notifications");
            }
        }
        test();
    },[])

  return (
   <div className={styles.container}>
    <h1 style = {{padding:'1rem'}}>Notifications</h1>
 {!loading && <div className={styles.mainContainer}>
    {notifications.length == 0 && (<h3 style = {{textAlign:'center' ,marginTop:'2rem'}}>Nothing to display</h3>)}
       { notifications.map((value)=>{
            return <Post details = {value}/>
        })}

 </div>}
 </div>
  )}