import express from 'express';
import {ENV} from "./config/env.js";
import {connectDB} from "./config/db.js";

const app = express();

app.get("/",(req, res) => {
  res.send("Hello, World!")
});


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

