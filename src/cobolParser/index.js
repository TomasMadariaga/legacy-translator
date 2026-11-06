const { extractSections } = require("./extractSections");
const { parseWorkingStorage } = require("./parseWorkingStorage");
const { parseProcedureDivision } = require("./parseProcedureDivision");
const { buildContext } = require("./buildContext");

function buildCobolContext(cobolCode) {
  try {
    const { workingStorage, procedureDivision } = extractSections(cobolCode);

    if (!workingStorage || !procedureDivision) {
      return { context: "", error: "No se pudieron extraer las secciones del COBOL" };
    }

    const variables = parseWorkingStorage(workingStorage);

    const { paragraphs, moves, performOrder } = parseProcedureDivision(procedureDivision);

    const context = buildContext({ variables, moves, paragraphs, performOrder });

    return {
      context,
      meta: {
        totalVariables: variables.length,
        variablesWithoutValue: variables.filter(v => !v.hasValue && v.pic).length,
        totalParagraphs: paragraphs.length,
        movesDetected: moves.length,
      },
    };
  } catch (err) {
    console.error("Error en pre-procesador COBOL:", err);
    return { context: "", error: err.message };
  }
}

module.exports = { buildCobolContext };