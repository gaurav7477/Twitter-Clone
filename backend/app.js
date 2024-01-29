import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";


const app = express();

// configiration

dotenv.config({ path: "./config.env" });


app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  console.log("working successfully!");
  res.send("working successfully!");
});




// Fallback for SPA (React, Vue, etc.)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(fullPath, "index.html"));
});


export default app;