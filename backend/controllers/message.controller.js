import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

export const sendMessage = async(req,res) => {
try {
  const senderId = req.id;
  const receiverId= req.params.id;
  const {message} = req.body;

  let conversation = await Conversation.findOne({participants:{$all:[senderId,receiverId]}})
// establish the conversation if not started
if(!conversation){
  conversation = await Conversation.create({
    participants:[senderId,receiverId]
  })
}
const newmessage = await Message.create({
  senderId,
  receiverId,
  message
})
if(newmessage) conversation.messages.push(newmessage._id)
// await conversation.save();
// await newmessage.save();
//insted use promise all
await Promise.all([conversation.save(),newmessage.save()])
//yet to implement socket.io for real time data transfer or notification
return res.status(201)
.json({success:true,newmessage})

} catch (error) {
  console.log(error);
}
}

export const getMessage = async (req,res) => {
try {
  const senderId = req.id;
  const receiverid = req.params.id;
  const conversation = await Conversation.find({
    participants:{$all:[senderId,receiverid]}
  })
  if(!conversation) return res.status(200).json({success:true,messages:[]})

    return res.status(200)
    .json({success:true,messages:conversation?.messages})
} catch (error) {
  console.log(error);
}
}