import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import React, { useRef, useState } from "react";
import { DialogHeader } from "./ui/Dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "./ui/Textarea";
import { readFileAsDataUrl } from "@/lib/utils";
import { Button } from "./ui/Button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
const Createpost=({ open, setOpen }) => {
  const imageRef = useRef();

  const [file, setFile] = useState("");

  const [caption, setcaption] = useState("");

  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);

  const {user} = useSelector((store)=>store.auth);

  const {posts} = useSelector((store)=>store.post)

  const dispatch = useDispatch();

  const fileChangehandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const datauri = await readFileAsDataUrl(file);
      setImagePreview(datauri);
      console.log(datauri);
    }
  };

  const createPostHandler = async (e) => {
   const formData = new FormData();
   formData.append("caption",caption);
   if(imagePreview) formData.append("image", file)

    try {
      setLoading(true)
      const res = await axios.post("http://localhost:8080/api/v1/post/addpost" , formData , {
        headers:{
          "Content-Type":'multipart/form-data'
        },
        withCredentials:true
      });

      if(res.data.success){
        dispatch(setPosts([res.data.post,...posts]))
        toast.success(res.data.message)
        setOpen(false)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
    finally{
      setLoading(false)
    }
  };
  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="font-semibold"> Create new post </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            {console.log(user)}
            <AvatarImage  className="w-20"src={user?.profilePicture} alt="img_in"></AvatarImage>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="font-bold text-xs"> {user?.username}
            <span className=" text-gray-500 font-bold text-xs">
              bio here ...
            </span>
          </div>
        </div>
        <Textarea value={caption} onChange={(e)=>{setcaption(e.target.value)}}
          className="focus-visible:ring-transparent border-none"
          placeholder="write a caption"
        />
        {imagePreview && (
          <div className="w-full h-64 flex items-center justify-center">
            <img
              src={imagePreview}
              alt="preview_img"
              className="object-cover h-full w-full rounded-md"
            />
          </div>
        )}
        <input ref={imageRef} type="file" className="hidden" onChange={fileChangehandler} />
        <Button
          onClick={() => imageRef.current.click()}
          onChange={fileChangehandler}
          className="w-fit mx-auto bg-[#0095f6] hover:bg-[#0095f6]"
        >
          select from computer
        </Button>
        {imagePreview &&
          (loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              please wait
            </Button>
          ) : (
            <Button onClick={createPostHandler} type="submit" className="w-full" >Post</Button>
          ))
          }
      </DialogContent>
    </Dialog>
  );
}

export default Createpost;
