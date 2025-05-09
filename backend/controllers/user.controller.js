import { User } from "../models/user.model.js";
import bcypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import  cloudinary  from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(401)
        .json({ message: "all fields are required", success: false });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(401)
        .json({ message: "email is already registered", success: false });
    }
    const encryptedPassword = await bcypt.hash(password, 10);
    await User.create({
      username,
      email,
      password:encryptedPassword,
    });
    return res
      .status(200)
      .json({ message: "account successfully created", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req,res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401)
        .json({ message: "please fill the required fields", success: false });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "incorrect email or password", success: false });
    }
    const isPasswordMatch = await bcypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(403)
        .json({ message: "password is incorrect", success: false });
    }

    const token = await jwt.sign({ userId:user.id ,}, process.env.SECRET_KEY,{ expiresIn:"10d" } );
   // populate each post if in the posts array
   const populatedPosts = await Promise.all(
    user.posts.map(async(postId)=>{
     const post =  await Post.findById(postId);
     if(post.author.equals(user._id)){
      return post
     }
     return null
    })
   )
   
    user = {
      id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
    };
    

    
    
     res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxage: 1 * 24 * 60 * 60 * 1000,
      })
      .json({ message: `welcome back ${user.username}${user.id}`, success: true, user 
      });
    
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req,res) => {
  try {
    return res.cookie('token',"", { maxage:0 })
      .json({ message: "logout successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req,res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).select('-password');
    return res.status(200).json({ user, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const editprofile = async (req,res) => {
  try {
    const userId = req.id
    
    const { bio, gender } = req.body;
    const profilePicture = req.file;

    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }
    const user = await User.findById(userId).select('-password');
   
    if (!user) {
      return res
        .status(404)
        .json({ message: "user not found", success: false });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;
    await user.save();
    return res
      .status(200)
      .json({ message: "profile updated", success: true, user });
  } catch (error) {
    console.log(error);
  }
};

export const suggestedUser = async (req, res) => {
  try {
    const suggestedUser = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUser) {
      return res
        .status(400)
        .json({ message: "currently do not have any users" });
    }
    return res.status(200).json({ success: true, users: suggestedUser });
  } catch (error) {
    console.log(error);
  }
};

export const followerFollowing = async (req, res) => {
  try {
    const followkrnewala = req.id;
    const jiskofollowkrunga = req.params.id;
    if (followkrnewala === jiskofollowkrunga) {
      return res.status(400).json({
        message: "you cant follow or unfollow yourself",
        success: false,
      });
    }
    const user = await User.findById(followkrnewala);
    const targetuser = await User.findById(jiskofollowkrunga);
    if (!user || !targetuser) {
      return res
        .status(400)
        .json({ message: "user not found", success: false });
    }
    //check krunga follow krna hai ya unfollow
    const isFollowing = user.following.includes(jiskofollowkrunga); //includes returns true
    if (isFollowing) {
      //unfollow logic ayega
      await Promise.all([
        User.updateOne(
          { _id: followkrnewala },
          { $pull: { following: jiskofollowkrunga } }
        ),
        User.updateOne(
          { _id: jiskofollowkrunga },
          { $pull: { followers: followkrnewala } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "unfollowed successsfully", success: true });
    } else {
      //follow logic ayega
      await Promise.all([
        User.updateOne(
          { _id: followkrnewala },
          { $push: { following: jiskofollowkrunga } }
        ),
        User.updateOne(
          { _id: jiskofollowkrunga },
          { $push: { followers: followkrnewala } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "followed successsfully", success: true });
    }
  } catch (error) {}
};
