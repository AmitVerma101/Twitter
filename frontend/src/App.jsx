import React, { useEffect, useState } from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import "./App.css";
import Sidebar from "./components/sidebar/Sidebar";
import "./App.css";
import Feed from "./components/Feed/Feed";

import { Outlet } from "react-router-dom";
import Explore from "./components/Explore/Explore";
import SignIn from "./components/signIn/SignIn";
import Signup from "./components/signup/Signup";
import Notification from "./components/Notification/Notification";
import TweetDescription from "./components/tweetDescription/TweetDescription";
import {
  createBrowserRouter,
  RouterProvider,
 
} from "react-router-dom";
import Profile from "./components/Profile/Profile";
import AuthContext from "./Context/AuthUser";
import { axiosApiCall } from "./middlewares/axios";
// import Message from "./components/Messages/Message";
// import Chat from "./components/Messages/Chat";
import Template from "./components/template/Template";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="container">
       
        <div className="firstElement">
        <Sidebar />

        </div>
        
       <div className="secondElement" >
        <Outlet />
       </div>
      </div>
    ),
    children: [
      {
        path: "home",
        element: (
          <>
            {/* creating the second element feed */}
            <div className="firstChild">
            <Feed />
            </div>

            {/* creating the third element */}
            <div className="secondChild">
            <Explore />
            </div>
          </>
        ),
      },
      {
        path: "tweetDescription/:t_id",
        element: (
          <>
          <div className="firstChild">
            <TweetDescription />
          </div>
          <div className="secondChild">
            <Explore />
          </div>
          </>
        ),
      },
      {
        path: "profile/:u_id",
        element: (
          <>
          <div className="firstChild">

            <Profile />
          </div>
          <div className="secondChild">
            <Explore />
          </div>
          </>
        ),
      },
      {
        
        path: "notifications/:u_id",
        element: (
          <>
          
          <div className="firstChild">
            <Notification />
        </div>
        <div className="secondChild">
            <Explore />
        </div>
          </>
        ),
      },
      {
        path: "messages",
        element: (
          <>
         <Template/>
          </>
        ),
      }
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <SignIn />,
  },
  {},
]);

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  useEffect(() => {
    const test = async () => {
      let formData = new FormData();
      let result = await axiosApiCall(
        "http://localhost:4000/checkUserAuth",
        formData
      );
      if (result.data.auth == true) {
        setUser(result.data.body[0]);
        setLoading(false);
      } else {
        console.log("An error occurs while setting the context");
        console.log(user);
        setLoading(false);
      }
    };
    test();
  }, []);

  if (loading) {
    return <TwitterIcon className="twitterIcon"/>;
  } else {
    return (
      <>
        <AuthContext.Provider value={{ user, setUser }}>
          <RouterProvider router={router} />
        </AuthContext.Provider>
      </>
    );
  }
}

export default App;
