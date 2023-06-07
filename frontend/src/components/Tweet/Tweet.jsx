import React, { useState, useRef } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styles from "./Tweet.module.css";
import CropOriginalIcon from "@mui/icons-material/CropOriginal";
import GifBoxIcon from "@mui/icons-material/GifBox";
import BallotIcon from "@mui/icons-material/Ballot";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Button from "../Button/Button";
import axios from "axios";
import { axiosApiCall } from "../../middlewares/axios";

export default function Tweet(props) {
  function hello() {
    selectImage.current.click();
    console.log("helo");
  }
  function findHashTags(){
    let temp = text;
    let arr = temp.split(' ');
    let regex = /^#([A-Z]|[a-z]|[0-9])+$/
    for(let i=0;i<arr.length;i++){
      let patternResult = regex.exec(arr[i]);

      if(patternResult!= null){
            hashTag.push(arr[i]);
      }
    }
  console.log("Consoling the value of the hashTags available")
  console.log(hashTag);
  }

  function tweet() {
    console.log("inside tweet");
    findHashTags();
    const formData = new FormData();
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    };
    if (props.t_id != undefined) {
      formData.append("t_id", props.t_id);
    } else {
      formData.append("t_id", null);
    }
    formData.append("mention", mention);
    formData.append("hashTag",hashTag);
    formData.append("image", img);
    formData.append("description", text);
    console.log(props.t_id, text, img);
    console.log(props.link);
    axios
      .post(props.link, formData, config)
      .then((response) => {
        setMention([])
        console.log("consoling the response");
        console.log(response);
        if (response.data.auth == true) {
          console.log("I am coming here");
          if (response.data.body != undefined) {
            console.log("consoling the props.tweet");
            console.log(props.tweet);
            if (props.tweet != undefined) {
              console.log("consoling the tweets")
              console.log(props.tweet);
              let arr = [...props.tweet];
              console.log()
              arr.unshift(response.data.body.body[0]);
              console.log("consoling the array after unshifting")
              console.log(arr)
              props.setTweet(arr);
            }
          }
          setText("");
          if (emoji == true) {
            setEmoji(false);
          }
          if (props.comment != undefined) {
            props.setComment(!props.comment);
          }
          setImage("");
          setImg("");
        } else {
          console.log("I am coming in the else block");
        }
      })

      .catch((error) => {
        console.log("I am coming in catch of inner");
        console.log(error);
      });
  }
  function pickEmoji() {
    setEmoji(!emoji);
  }
  function uploadValue() {
    console.log("here");
    console.log(selectImage.current.files[0]);
    let url = URL.createObjectURL(selectImage.current.files[0]);
    setImage(url);
    setImg(selectImage.current.files[0]);
    // setProfilePic('')
    // setStyle({width:'100px',height:'100px',background:`URL(${url})`,borderRadius:'50px',backgroundSize:'cover'})
    // setButtonName('next')
  }
  async function inputField(e) {
    setText(e.target.value);
    let ans = e.target.value.split(" ");
    console.log(ans[ans.length - 1], "FASFJASFAF ");
    // ans = e.target.value.substring(ans+1)
    // console.log(ans)
    // console.log(ans.length)
    ans = ans[ans.length - 1];
    let pattern = /\s@\w+|^@\w+/g;
    let hashPattern = /\s#\w+$|^#\w+$/g;
    let patternResult = pattern.exec(ans);
    let hashPatternResult = hashPattern.exec(ans);
    
    let formData = new FormData();
    if (patternResult != null) {
      formData.append("username", patternResult[0].substring(1));
      let result = await axiosApiCall(
        "http://localhost:4000/getUserNames",
        formData
      );
  
      console.log("consoling result");
      console.log(result);
      if (result.data.auth == true) {
        console.log(result);
        setUsername(result.data.body);
        console.log(username);
        setShowUsername(true);
        if (result.data.body.length == 0) {
          setShowUsername(false);
        }
      } else {
        console.log(result);
        setShowUsername(false);
      }
    } 
    else if(hashPatternResult!=null){
      //formData.append("username", patternResult[0].substring(1));
      formData.append("hashTag", hashPatternResult[0].substring(0))
      let result = await axiosApiCall(
        "http://localhost:4000/getHashTags",
        formData
      );
      console.log("consoling result");
      console.log(result);
      if (result.data.auth == true) {
        console.log(result);
        setHashTags(result.data.body);
       // setUsername(result.data.body);
       // console.log(username);
        setShowhashtag(true);
        if (result.data.body.length == 0) {
          setShowhashtag(false);
        }
      } else {
        console.log(result);
        setShowUsername(false);
      }
    }
    else {
      setShowUsername(false);
    }
  }
  const selectImage = useRef();
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState(false);
  const [mention, setMention] = useState([]);
  const hashTag = []
  let [img, setImg] = useState("");
  const [username, setUsername] = useState([]);
  const [hashTags,setHashTags] = useState([])
  const [showHashtag,setShowhashtag] = useState(false);
  const inp = useRef();
  const [showUsername, setShowUsername] = useState(false);
  const test = (val) => {
    console.log(val);
    // let temp = text.split(' ')[];
    // temp+=val.native
    setText(text + val.native);
    console.log(text);
  };
  function addUsername(value) {
    value = value.username;
    let arr = [...mention, value];
    console.log("consoling the arr of mentions");
    console.log(arr);
    setMention(arr);
    console.log("consoling the value");
    console.log(value);
    let temp = text.lastIndexOf("@");
    let ans = "";
    ans = text.substring(0, temp + 1);

    console.log("consoling the temp");
    console.log(temp);
    ans += value;

    setText(`${ans} `);
    inp.current.focus();
    setShowUsername(false);
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.firstDiv}>
          <div>
            <AccountCircleIcon className={styles.icon} />
          </div>
          <input
            type="text"
            ref={inp}
            value={text}
            placeholder="what's happening ?"
            onChange={inputField}
          />

          {showUsername && (
            <div className={styles.displayUser}>
              {username &&
                username.map((value) => {
                  return (
                    <>
                      <div
                        onClick={() => addUsername(value)}
                        style={{
                          border: "1px solid rgba(0,0,0,0.2)",
                          padding: "0.5rem",
                        }}
                      >
                        <p>{value.u_name}</p>
                       <p>{value.username}</p>
                      
                      </div>
                    </>
                  );
                })}
                {console.log(showHashtag)}
                 
            </div>
          )}
          {showHashtag && (<div className={styles.displayUser}>
          {hashTag &&
                hashTags.map((value) => {
                  return (
                    <>
                      <div id="hashId"
                        onClick={() => addUsername(value)}
                        style={{
                          border: "1px solid rgba(0,0,0,0.2)",
                          padding: "0.5rem",
                        }}
                      >
                        <p>{value.hashtag}</p>
                      </div>
                    </>
                  );
                })}
                </div>)}
          
        </div>
        <div>
          <input
            type="file"
            id={styles.selectImage}
            ref={selectImage}
            onChange={uploadValue}
          />

          <img src={image} className={styles.image} alt="" />
          <div className={styles.secondDiv}>
            <div className={styles.icons}>
              {/* <img className={styles.image} src={image}/> */}
              <CropOriginalIcon onClick={hello} className={styles.iconHover} />
              {/* <GifBoxIcon onClick={hello} className={styles.iconHover} /> */}
              {/* <BallotIcon onClick={hello} className={styles.iconHover} /> */}
              <EmojiEmotionsIcon
                onClick={pickEmoji}
                className={styles.iconHover}
              />
              {/* <ScheduleIcon onClick={hello} className={styles.iconHover} />
              <LocationOnIcon onClick={hello} className={styles.iconHover} /> */}
            </div>

            <Button name={props.name} class="roundedButton" onclick={tweet} />
          </div>
          {emoji && (
            <div className={styles.outerPicker}>
              <div className={styles.Picker}>
                <Picker data={data} onEmojiSelect={test} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
