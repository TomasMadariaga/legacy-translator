function extractSections(cobolCode) {
  const upper = cobolCode.toUpperCase();

  const workingStorageMatch = upper.indexOf("WORKING-STORAGE SECTION");
  const procedureMatch = upper.indexOf("PROCEDURE DIVISION");
  const endProgramMatch = upper.indexOf("END PROGRAM");

  if (workingStorageMatch === -1 || procedureMatch === -1) {
    return {
      workingStorage: "",
      procedureDivision: "",
    };
  }

  const workingStorage = cobolCode.slice(
    workingStorageMatch,
    procedureMatch
  ).trim();

  const procedureEnd =
    endProgramMatch !== -1 ? endProgramMatch : cobolCode.length;

  const procedureDivision = cobolCode.slice(
    procedureMatch,
    procedureEnd
  ).trim();

  return { workingStorage, procedureDivision };
}

module.exports = { extractSections };