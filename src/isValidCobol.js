function isValidCOBOL(code) {
  if (!code || typeof code !== "string") return false;

  const cobolKeywords = [
    /IDENTIFICATION\s+DIVISION/i,
    /DATA\s+DIVISION/i,
    /PROCEDURE\s+DIVISION/i,
    /WORKING-STORAGE\s+SECTION/i,
    /PROGRAM-ID/i,
    /DISPLAY/i,
    /ACCEPT/i,
    /MOVE/i,
    /COMPUTE/i,
    /ADD/i,
    /SUBTRACT/i,
    /MULTIPLY/i,
    /DIVIDE/i,
    /IF/i,
    /ELSE/i,
    /PERFORM/i,
    /UNTIL/i,
    /VARYING/i,
    /STOP\s+RUN/i,
    /GOBACK/i,
    /EXIT\s+PROGRAM/i,
    /INITIALIZE/i,
    /OPEN/i,
    /CLOSE/i,
    /READ/i,
    /WRITE/i,
    /REWRITE/i,
    /DELETE/i,
    /START/i,
    /COMMIT/i,
    /ROLLBACK/i,
    /CALL/i,
    /USING/i,
    /THRU/i,
    /THROUGH/i,
    /THEN/i,
    /WHEN/i,
    /OTHER/i,
    /END-IF/i,
    /END-PERFORM/i,
    /END-READ/i,
    /END-WRITE/i,
    /END-ACCEPT/i,
    /END-DISPLAY/i,
    /END-COMPUTE/i,
    /END-ADD/i,
    /END-SUBTRACT/i,
    /END-MULTIPLY/i,
    /END-DIVIDE/i,
  ];

  let cobolScore = 0;
  for (const keyword of cobolKeywords) {
    if (keyword.test(code)) {
      cobolScore++;
    }
  }

  const lines = code.split("\n");
  let columnFormat = 0;
  for (const line of lines) {
    if (line.length > 6 && line[6] === " ") {
      columnFormat++;
    }
  }

  const nonCobolIndicators = [
    /<html/i,
    /<div/i,
    /<script/i,
    /{/,
    /}/,
    /function\s*\(/,
    /=>/,
    /console\.log/i,
    /import\s+.*from/i,
    /export\s+default/i,
    /const\s+.*=/,
    /let\s+.*=/,
    /var\s+.*=/,
  ];

  let nonCobolScore = 0;
  for (const indicator of nonCobolIndicators) {
    if (indicator.test(code)) {
      nonCobolScore++;
    }
  }

  const isCobol = (cobolScore >= 2 || columnFormat >= 2) && nonCobolScore <= 2;

  return isCobol;
}

module.exports = { isValidCOBOL };
