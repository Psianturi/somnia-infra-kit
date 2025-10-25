const { parse } = require('solidity-parser-antlr');

/**
 * Post-process AI-generated Solidity code to fix common issues.
 * @param {string} code - The Solidity code from AI.
 * @param {string[]} features - Array of selected features.
 * @returns {string} - The fixed Solidity code.
 */
function postProcess(code, features) {
  try {
    // Try AST-based fixes first (we only need to ensure parse succeeds)
    parse(code);
    code = applyASTFixes(code);
  } catch (error) {
    console.warn('AST parsing failed, falling back to regex fixes:', error.message);
    code = applyRegexFixes(code, features);
  }
  return code;
}

function applyASTFixes(code) {
  // AST-based fixes (if parsing succeeds)
  // TODO: Implement AST-based fixes if needed
  return code;
}

function applyRegexFixes(code, features) {
  // Regex-based fixes as fallback

  // Fix 1: Ensure Ownable constructor
  if (!hasOwnableConstructor(code)) {
    code = fixOwnableConstructor(code);
  }

  // Fix 2: Add isActive
  if (!hasIsActive(code)) {
    code = addIsActive(code);
  }

  // Fix 3: Add events
  if (features.includes('Staking') && !hasEvent(code, 'Staked')) {
    code = addEvent(code, 'event Staked(address indexed user, address indexed token, uint256 amount);');
  }
  if (features.includes('Staking') && !hasEvent(code, 'Unstaked')) {
    code = addEvent(code, 'event Unstaked(address indexed user, address indexed token, uint256 amount);');
  }
  if (features.includes('Rewards Distribution') && !hasEvent(code, 'RewardPaid')) {
    code = addEvent(code, 'event RewardPaid(address indexed user, address indexed token, uint256 reward);');
  }

  // Fix 4: Add toggleAgent
  if (!hasToggleAgent(code)) {
    code = addToggleAgent(code);
  }

  // Fix 5: Add imports
  if (!hasImport(code, '@openzeppelin/contracts/access/Ownable.sol')) {
    code = addImport(code, 'import "@openzeppelin/contracts/access/Ownable.sol";');
  }
  if (!hasImport(code, '@openzeppelin/contracts/utils/ReentrancyGuard.sol')) {
    code = addImport(code, 'import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";');
  }

  // Additional regex fix: Remove invalid backticks or markdown
  code = code.replace(/```[\s\S]*?```/g, ''); // Remove code blocks
  code = code.replace(/`/g, ''); // Remove backticks

  return code;
}

// Helper functions
function hasOwnableConstructor(code) {
  return code.includes('Ownable(msg.sender)') || code.includes('Ownable(');
}

function fixOwnableConstructor(code) {
  // Simple regex to add Ownable(msg.sender) if missing
  if (code.includes('constructor()')) {
    return code.replace(/constructor\(\)\s*\{/, 'constructor() Ownable(msg.sender) {');
  }
  return code;
}

function hasIsActive(code) {
  return code.includes('bool public isActive');
}

function addIsActive(code) {
  // Add after contract declaration
  return code.replace(/(contract \w+ is [^}]*\{)/, '$1\n    bool public isActive = true;');
}

function hasEvent(code, eventName) {
  return code.includes(`event ${eventName}`);
}

function addEvent(code, eventStr) {
  // Add after last event or before first function
  const eventMatch = code.match(/event [^;]+;/g);
  if (eventMatch) {
    const lastEvent = eventMatch[eventMatch.length - 1];
    return code.replace(lastEvent, lastEvent + '\n    ' + eventStr);
  } else {
    // Add before first function
    return code.replace(/(contract \w+ is [^}]*\{[^}]*?)\n\s*(function|modifier|event)/, '$1\n    ' + eventStr + '\n\n    $2');
  }
}

function hasToggleAgent(code) {
  return code.includes('function toggleAgent');
}

function addToggleAgent(code) {
  // Add after constructor
  return code.replace(/(constructor[^}]*\}\n)/, '$1\n    function toggleAgent() public onlyOwner {\n        isActive = !isActive;\n    }\n');
}

function hasImport(code, importStr) {
  return code.includes(importStr);
}

function addImport(code, importStr) {
  // Add after last import
  const importMatch = code.match(/import [^;]+;/g);
  if (importMatch) {
    const lastImport = importMatch[importMatch.length - 1];
    return code.replace(lastImport, lastImport + '\n' + importStr);
  } else {
    // Add at top after pragma
    return code.replace(/(pragma [^;]+;\n)/, '$1\n' + importStr + '\n');
  }
}

module.exports = { postProcess };