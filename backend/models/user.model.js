import mongoose, { Schema } from "mongoose"

const userSchema= new Schema({

  username:{type:String,required:true},
  email:{type:String,required:true,unique:true},
  password:{type:String,required:true,unique:true},
  profilePicture:{type:String,required:""},
  bio:{type:String,required:false},
  gender:{type:String,enum:['Male','Female']},
  followers:[{type: mongoose.Schema.Types.ObjectId , ref:'User'}],
  following:[{type: mongoose.Schema.Types.ObjectId , ref:'User'}],
  posts:[{type: mongoose.Schema.Types.ObjectId , ref:'Post'}],
  saved:[{type: mongoose.Schema.Types.ObjectId , ref:'Post'}]
},{timestamps:true});



export const User = mongoose.model('User',userSchema)