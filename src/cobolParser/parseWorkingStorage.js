function cobolToPython(name) {
  return name.replace(/-/g, "_").toUpperCase();
}

function getDefaultValue(pic) {
  if (!pic) return null;
  const upper = pic.toUpperCase();
  if (upper.startsWith("X")) return '""';
  if (upper.includes("V") || upper.includes(".")) return "0.0";
  return "0";
}

function parseWorkingStorage(wsText) {
  const variables = [];

  const lineRegex =
    /^\s*(\d{2})\s+([\w-]+)\s*(?:PIC\s+([\w()V.]+))?(?:.*?VALUE\s+([\d.'"A-Z]+))?(?:.*?OCCURS\s+(\d+)\s+TIMES)?/im;

  const lines = wsText.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("*") || trimmed.toUpperCase().includes("WORKING-STORAGE SECTION")) {
      continue;
    }

    const match = trimmed.match(lineRegex);
    if (!match) continue;

    const level = parseInt(match[1]);
    const rawName = match[2];
    const pic = match[3] || null;
    const rawValue = match[4] || null;
    const occurs = match[5] ? parseInt(match[5]) : null;

    if (rawName === "FILLER" || level === 66 || level === 88) continue;

    let initialValue = null;
    if (rawValue !== null) {
      initialValue = rawValue.replace(/['"]/g, "").trim();
    }

    variables.push({
      level,
      cobolName: rawName,
      pythonName: cobolToPython(rawName),
      pic,
      hasValue: rawValue !== null,
      initialValue,
      defaultValue: pic ? getDefaultValue(pic) : null,
      occurs,
      isGroup: !pic && !occurs,
    });
  }

  return variables;
}

function analyzeStructure(variables) {
  const topLevel = variables.filter((v) => v.level === 1);
  const hasGroups = topLevel.some((v) => v.isGroup);

  return {
    isNested: hasGroups,
    groups: topLevel
      .filter((v) => v.isGroup)
      .map((g) => ({
        name: g.pythonName,
        children: variables.filter(
          (v) =>
            v.level > 1 &&
            !v.isGroup &&
            variables.indexOf(v) > variables.indexOf(g)
        ),
      })),
  };
}

module.exports = { parseWorkingStorage, analyzeStructure, cobolToPython };