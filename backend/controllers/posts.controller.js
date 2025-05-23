import sharp from "sharp";
import cloudinary from "cloudinary";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

export const addnewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;
    if (!image) {
      return res.status(401).json({ message: "image is required" });
    }
    // image upload
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();
    //converting buffer to datauri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    console.log(fileUri);
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }
    await post.populate({ path: "author", select: "-password" });
    return res
      .status(200)
      .json({ message: "new post added", post, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const getallPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 }, //nested populate
        populate: { path: "author", select: "username profilePicture" },
      });
    return res.status(201).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getuserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });
    return res.status(200).json({ posts, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const likekrnewlauserid = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "post not found ",
        success: false,
      });
    }
    // like logic
    await post.updateOne({ $addToSet: { likes: likekrnewlauserid } });
    await post.save();

    // yet to implement socket.io for real time notification

    return res.status(201).json({ message: "post liked", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const dislikePost = async () => {
  try {
    const dislikekrnewlauserid = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: true,
      });
    }
    await post.updateOne({ $pull: { likes: dislikekrnewlauserid } });
    await post.save();
    return res.status(201).json({
      message: "Post disliked successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const commentorkiid = req.id;
    const postId = req.params.id;
    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!text) {
      return res
        .status(400)
        .json({ message: "text field is required", success: false });
    }
    const comment = await Comment.create({
      text,
      author: commentorkiid,
      post: postId,
    }).populate({ path: "author", select: "username profilePicture" });

    post.comments.push(comment._id);
    await post.save();
    return res
      .status(200)
      .json({ message: "comment added successfully", comment, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const getCommentsOfPostsofanyuser = async (req, res) => {
  try {
    const postId = req.params.id;
    const comment = await Comment.find({ post: postId }).populate(
      "author",
      "username",
      "profilePicture"
    );
    if (!comment) {
      res
        .status(404)
        .json({ message: "no comments found for this post", success: false });
    }
    return res
      .status(200)
      .json({ message: "comment added successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const auhtorid = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "post not found", success: false });
    }
    // check if logged in user is owner of the post
    if (post.author.toString() !== auhtorid) {
      return res.status(404).json({ message: "unauthorized user" });
    }
    // delete post
    await Post.findByIdAndDelete(postId);

    // remove the postid from the user posts
    let user = await User.findById(postId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    // delete associated comment with this post

    await Comment.deleteMany({ post: postId });
    return res.status(201).json({ message: "post deleted", success: true });
  } catch (error) {}
};

export const bookmarkedPosts = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      // already bookmarked => remove from the bookmarked
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({
          type: "unsaved",
          message: "post removed from bookmarked",
          success: true,
        });
    } else {
      // bookmarking the post
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({
          type: "saveds",
          message: "post added to bookmarked",
          success: true,
        });
    }
  } catch (error) {
    console.log(error);
  }
};
