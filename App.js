import express from "express";
import session from "express-session";
import Hello from "./Hello.js";
import morgan from "morgan";
import Lab5 from "./lab5.js";
import dotenv from 'dotenv';
import CourseRoutes from "./Kanbas/Courses/routes.js";
import ModuleRoutes from "./Kanbas/Module/routes.js";
import AssignmentRoutes from "./Kanbas/Assignments/router.js";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./Kanbas/Users/route.js";
dotenv.config();

mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(process.env.MONGO);
    console.log(err);
  });

  const app = express();
  app.use(express.json());

  app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
    }
    ));

const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  };  

  if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
      sameSite: "none",
      secure: true,
      domain: process.env.HTTP_SERVER_DOMAIN,
    };
  }
  app.use(
    session({
        secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
    sameSite: "none",
    secure: true,
    domain: "kanbas-server-app-2.onrender.com",
    },})
    );
  
   
app.use(express.json());
AssignmentRoutes(app);
ModuleRoutes(app);
CourseRoutes(app);

Lab5(app);
Hello(app);
UserRoutes(app);
app.listen(process.env.PORT || 4000);