import React,{useContext, useRef} from 'react'
import styles from './Message.module.css'
import SearchBar from '../SearchBar/SearchBar'
import AuthContext from '../../Context/AuthUser'
export default function Message(props) {
const {user,setUser} = useContext(AuthContext)
  
  
  function hello(val){
    console.log(props.focusSearchBar)
    console.log(props.passingVal);
    props.setPassingVal(val)
    
  }
  const searchBar = useRef()
  props.setFocusSearchBar(searchBar)
  return (
    <div className={styles.container}>
            <div className={styles.mainContainer}>
                <h2>Messages</h2>
                <SearchBar onclick = {hello} Focusing = {searchBar}/>
            </div>
    </div>
  )
}
