const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes   = require("./routes/authRoutes");
const profileRoutes= require("./routes/profileRoutes");
const adminRoutes  = require("./routes/adminRoutes");
const publicRoutes = require("./routes/publicRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth",         authRoutes);
app.use("/api/profile",      profileRoutes);
app.use("/api/admin",        adminRoutes);
app.use("/api/public",       publicRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/", (_, res) => res.send("API Running..."));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
