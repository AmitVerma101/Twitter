import React,{useState} from 'react'
import styles from './Explore.module.css'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'
import Happening from '../Happening/Happening'
export default function Explore() {

  const navigate = useNavigate()
  
  function showProfile(val){
       
        navigate(`/profile/${val.u_id}`)
  }
  return (
    <div className={styles.container}>
      
      <SearchBar onclick= {showProfile} />
      <Happening/>
    </div>
  )
}
