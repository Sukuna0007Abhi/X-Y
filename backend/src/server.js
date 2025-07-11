import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js"; 
import {ENV} from "./config/env.js";
import {connectDB} from "./config/db.js";

const app = express();

// Importing and using CORS middleware
app.use(cors());

// express.json() middleware to parse JSON bodies
app.use(express.json());

// Using Clerk middleware for authentication
app.use(clerkMiddleware());

app.get("/",(req, res) => {
  res.send("Hello, World!")
});

app.use("/api/users",userRoutes);
app.use("/api/posts", postRoutes); // Assuming userRoutes handles posts as well

// Remove the now-redundant top-level calls to connectDB(), app.get(...) and app.listen(...)

const startServer = async () => {
  try {
    await connectDB();
    
    app.get("/", (req, res) => {
      res.send("Hello, World!");
    });
    
    app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();

