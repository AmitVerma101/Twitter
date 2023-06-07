import React, { useEffect, useContext ,useState } from "react";
import styles from "./Chat.module.css";
import io from "socket.io-client";
import Button from "../Button/Button";
import AuthContext from "../../Context/AuthUser";
import SendIcon from "@mui/icons-material/Send";
import ChatContainer from "./ChatContainer";
import { axiosApiCall } from "../../middlewares/axios";
export default function Chat(props) {
  const [messages,setMessages] =useState([])
  
  // setMessages(arr)
  const { user, setUser } = useContext(AuthContext);
  const [msg,setMsg] = useState('');
 async function sendMessage() {
    const socket = io('http://localhost:4000')
    const formData = new FormData()
    formData.append('s_id',user.u_id)
    formData.append('r_id',props.passingVal.u_id)
    formData.append('msg',msg);
    const result = await axiosApiCall('http://localhost:4000/setMessage',formData);
    if(result.data.auth == true){
      socket.emit('send_msg',{from:result.data.body[0].sender,to:result.data.body[0].receiver,msg:result.data.body[0].msg})
      setMessages([...messages,{message:msg,self:true,m_id:result.data.body[0].m_id}])
    }
   


    setMsg('');
  }
  useEffect(() => {
   
    const test = async() => {
      console.log("consoling the receiver id ")
      console.log(props.passingVal);
      if(props.passingVal != "amit") {
        const formData = new FormData()
        formData.append('s_id',user.u_id)
        formData.append('r_id',props.passingVal.u_id);
          let result = await axiosApiCall('http://localhost:4000/getMessages',formData)
          if(result.data.auth == true){
            let arr = []
            for(let i=0;i<result.data.body.length;i++){
              console.log("I am into the for loop");
              if(result.data.body[i].sender == user.u_id){
                arr.push({message:result.data.body[i].msg,self:true,m_id:result.data.body[i].m_id});
              }
              else {
                arr.push({message:result.data.body[i].msg,self:false,m_id:result.data.body[i].m_id});
              }
            }
            setMessages(arr)
          }
      }
    };
    test();
  }, [props.passingVal]);

  
    const socket = io("http://localhost:4000");
    socket.emit("add-user", user.u_id);

    socket.on("recieve-message", (data) => {
      let msg = {message:data,self:false,m_id:(100+Math.random()*100)};
      let temp = [...messages];
      temp.push(msg)
      console.log("consoling the value of temp");
      console.log(temp)
      console.log("consoling the messages")
      console.log(messages)
      setMessages([...messages,msg]);
      console.log(data);
    
   
    // return () => {
    //   socket.emit("disconnect", user.u_id);
    //   socket.close();
    // };
  }, []);

  function focusOnSearchBar() {
    props.focusSearchBar.current.focus();
  }
  return (
    <div className={styles.container}>
      {props.passingVal != "amit" ? (
        <div className={styles.mainContainer}>
          <div>
            <div className={styles.outerContainer}>
            <div className = {styles.profilepic} style={{background:`URL(http://localhost:4000/${props.passingVal.profilepic})`}}>
           </div>
           <p>{props.passingVal.u_name}</p> 
           <p>@{props.passingVal.username}</p>  
            </div>
            
            
          </div>
          <ChatContainer messages= {messages}/>
          <div className={styles.inputBox}>
            <input type="text" value={msg} onChange={(e)=>{setMsg(e.target.value)}} placeholder="start Chat" />
            <SendIcon onClick={sendMessage} />
          </div>
        </div>
      ) : (
        <div>
          <h1>Select a message</h1>
          <p>
            Choose from your existing conversations, start a new one, or just
            keep swimming.
          </p>
          <Button
            name="New Message"
            class="roundedButton fit"
            onclick={focusOnSearchBar}
          />
        </div>
      )}
    </div>
  );
}
