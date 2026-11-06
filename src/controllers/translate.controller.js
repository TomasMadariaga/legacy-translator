const { buildCobolContext } = require("../cobolParser");
const { isValidCOBOL } = require("../isValidCobol");
const { callOpenRouter, callGroq } = require("./aiProviders");
const { generatePrompt } = require("./promptBuilder");


async function translateCOBOL(cobolCode, filename = "") {
  const { context, meta, error } = buildCobolContext(cobolCode);

  if (error) {
    console.warn("⚠️  Pre-procesador con advertencia:", error);
  }

  if (meta) {
    console.log(
      `📊 Parser: ${meta.totalVariables} variables, ` +
      `${meta.variablesWithoutValue} sin VALUE, ` +
      `${meta.totalParagraphs} párrafos, ` +
      `${meta.movesDetected} MOVEs detectados`,
    );
  }

  const fileContext = filename ? `File: ${filename}\n\n` : "";

  const prompt = generatePrompt(fileContext, context, cobolCode)

  try {
    return await callOpenRouter(prompt)
  } catch (err) {
    console.warn("⚠️ OpenRouter falló, usando Groq:", err.message);
    return await callGroq(prompt);
  }
}

const translateFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file was received" });
    }

    const cobolCode = req.file.buffer.toString("utf8");

    if (!isValidCOBOL(cobolCode)) {
      return res.status(400).json({ error: "The file is not a valid COBOL" });
    }

    const pythonCode = await translateCOBOL(cobolCode, req.file.originalname);
    const outputFilename = req.file.originalname.replace(/\.(cob|cbl)$/i, '.py');

    res.setHeader("Content-Type", "text/x-python");
    res.setHeader("Content-Disposition", `attachment; filename="${outputFilename}"`);
    res.send(pythonCode);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error translating the file" })
  }
};

const translateText = async (req, res) => {
  const { code } = req.body;

  if (!isValidCOBOL(code)) {
    return res.status(400).json({ error: "The code is not valid COBOL" });
  }

  try {
    const translatedCode = await translateCOBOL(code);
    res.json({ translatedCode });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error translating" })
  }
}

module.exports = { translateFile, translateText }