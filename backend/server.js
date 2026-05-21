import express from "express"
import axios from "axios"
import cors from "cors"
import session from "express-session"
import bodyParser from "body-parser"
import authRoutes from "./routes/authRoutes.js";
import predictRoutes from "./routes/predictRouter.js"
import profileRoutes from "./routes/profileRoute.js"
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors({
    origin: [
       "http://localhost:5173",
       "https://h-pred.vercel.app"
    ],
    credentials: true,
}));

app.use(session({
    resave:false,
    saveUninitialized: true,
    secret: process.env.SESSION_KEY,
    cookie: { secure: false },
}))
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("frontend"));
app.use("/api/auth", authRoutes);
app.use("/api",predictRoutes);
app.use("/api",profileRoutes);
app.get("/", (req, res) => {
  res.send("Backend API is running");
});
app.listen(port,()=>{
    console.log(`port running on ${port}`);
})