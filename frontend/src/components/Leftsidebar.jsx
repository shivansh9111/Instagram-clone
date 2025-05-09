import { setAuthUser } from "@/redux/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import {
  Heart,
  Home,
  Icon,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  Settings,
  Text,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Createpost from "./Createpost";





function Leftsidebar() {
 const [open,setOpen]= useState(false)
  const dispatch = useDispatch()
  const navigate=useNavigate();
  const {user}=useSelector((state)=>state.auth)
  



  const sidebarhandler = (Texttype)=>{
  if(Texttype === 'logout'){logoutHandler();}
    else if (Texttype=== 'Create'){
    setOpen(true)
  }
  
  }
  

const logoutHandler = async ()=>{
try {
  const res = await axios.get('http://localhost:8080/api/v1/user/logout',{withCredentials:true})
  if(res.data.success){
    dispatch(setAuthUser(null))
    navigate('/login');
    toast.success(res.data.message)
  }
} catch (error) {
  toast.error(error.response.data.message);
}
}




const siderbaritems = [
  { icon: <Home />, Text: "Home" },
  { icon: <Search />, Text: "search" },
  { icon: <TrendingUp />, Text: "trendingUp" },
  { icon: <MessageCircle />, Text: "Messages" },
  { icon: <Heart />, Text: "Notifications" },
  { icon: <PlusSquare />, Text: "Create" },
  { icon: <Settings />, Text: "settings" },
  { icon: <LogOut />, Text: "logout" },
  {
    icon: (
      <Avatar className="w-6 h-6 rounded-3xl">
        <AvatarImage
       
          src={user?.profilePicture}
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    Text: "profile",
  },
];

  return (
    <div className="fixed flex bottom-8 left-5 px-4 border-r border-gray-300  h-screen">
      <div className="flex flex-col py-2">
        <h1 className="my-6 pl-4 font-bold text-xl">Instagram</h1>
        <div>
        {siderbaritems.map((item, index) => {
          return (
            <div onClick={()=>sidebarhandler(item.Text)}
              key={index}
              className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3   "
            >
              {item.icon}
              <span>{item.Text} </span>
            </div>
          );
          
        })}
        </div>
      </div>
      <Createpost open={open} setOpen={setOpen}/>
    </div>
  );
}

export default Leftsidebar;
