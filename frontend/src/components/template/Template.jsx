import React,{useState} from 'react'
import Message from '../Messages/Message';
import Chat from '../Messages/Chat';
export default function Template(props) {
    let [passingVal,setPassingVal] = useState('amit');
    const [FocusSearchBar,setFocusSearchBar] = useState(null)
  return (
    <>
      <div className="secondMessageChild">
            <Message passingVal = {passingVal} setPassingVal = {setPassingVal} focusSearchBar = {FocusSearchBar} setFocusSearchBar = {setFocusSearchBar}/>
        </div>
        <div className="firstMessageChild">
            <Chat passingVal = {passingVal} setPassingVal = {setPassingVal}
            focusSearchBar = {FocusSearchBar} setFocusSearchBar = {setFocusSearchBar}/>
        </div>
        </>
  )
}
