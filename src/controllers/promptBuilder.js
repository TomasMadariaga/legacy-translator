function generatePrompt(fileContext, context, cobolCode) {
    const prompt = `You are a COBOL-to-Python migration engine. Output only valid Python code. No comments, no explanations, no markdown.

${fileContext}${context}

## TASK
Translate the COBOL program below into Python preserving exact behavior and output.

## STRICT EXECUTION MODE (MANDATORY)
- Do NOT interpret, simplify, or optimize COBOL logic.
- Do NOT restructure code unless explicitly required by rules.
- Do NOT skip any variable, paragraph, or calculation.
- If unsure, prefer literal translation over simplification.
- The output must be deterministic and consistent.

## RULES

### Shared state
Use one dictionary named "ws" for all variables that persist across functions.
Declare ALL ws keys at the top with zero or empty defaults before any function.
Group items (01/05/10 levels) MUST be represented as nested dictionaries. Do NOT flatten them.

### Variable initialization
Follow the VARIABLE INITIALIZATION MAP above exactly.
NEVER substitute a missing variable with an existing ws key that looks similar.
If a variable is not defined in COBOL, do NOT create it.

### Paragraph mapping
Use the PARAGRAPH → FUNCTION NAME MAP above for all function names.
Call order must match the EXECUTION ORDER above exactly.

### OCCURS
Follow the OCCURS → LIST MAP above.
COBOL indexing starts at 1. Preserve this logic when accessing elements.

### Constants
Every variable with a VALUE clause in WORKING-STORAGE must be accessed from ws, never hardcoded inline.

### Cross-function variables
Any variable calculated inside a function that is read by another function MUST be stored in ws, not as a local variable.

### Calculations
Reproduce COBOL formulas exactly.
Each ADD → one separate += operation.

### print() rule
NEVER compute or combine values inside print().
Only print variables already stored in ws or passed as parameters.

### OUTPUT CONTRACT (MANDATORY)
The output must:
1. Start with: ws = { ... } containing ALL variables
2. Contain one function per COBOL paragraph
3. Contain no extra functions
4. End with: if __name__ == "__main__": calling the main paragraph

COBOL:
${cobolCode}

Python:`

    return prompt;
}

module.exports = { generatePrompt }