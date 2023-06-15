import React, { useState, useContext, useEffect } from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SidebarComponent from "./SidebarComponent";
import styles from "./Sidebar.module.css";
import TagIcon from "@mui/icons-material/Tag";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import AuthContext from "../../Context/AuthUser";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import { axiosApiCall } from "../../middlewares/axios";

export default function Sidebar() {
  const { user, setUser } = useContext(AuthContext);
  const [selected,setSelected] = useState(0);

  function logout(){
       setUser(null);
       localStorage.clear();
       navigate('/login');
  }
  
  const navigate = useNavigate();
  function profile(){
    setSelected(5);
      navigate(`/profile/${user.u_id}`)
  }
  function messages(){
    setSelected(4);
    navigate('/messages')
  }
  function notifications(){
    setSelected(3);
    navigate(`/notifications/${user.u_id}`);
  }
  function home() {
    // console.log("consoling in the home function");
    setSelected(1);
    navigate("/home");
  }
  // console.log(user.u_name);
    return (
      <>
        {user.u_name == undefined ? 
          <Navigate to={"/login"} />
         : 
          <>
            <div className={styles.container}>
              <TwitterIcon className={styles.TwitterIcon} />
              <NavLink to={'/home'} style={{textDecoration:'none',color:'black'}} >
                <div className={styles.element}><SidebarComponent
                icon={<HomeIcon className={styles.icon}/>}
                text="Home"
              /></div></NavLink>
              <NavLink to = '/explore' style={{textDecoration:'none',color:'black'}}>
              <div  className={`${styles.element}`}>
               <SidebarComponent icon={<TagIcon/>} text="Explore"  />
               </div>
              </NavLink>
              <NavLink to = {`/notifications/${user.u_id}`} style={{textDecoration:'none',color:'black'}}>
                <div  className={`${styles.element}`}>
             
              <SidebarComponent
                icon={<NotificationsNoneIcon className={styles.icon}/>}
                text="Notifications" onclick = {notifications}
              />
                </div>
              </NavLink>
              <NavLink to = {`/messages`} style={{textDecoration:'none',color:'black'}}>
                <div  className={styles.element}> 
              <SidebarComponent icon={<MailOutlineIcon className={styles.icon}/>} text="Messages" onclick={messages}/>
                </div>
              </NavLink>
              <NavLink to = {`/profile/${user.u_id}`} style={{textDecoration:'none',color:'black'}}>
                <div  className={styles.element}>
              <SidebarComponent icon={<PermIdentityIcon className={styles.icon}/>}  text="Profile" />
                </div>
              </NavLink>
              {/* <SidebarComponent icon={<MoreHorizIcon />} text="More" /> */}
              <div onClick={logout}>
              {user!= undefined && user.profilepic!= undefined && user.profilepic!=''?<div className={styles.logout}><div className={styles.profilepic} style={{background:`URL(http://localhost:4000/${user.profilepic})`}}></div>Logout</div>:<div className = {styles.logout}><AccountCircleIcon style = {{width:'50px',height:'50px',color:'#bbb'}}/>Logout</div>}
              </div>
            </div>
          </>
        }
      </>
    );
}
