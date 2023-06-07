import React from 'react'
import styles from './SidebarComponent.module.css'
export default function SidebarComponent({icon,text,onclick}) {
  return (
    <div className={styles.container} onClick={onclick}>
           
            {icon}
           <span className={styles.text}>{text}</span> 
    </div>
  )
}

