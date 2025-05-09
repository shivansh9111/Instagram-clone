import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/Button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
function Signup() {

  const[input,setInput]=useState({
    username:'',
    email:'',
    password:''
  });

  const changeEventHandler = (e)=>{
setInput({...input,[e.target.name]:e.target.value})
  }

  const[loading,setLoading]=useState(false)
  const navigate=useNavigate()
  const signuphandler = async(e) =>{
  e.preventDefault();
  console.log(input);
  try {
    setLoading(true)
    const res = await axios.post('http://localhost:8080/api/v1/user/register' , input, {
      headers:{
        'Content-Type':'application/json'
      }, withCredentials:true
    });
    if(res.data.success){
      navigate('/login')
      toast.success(res.data.message)
      setInput({
        username:'',
        email:'',
        password:''
      })
    }
    
  } catch (error) {
    console.log(error);
    toast.error(error.res.data.message) 
  } finally{
    setLoading(false)
  }

  }
  
  
  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={signuphandler}
        className="shadow-lg flex flex-col gap-5 p-8 shadow-black font-bold"
      >
        <div className="my-5">
          <h1 className="text-center font-extrabold">LOGO</h1>
          <p className="">signup to see your posts</p>
        </div>
        <div>
          <Label>username</Label>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent m-2"
          />
        </div>
        <div>
          <Label>email</Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent m-2"
          />
        </div>
        <div>
          <Label>password</Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent m-2"
          />
        </div>
        {loading? (<Button><Loader2 className="mr-2 h-4 w-4 animate-spin"/>plesae wait</Button>):(<Button type="submit">Signup</Button>)}
        
        <span className="text-center">Already have an account ? <Link to="/login" className="text-blue-700">Login</Link></span>

      </form>
    </div>
  );
}

export default Signup;
