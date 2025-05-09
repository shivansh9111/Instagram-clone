import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './utils/db.js';
import userRoute from "./routes/user.routes.js"
import postroute from './routes/post.route.js'
import messageroute from './routes/message.routes.js'
dotenv.config({});

const app = express();
const PORT = process.env.PORT || 3000

app.get('/',(req,res)=>{
res.status(200)
.json({
  message: 'i am shivansh dwivedi full stack developer',
  success:true
})
})


//middleware
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended:true}))

const corsOptions= {
  origin: 'http://localhost:5173',
credentials:true
}
app.use(cors(corsOptions));

//making api
app.use("/api/v1/user",userRoute)
app.use('/api/v1/post',postroute)
app.use('/api/v1/message',messageroute)
// http://localhost:8080/api/v1/user/register



app.listen(PORT,()=>{
  connectDB();
  console.log(`server is running on ${PORT}`);
 
})