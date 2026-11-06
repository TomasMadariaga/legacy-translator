const { cobolToPython } = require("./parseWorkingStorage");

function paragraphToPython(name) {
  const base = name.replace(/-/g, "_").toUpperCase();
  return /^\d/.test(base) ? `_${base}` : base;
}

function parseProcedureDivision(procText) {
  const paragraphs = [];
  const moves = [];
  const performOrder = [];

  const lines = procText.split("\n");
  let currentParagraph = null;

  const paragraphRegex = /^\s{5,8}([\w-]+)\s*\.\s*$/;

  const moveNumericRegex =
    /MOVE\s+([\d.]+)\s+TO\s+(WS-[\w-]+)/i;

  const performRegex = /PERFORM\s+([\w-]+)(?!\s+VARYING)/i;

  const performVaryingRegex = /PERFORM\s+VARYING\s+([\w-]+)/i;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("*")) continue;

    const paraMatch = line.match(paragraphRegex);
    if (paraMatch && paraMatch[1].toUpperCase() !== "PROCEDURE") {
      currentParagraph = paraMatch[1];
      paragraphs.push({
        cobolName: currentParagraph,
        pythonName: paragraphToPython(currentParagraph),
        moves: [],
        performs: [],
        hasLoop: false,
      });
      continue;
    }

    if (!currentParagraph) continue;
    const current = paragraphs[paragraphs.length - 1];

    const moveMatch = trimmed.match(moveNumericRegex);
    if (moveMatch) {
      const entry = {
        paragraph: currentParagraph,
        pythonParagraph: paragraphToPython(currentParagraph),
        variable: cobolToPython(moveMatch[2]),
        value: parseFloat(moveMatch[1]),
      };
      moves.push(entry);
      current.moves.push(entry);
    }

    const varyingMatch = trimmed.match(performVaryingRegex);
    if (varyingMatch) {
      current.hasLoop = true;
    }

    const performMatch = trimmed.match(performRegex);
    if (performMatch) {
      const target = performMatch[1];
      if (!["VARYING", "UNTIL", "TIMES"].includes(target.toUpperCase())) {
        current.performs.push({
          cobolName: target,
          pythonName: paragraphToPython(target),
        });
      }
    }
  }

  const mainParagraph = paragraphs[0];
  if (mainParagraph) {
    mainParagraph.performs.forEach((p) => performOrder.push(p));
  }

  return { paragraphs, moves, performOrder };
}

module.exports = { parseProcedureDivision, paragraphToPython };