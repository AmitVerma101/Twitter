import React, { useState,useEffect,useRef } from 'react'
import styles from './SearchBar.module.css'
import { axiosApiCall } from '../../middlewares/axios'
export default function SearchBar(props) {
  const [text,setText] = useState('')
  const [username,setUsername] = useState([])
  
  const [showUsername,setShowUsername] = useState(false)
  
  function Empty(value){
    setText('')
    setShowUsername(false)
    props.onclick(value);
  }

  useEffect(()=>{
    let test =async ()=>{
      let formData = new FormData()
      
      console.log(text)
      formData.append('username',text)
      if(text == ''){
        setShowUsername(false)
      }
      else {

        let result = await axiosApiCall('http://localhost:4000/getUserNames',formData)
        console.log("consoling result")
        console.log(result);
        if(result.data.auth == true){
          console.log(result)
         
     
          setUsername(result.data.body)
          console.log(username)
          setShowUsername(true)
          if(result.data.body.length == 0){
            setShowUsername(false)
          }
     }
     else {
      setShowUsername(false)
     }
      }
   
    }

    test();
  },[text])
  function addUsername(value){
    setText(`${text}${value.username} `)
   
    setShowUsername(false);

  }
  return (
    <div className={styles.container}>
      <input type="text" placeholder='Search Twitter' value={text} onChange={(e)=>setText(e.target.value)} ref = {props.Focusing}/>
      {showUsername && <div className={styles.displayUser} >{
                  username && username.map((value)=>{
                    console.log("consoling value in search bar")
                    console.log(value)
                    return (
                      <>
                     <div onClick={()=>Empty(value)} key={`search${value.u_id}`} style ={{border:'1px solid rgba(0,0,0,0.2)',padding:'0.5rem'}}>
                      <p>{value.u_name}</p>
                      <p>{value.username}</p>
                     </div>

                      </>
                    )
                  })
                }
            </div>}
    </div>
  )
}
