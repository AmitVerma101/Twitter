import React from 'react'
import styles from'./ChatContainer.module.css'
export default function ChatContainer(props) {
    console.log(props.messages)
  return (
    <div className={styles.container}>
        <div className={styles.mainContainer}>
               { props.messages.map((value)=>{
                        
                    return <div key={`message${value.m_id}`} className={ value.self==true?styles.right:styles.left}>{value.message}</div>
               })}
        </div>

    </div>
  )
}
