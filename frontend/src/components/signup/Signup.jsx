import React,{useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useState, useRef} from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ApiCall } from "../../middlewares/ApiCall";
import styles from "./Signup.module.css";
import Button from "../Button/Button";
import AuthContext from "../../Context/AuthUser";
import axios from "axios";


export default function Signup() {
  const {user,setUser} = useContext(AuthContext)
   
    const navigate = useNavigate();
    useEffect(() => {
       let test = async ()=>{
         
           let result = await ApiCall('http://localhost:4000/checkUserAuth')
           if(result.auth == true){
                navigate('/home')
           }
           setLoading(false);
        }
        test();
      },[]);
  async function formSubmit(event, value) {
    event.preventDefault();
    // console.log(u_name, email);
    console.log(isUname,isEmail)
    if (value == 1 && isUname && isEmail) {
      if(u_name.length!=0 && email.length!=0){

        let result = await ApiCall("http://localhost:4000/generateJwtToken", {
          u_name: u_name,
          email: email,
        });
        if (result.auth == false) {
          setMessage(result.message);
        } else {
          localStorage.setItem("jwtToken", `${result.token}`);
          setStep(step + 1);
        }
      }
    }
    if (value == 2) {
      setMessage("");
      setStep(step + 1);
    }
    if (value == 3) {
      let result = await ApiCall("http://localhost:4000/verificationCode");
      if (result.auth == false) {
        setMessage(result.message);
      } else {
        localStorage.setItem("jwtToken", `${result.token}`);
        setStep(step + 1);
      }
    }
    if (value == 4) {
      let result = await ApiCall("http://localhost:4000/verifyCode", {
        code: code,
      });
      if (result.auth == false) {
        setMessage(result.message);
      } else {
        setStep(step + 1);
      }
    }
    if (value == 5 && isPassword) {
      if(isPassword.length!=0){

        let result = await ApiCall("http://localhost:4000/signup", {
          u_password: password,u_name:u_name,email:email
        });
        if (result.auth == true) {
          setStep(step + 1);
        }
        else {
          setMessage(result.message)
        }
      }
    }
    if (value == 6) {
      // console.log("Hello in the profile point");

      setStep(step + 1);
    }
    if (value == 7) {
      // console.log(u_name, email, password, username);
      if(username.length!=0){

        let result = await ApiCall("http://localhost:4000/validateUsername", {
          username: username,
        });
        if (result.auth == true) {
         
          const formData = new FormData();
          formData.append("image", image);
          formData.append("username", username);
          formData.append("email", email);
          axios
            .post("http://localhost:4000/fillDetails", formData)
            .then((response) => {
              // console.log("consoling the response");
              // console.log(response);
              if (response.data.auth == true) {
                // console.log("I am coming here");
                setUser(response.data.body);
                setTimeout(()=>{
                  navigate("/");
                },600);
              } else {
                // console.log("I am coming in the else block");
                setMessage(auth.message);
              }
            })
  
            .catch((error) => {
              console.log("I am coming in catch of inner");
              console.log(error);
            });
        } else {
          console.log("I am in catch of outer ");
          setMessage("Username already exists");
        }
      }
    }
  }
  function selectProfilePic() {
    input.current.click();
  }
  function uploadValue() {
    // console.log("here");
    // console.log(input.current.files[0]);
    let url = URL.createObjectURL(input.current.files[0]);
    setImage(input.current.files[0]);
    setProfilePic("");
    setStyle({
      width: "200px",
      height: "200px",
      background: `URL(${url})`,
      borderRadius: "50%",
      backgroundSize: "cover",
      backgroundPosition:'center'
    });
    setButtonName("next");
  }
  //defining the ref
  const input = useRef();
  //defining the states
  let U_nameRegex = /^[A-Za-z]+(\s[A-Za-z]+)?$/
  let EmailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
  let [isUname,setIsuname] = useState(true);
  let [isEmail,setIsemail] = useState(true);
  let [isPassword,setIspassword]=useState(true);
  const [step, setStep] = useState(1);
  const [u_name, setU_name] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [buttonName, setButtonName] = useState("Skip For Now");
  const [image, setImage] = useState("");
  const [loading,setLoading] =useState(true)
  const [profilePic, setProfilePic] = useState(
    <AccountCircleIcon style={{ width: "200px", height: "200px" }} />
  );
  let [style, setStyle] = useState({
    color: "#ccc",
    cursor: "pointer",
    width: "200px",
    height: "200px",
    backgroundSize:"cover !important"
  });

  const [username, setUsername] = useState("");
 
  
    // console.log("How are you running")
    
      
      // isEmail = 
  
function cmpRegex(a,b){
  if(b == 1){
    setIsuname(U_nameRegex.test(a)?true:false) 
  }
  else if(b == 2){
    setIsemail(EmailRegex.test(a)?true:false)
  }
  else if(b == 3){
    setIspassword(passwordRegex.test(a)?true:false);
  }
}

  function setValue(a,b){
  if(b == 1){
    setU_name(a);
    cmpRegex(a,b);
  }
  else if(b == 2){
    setEmail(a);
    cmpRegex(a,b);
  }
  else if(b == 3){
    setPassword(a);
    cmpRegex(a,b);
  }
  setMessage('')
 }
  return (
    <>
     {loading && <div className={styles.loader}><TwitterIcon className={styles.twitterIcon}/></div>}
     {!loading && <div className={styles.container}>
        <div className={styles.innerContainer}>
          {step <= 5 && <h2>Step {step} of 5</h2>}
         
          {step == 1 && (
            <div className={styles.wrapper}>
              <h1>Create your account</h1>
              <form
                onSubmit={(e) => {
                  formSubmit(e, 1);
                }}
              >
                <div>
                <div style={{height:'60px'}}>

                <input
                  type="text"
                  value={u_name} style={{margin:'0',marginTop:'10px'}}
                  onChange={(event) => {setValue(event.target.value,1)}}
                 
                  placeholder="Name"
                 
                />
                {!isUname && (<p style={{margin:'0px',color:'red'}}>invalid name</p>)}
                </div>
                <div style={{height:'60px'}}>

                <input
                  type="text"
                  style={{margin:'0',marginTop:'10px'}}
                  value={email}
                  onChange={(event) => {
                    setValue(event.target.value,2);
                  }}
                  placeholder="Email"
                />
                 {!isEmail && (<p style={{margin:'0px',color:'red'}}>invalid Email</p>)}
                <p style = {{color:'red'}}>{message}</p>
                </div>
                </div>
                <Button name="Next" class="roundedButton" disabled  = {u_name.length==0 || email.length==0} />
              </form>
            </div>
          )}
          {step == 2 && (
            <div className={styles.secondPart}>
              <div>
              <h1>Customize your experience</h1><br/>
              <h3>Track where you see Twitter content across the web</h3><br/>
              <p>
                Twitter uses this data to personalize your experience. This web
                browsing history will never be stored with your name, email, or
                phone number.
              </p>
              <p>
                By signing up, you agree to our Terms, Privacy Policy, and
                Cookie Use. Twitter may use your contact information, including
                your email address and phone number for purposes outlined in our
                Privacy Policy. Learn more
              </p>
              </div>
              <Button
                name="Next"
                class="roundedButton"
                onclick={(e) => {
                  formSubmit(e, 2);
                }}
              />
            </div>
          )}

          {step == 3 && (
            <div className={styles.thirdPart}>
              <form>
                <input type="text" value={u_name} onFocus={() => setStep(1)} />
                <input type="text" value={email} onFocus={() => setStep(1)} />
              </form>
              <Button
                name="signUp"
                class="roundedButton"
                onclick={(e) => formSubmit(e, 3)}
              />
            </div>
          )}
          {step == 4 && (
            <div className={styles.forthPart}>
              <div>
                <h1>We sent you a code</h1>
                <p>Enter it below to verify {email}.</p>
                <input
                  type="text"
                  placeholder="Verification Code"
                  onChange={(e) => setCode(e.target.value)}
                />
                <p>{message}</p>
              </div>
              <Button
                name="next"
                class="roundedButton"
                onclick={(e) => formSubmit(e, 4)}
              />
            </div>
          )}
          {step == 5 && (
            <div className={styles.fifthPart}>
              <div>
              <h1>You'll need a password</h1>
              <p>Make sure it’s 8 characters or more.</p>
              <input
              style = {{margin:'0',marginTop:'10px'}}
                type="password"
                value={password}
                onChange={(e) => {
                  setValue(e.target.value,3);
                }}
              />
              {!isPassword && <p style={{color:'red'}}>invalid password</p>}
              </div>
              <Button
                name="next"
                disabled = {password.length == 0?true:false}
                onclick={(e) => {
                  formSubmit(e, 5);
                 
                }}
                class="roundedButton"
              />
            </div>
          )}
          {step == 6 && (
            <div className={styles.sixthPart}>
              <div>
                <span>
                  <TwitterIcon className={styles.twitterIcon}/>
                </span>
                <div className={styles.centerIt}>

                <h1>Pick a profile picture</h1>
                <p>Have a favorite selfie? Upload it now.</p>
                </div>
              </div>
              <div style={{ display: "none" }}>
                <input type="file" ref={input} onChange={uploadValue} />
              </div>

              <span onClick={selectProfilePic} style={style}>
                {profilePic}{" "}
              </span>

              <Button
                name={buttonName}
                class="roundedButton"
                onclick={(e) => {
                  formSubmit(e, 6);
                }}
              />
            </div>
          )}
          {step == 7 && (
            <div className={styles.seventhPart}>
              <div className={styles.seventh}>
                <span>
                  <TwitterIcon className={styles.twitterIcon}/>
                </span>
                <div>
                  <h1>What should we call you?</h1>
                  <p>
                    Your @username is unique. You can always change it later.
                  </p>
                </div>
                <div className={styles.seventhInnerPart}>
                  <span>@</span>
                  <input
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    style={{ margin: "0", border: "none" }}
                  />
                </div>
                  <p>{message}</p>
              </div>
              <Button
                name="next"
                class="roundedButton"
                onclick={(e) => {
                  formSubmit(e, 7);
                }}
              />
            </div>
          )}
        </div>
      </div>
}
    </>
  );
}
