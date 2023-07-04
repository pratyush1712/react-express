import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

import "./config";
import user from "./routes/user";
import auth from "./routes/auth";

const port = process.env.PORT || 8001;
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/user", user);
app.use("/api/auth", auth);

const buildPath = path.join(__dirname, "..", "..", "client", "build");
app.use(express.static(buildPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
