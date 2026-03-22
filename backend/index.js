import 'dotenv/config'
import express from 'express'
import userRouter from './routes/user.routes.js'
import { authenticationMiddleware } from './middlewares/auth.middleware.js'
import urlRouter from './routes/url.routes.js'
import cors from "cors";

const app = express()
   const corsOptions = {
     origin: function (origin, callback) {
       const allowedOrigins = [
         'https://snip-link-tau.vercel.app',
         'http://localhost:3000'
       ];
       
       if (allowedOrigins.includes(origin) || !origin) {
         callback(null, true);
       } else {
         callback(new Error('CORS not allowed'));
       }
     },
     credentials: false,
     optionsSuccessStatus: 200,
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization']
   };
   
   // Apply CORS middleware BEFORE other middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT ?? 8000

app.get('/',(req,res)=>{
    return res.json({status : "Server is up and running..."})
})

app.use('/user',userRouter);

app.use(authenticationMiddleware);
app.use(urlRouter)

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
})