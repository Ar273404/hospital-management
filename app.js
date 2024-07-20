import express from 'express';
import { config } from 'dotenv';
import cors from "cors";
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { dbConnection } from './database/dbConnection.js';
import messageRouter from './router/messageRouter.js';
import userRouter from './router/userRouter.js'
import appointmentRouter from './router/appointmentRouter.js';
import { errorMiddleware } from './middleware/error.js';


const app = express();

app.get('/',(req,res)=>{
  res.send('hello Welcome to Arun Hospital Management!')
})
config({path:"./config/config.env"});

app.use(
  cors({
    origin: [process.env.FRONTED_URL, process.env.DASHBOARD_URL],
    method:["GET","POST","PUT","DELETE"],
    credentials:true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/",
  })
);

app.use("/message", messageRouter);
app.use("/user",userRouter);
app.use("/appointment",appointmentRouter)

dbConnection();

app.use(errorMiddleware);

export default app;