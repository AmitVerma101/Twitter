import React from 'react'
import styles from './HashTag.module.css'
import { useNavigate } from 'react-router-dom'
export default function HashTag(props) {
    const navigate = useNavigate();
    function hashRelatedTweets(){
        navigate(`/explore/${props.hashTag.substring(1)}`)
           console.log("In the Function hashRelatedTweets")

    }
  return (
   <>
   <div className={styles.container}  onClick = {hashRelatedTweets}>
   <h3>{props.hashTag}</h3>
   <p>{props.count} Tweets</p>
   </div>
   </>
  )
}
