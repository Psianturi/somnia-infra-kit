// Sanitizer utilities for AI/wizard-generated Solidity code
function sanitizeSoliditySource(input, options = {}) {
  const projectName = options.projectName || null;
  let sanitized = input || '';

  // Remove fenced code blocks: ```...``` (keep inner content)
  sanitized = sanitized.replace(/```(?:\w*\n)?([\s\S]*?)```/g, (_, inner) => inner);

  // Normalize OpenZeppelin path variations
  sanitized = sanitized.replace(/@openzeppelin\/contracts\/security\//g, '@openzeppelin/contracts/utils/');

  // Extract import lines and dedupe
  const importLines = (sanitized.match(/^import\s+.*;$/gim) || []).map(s => s.trim());
  const uniqueImports = Array.from(new Set(importLines));

  // Remove any SPDX and pragma lines from the body
  sanitized = sanitized.replace(/\/\/\s*SPDX-License-Identifier:.*\n?/gi, '');
  sanitized = sanitized.replace(/pragma\s+solidity\s+[^;]+;\n?/gi, '');

  // Try to find the contract block for the given projectName (brace matching)
  let contractBlock = null;
  if (projectName) {
    const contractKeyword = new RegExp('contract\\s+' + projectName + '\\b');
    let m = sanitized.search(contractKeyword);
    if (m !== -1) {
      const braceStart = sanitized.indexOf('{', m);
      if (braceStart !== -1) {
        let depth = 0;
        let endIndex = -1;
        for (let i = braceStart; i < sanitized.length; i++) {
          const ch = sanitized[i];
          if (ch === '{') depth++;
          else if (ch === '}') {
            depth--;
            if (depth === 0) { endIndex = i + 1; break; }
          }
        }
        if (endIndex !== -1) {
          const headerStart = sanitized.lastIndexOf('\n', m) + 1;
          contractBlock = sanitized.slice(headerStart, endIndex).trim();
        }
      }
    }
  }

  // If no contract block found for projectName, fallback to first contract in the text
  if (!contractBlock) {
    const firstContractMatch = sanitized.match(/contract\s+\w+[^ {]*\{/i);
    if (firstContractMatch) {
      const start = sanitized.indexOf(firstContractMatch[0]);
      const braceStart = sanitized.indexOf('{', start);
      if (braceStart !== -1) {
        let depth = 0;
        let endIndex = -1;
        for (let i = braceStart; i < sanitized.length; i++) {
          const ch = sanitized[i];
          if (ch === '{') depth++;
          else if (ch === '}') {
            depth--;
            if (depth === 0) { endIndex = i + 1; break; }
          }
        }
        if (endIndex !== -1) {
          const headerStart = sanitized.lastIndexOf('\n', start) + 1;
          contractBlock = sanitized.slice(headerStart, endIndex).trim();
        }
      }
    }
  }

  // Build final normalized content
  const header = ['// SPDX-License-Identifier: MIT', 'pragma solidity ^0.8.20;', ''].join('\n');
  let body = '';
  if (uniqueImports.length) body += uniqueImports.join('\n') + '\n\n';
  if (contractBlock) body += contractBlock; else body += sanitized.trim();

  const finalContent = header + body + '\n';
  return finalContent;
}

module.exports = { sanitizeSoliditySource };
