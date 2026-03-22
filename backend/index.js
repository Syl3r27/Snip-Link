import 'dotenv/config'
import express from 'express'
import userRouter from './routes/user.routes.js'
import { authenticationMiddleware } from './middlewares/auth.middleware.js'
import urlRouter from './routes/url.routes.js'
import cors from "cors";

const app = express()

app.use(cors({
  origin: [
    "https://snip-link-tau.vercel.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT ?? 8000

app.get('/', (req, res) => {
  return res.json({ status: "Server is up and running..." })
})

app.use('/user', userRouter);

app.use(authenticationMiddleware);
app.use(urlRouter)

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
})