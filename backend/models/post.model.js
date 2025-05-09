import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema({
  caption:{type:String,required:""},
  image:{type:String,required:true},
  author:{type:mongoose.Schema.Types.ObjectId, ref:'User' ,required:true},
  likes:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
  comments:[{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}],
  
},{timestamps:true});


export const Post = mongoose.model('Post',postSchema);