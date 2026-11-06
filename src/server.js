require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { translateRoutes } = require("./routes/translate.routes.js");

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", process.env.CLIENT_URL],
  methods: "GET,POST,PATCH,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/", translateRoutes);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on ${process.env.API_URL}`);
});
server.timeout = 120_000;