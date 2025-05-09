import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/Button";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";
import { toast } from "sonner";

function Post({ post }) {
  const [text, setText] = useState("");

  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const dispatch = useDispatch();

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8080/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      console.log(res.data);
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        // from here to update the likes of the post in the real time
        const updatedPostdata = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostdata));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.data.response.message);
    }
  };

  const changeEventHandler = (e) => {
    const inputtext = e.target.value;
    if (inputtext.trim()) {
      setText(inputtext);
    } else {
      setText("");
    }
  };

  const commentPostHandler =  async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/post/${post?._id}/comment`,{text},{
        Headers: {
          'Content-type': 'application/json'
        },
        withCredentials:true
      });
      if(res.data.message){
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedPostData = posts.filter((postitem) => {
          postitem?._id !== post?._id;
        });
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="my-8 w-full max-w-sm ">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>{post.author?.username}</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit font-bold text-[#ED4956]"
            >
              unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit ">
              add to favoraites
            </Button>

            {user && user?._id === post?.author._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="cursor-pointer w-fit "
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="w-full my-2 rounded-sm aspect-square object-cover"
        src={post.image}
        alt="post_image"
      />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3 ">
          {liked ? 
            <FaHeart
              size={"22"}
              className="  cursor-pointer text-red-600 "
              onClick={likeOrDislikeHandler}
            />
           : 
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              className=" rounded cursor-pointer"
              size={"22"}
            />
          }

          <MessageCircle
            onClick={() => {
              setOpen(true);
            }}
            className="cursor-pointer hover:bg-gray-500"
          />
          <Send />
        </div>
        <Bookmark className="cursor-pointer hover:bg-gray-500" />
      </div>
      <span className="font-medium block mb-2">{postLike}likes</span>
      <p>
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
      </p>
      <span
        onClick={() => {
          setOpen(true);
        }}
        className="cursor-pointer text-sm text-gray-600"
      >
        {post.comment?.length}comments
      </span>
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          onChange={changeEventHandler}
          placeholder="enter your comment..."
          className="outline-none text-sm w-full"
        />
        {text && <span className="text-[#3BADF8]">post</span>}
      </div>
    </div>
  );
}

export default Post;
