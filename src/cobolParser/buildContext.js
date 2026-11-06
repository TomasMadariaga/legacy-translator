function buildContext({ variables, moves, paragraphs, performOrder }) {
  const lines = [];

  const variablesWithoutValue = variables.filter((v) => !v.hasValue && v.pic);
  const movedVars = moves.map((m) => m.variable);

  const uninitializedButMoved = variablesWithoutValue.filter((v) =>
    movedVars.includes(v.pythonName)
  );

  if (uninitializedButMoved.length > 0) {
    lines.push("## VARIABLE INITIALIZATION MAP");
    lines.push(
      "The following variables have NO VALUE clause in WORKING-STORAGE."
    );
    lines.push(
      "Declare them in ws with default 0, then assign inside their function:\n"
    );

    for (const v of uninitializedButMoved) {
      const assignments = moves.filter((m) => m.variable === v.pythonName);
      for (const a of assignments) {
        lines.push(
          `  ${v.pythonName} → declare in ws as 0, assign in ${a.pythonParagraph} with value ${a.value}`
        );
      }
    }
    lines.push("");
  }

  if (paragraphs.length > 0) {
    lines.push("## PARAGRAPH → FUNCTION NAME MAP");
    lines.push(
      "Use these exact Python function names (COBOL names are invalid in Python):\n"
    );
    for (const p of paragraphs) {
      lines.push(`  ${p.cobolName} → def ${p.pythonName}()`);
    }
    lines.push("");
  }

  if (performOrder.length > 0) {
    lines.push("## EXECUTION ORDER");
    lines.push(
      "Call functions in this exact order from the main paragraph:\n"
    );
    performOrder.forEach((p, i) => {
      lines.push(`  ${i + 1}. ${p.pythonName}()`);
    });
    lines.push("");
  }

  const occurs = variables.filter((v) => v.occurs);
  if (occurs.length > 0) {
    lines.push("## OCCURS → LIST MAP");
    lines.push("These WORKING-STORAGE entries use OCCURS and must be lists:\n");
    for (const v of occurs) {
      lines.push(`  ${v.cobolName} (OCCURS ${v.occurs} TIMES) → ws["${v.pythonName}"] = []`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

module.exports = { buildContext };