import React,{useState} from 'react'
import { Link,useNavigate } from 'react-router-dom';
import styles from './Trending.module.css'
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Button from '../Button/Button'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {axiosApiCall} from '../../middlewares/axios'
export default function Trending(props) {
  // console.log("consoling props in the trending component")
  // console.log(props.profilepic)
  const navigate = useNavigate()
  function openProfile(){
      navigate(`/profile/${props.details.u_id}`)
  }
  async function fun(id){
    // console.log("Fun is being called")
    // console.log(id);
  
    let link;
    if(!follow){
      link = 'http://localhost:4000/follow'
    }
    else {
      link = 'http://localhost:4000/Unfollow'
    }
    // console.log(link)
    let formData = new FormData()
    formData.append("u_id",id);
    let result = await axiosApiCall(link,formData);
    if(result.data.auth == true){
      setFollow(!follow)
    }

}
     const [follow,setFollow] = useState(false); 
    // console.log(props)
    let value = props.arr
  return (
    <>
    <div className={styles.container}>
        <div className={styles.first} onClick = {openProfile}>
          { props.details.profilepic!=undefined && props.details.profilepic!=''?<span style = {{height:'50px',width:'50px',borderRadius:'50%',background:`URL(http://localhost:4000/${props.details.profilepic})`,backgroundRepeat:'no-repeat',backgroundPosition:'center',backgroundSize:'cover'}}></span>:<AccountCircleIcon style = {{color:'#bbb',width:'50px',height:'50px'}}/>}
        <div>
          <p>{props.name}</p>
          <p>{`@${props.username}`}</p>
        </div>
        </div>
      <div>
        <Button name={!follow?'Follow':'Unfollow'} onclick = {()=>fun(props.details.u_id)}  class = 'roundedButton'/>
      </div>
    </div>
    </>
  )
}
