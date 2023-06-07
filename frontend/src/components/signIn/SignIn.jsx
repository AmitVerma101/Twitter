import React,{useState,useEffect, useContext} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import styles from './SignIn.module.css'
import Button from '../Button/Button'
import { ApiCall } from '../../middlewares/ApiCall'
import TwitterIcon from "@mui/icons-material/Twitter";
import AuthContext from '../../Context/AuthUser'
export default function SignIn() {

    const {user,setUser} = useContext(AuthContext);

    useEffect(() => {
        let test = async ()=>{
          
            let result = await ApiCall('http://localhost:4000/checkUserAuth')
            if(result.auth == true){
              setUser(result.body[0])
              
                  navigate('/')

               
            }
            setloading(false);
         }
         test();
       },[]);
    const navigate = useNavigate()
   async function login(){
       
        let result =await ApiCall('http://localhost:4000/login',{email:email,u_password:password})
        if(result.auth == true){
            localStorage.setItem("jwtToken",result.token);
            setUser(result.body[0])
            setTimeout(()=>{
            console.log("user verified");
            navigate('/')
          },300)
        }
        else {
            console.log("user is not verified")
            console.log(result.message);
            setMessage(result.message);
        }


    }

    //defining states
    const [message,setMessage] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [loading,setloading] = useState(true);
  return (
    <>
    {loading && <div className={styles.loader}><TwitterIcon className={styles.twitterIcon}/></div>}
    {!loading && <div className={styles.container}>
      <div className={styles.signIn}>
        <div>

            <input type="text" className={styles.input} onChange={(e)=>{setEmail(e.target.value)}} placeholder='Enter your email' />
            <input type="password" onChange={(e)=>{setPassword(e.target.value)}} placeholder='Password'  />
            <p style={{color:'red',fontSize:'14px'}}>{message}</p>
        </div>
        <div>
            <Button name='Log in' class='roundedButton' onclick={login}/>
            <p>Dont have an account <Link className={styles.link} to='/signup'>sign up</Link></p>
        </div>
      </div>
    </div>}
    </>
  )
}
