import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

import random from "./routes/random";

dotenv.config({ path: path.join(__dirname, "../.env") });

const port = process.env.PORT || 8001;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/random", random);

const buildPath = path.join(__dirname, "..", "..", "client", "build");
app.use(express.static(buildPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
