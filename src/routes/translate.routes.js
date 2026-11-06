const { Router } = require("express");
const multer = require("multer");
const { translateFile, translateText } = require("../controllers/translate.controller");

const translateRoutes = Router();

const upload = multer({ storage: multer.memoryStorage() });

translateRoutes.post("/file", upload.single("file"), translateFile);

translateRoutes.post("/text", translateText);

module.exports = { translateRoutes }