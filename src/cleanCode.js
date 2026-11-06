function cleanPythonCode(rawCode) {
  if (!rawCode) return '';
  
  let cleaned = rawCode;
  
  cleaned = cleaned.replace(/^```python\s*\n?/i, '');
  cleaned = cleaned.replace(/^```\s*\n?/, '');
  cleaned = cleaned.replace(/\n?```$/, '');
  
  cleaned = cleaned.replace(/\"\"\"[\s\S]*?\"\"\"/g, '');
  cleaned = cleaned.replace(/'''[\s\S]*?'''/g, '');
  
  const lines = cleaned.split('\n');
  const filteredLines = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('#')) {
      continue;
    }
    filteredLines.push(line);
  }
  
  cleaned = filteredLines.join('\n');
  
  const finalLines = cleaned.split('\n').filter(line => {
    const trimmed = line.trim();
    return trimmed !== '```' && 
           trimmed !== 'python' && 
           trimmed !== '```python';
  });
  
  cleaned = finalLines.join('\n');
  
  cleaned = cleaned.trim();
  
  return cleaned;
}

module.exports = { cleanPythonCode };