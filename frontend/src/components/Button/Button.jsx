import React from 'react'

import './Button.css'
export default function Button(props) {
  // console.log("Consoling the button props")
  let c;
  if(props.selected!=undefined){
    // console.log("consoling the props.class")
    // console.log(props.class)
    if(props.selected == 'border'){
         c = `${props.class} ${props.selected} center`
    }
    else {
    c = `${props.class}`
    }
  }
  // console.log(props)
  return (
   <>
   <button className={props.class} onClick={props.onclick} style={{...props.style}} disabled={props.disabled}><p className={c} >{props.name}</p></button>
   </>
   
  )
}
