import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js"; 
import commentRoutes from "./routes/comment.route.js";
import notificationRoutes from "./routes/notification.route.js";
import trendingRoutes from "./routes/trending.route.js";
import {ENV} from "./config/env.js";
import {connectDB} from "./config/db.js";
import { arcjetMiddleware } from './middleware/arcjet.middleware.js';

const app = express();

// Importing and using CORS middleware
app.use(cors());

// express.json() middleware to parse JSON bodies
app.use(express.json());

// Using Clerk middleware for authentication
app.use(clerkMiddleware());
app.use(arcjetMiddleware); // Arcjet middleware for security, rate limiting, and bot protection

app.get("/",(req, res) => {
  res.send("Hello, World!")
});

app.use("/api/users",userRoutes);
app.use("/api/posts", postRoutes); // Assuming userRoutes handles posts as well
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes); 
app.use("/api/trending", trendingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message ||"Internal Server Error" });
});

// Remove the now-redundant top-level calls to connectDB(), app.get(...) and app.listen(...)

const startServer = async () => {
  try {
    await connectDB();
    
    // listen for only in production mode
    if(ENV.NODE_ENV === 'production') {
      app.listen(ENV.PORT, () => {
        console.log(`Server is running in production mode on port ${ENV.PORT}`);
      });
    }
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();

export default app;