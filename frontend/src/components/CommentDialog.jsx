import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { MoreHorizontal } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function CommentDialog({ open, setOpen }) {

const[text,setText]=useState("")

const changeEventhandler = (e) =>{
const inputtext=e.target.value
if(inputtext.trim()){
  setText(inputtext)
}else{
  setText('')
}
}
const sendMessageHandler = async () => {
alert(text)
}
  return (
    <Dialog open={open}>
      <DialogContent
        className="flex flex-col max-w-5xl p-0 "
        onInteractOutside={() => {
          setOpen(false);
        }}
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoks7bpRMv-iKE96JebrvRdtdyo6yHjeB2fw&s"
              alt="post_image"
              className="w-full h-full rounded-l-lg object-cover"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src=""></AvatarImage>
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-sm "> Username</Link>
                  {/* <span className="text-gray-600 text-sm"> bio here...</span> */}
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="cursor-pointer w-full font-bold text-red-500 flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full font-bold text-red-500  ">
                    unfollow
                  </div>

                  <div className="cursor-pointer w-full flex   ">
                    add to favorites
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              all comments visible here
            </div>
            <div className="p-4"></div>
            <div className="flex items-center gap-5">
              <input
                type="text"
                value={text}
                onChange={changeEventhandler}
                placeholder="add a comment..."
                className="w-full outline-none border border-gray-300 p-2"
              />
            <button disabled={!text.trim()} onClick={sendMessageHandler}variant='outline'>Send</button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;
