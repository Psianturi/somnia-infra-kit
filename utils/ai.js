// utils/ai.js
// Utility for AI integration (OpenAI API)

const axios = require('axios');

/**
 * Generate Solidity smart contract code using OpenAI API
 * @param {object} params - User requirements for the agent
 * @param {string} openaiApiKey - OpenAI API key
 * @returns {Promise<string>} - Generated Solidity code
 */
async function generateWithAI(params, openaiApiKey) {
  // Hybrid approach: Start with base template, add AI-generated features
  const baseTemplate = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract ${params.agentName} is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bool public isActive;
    uint256 public lastUpdate;

    constructor() Ownable(msg.sender) {
        isActive = true;
        lastUpdate = block.timestamp;
    }

    function toggleAgent() public onlyOwner {
        isActive = !isActive;
    }
`;

  // Filter features
  const allowedFeatures = ['Staking', 'Rewards Distribution', 'Access Control', 'Price Monitoring'];
  const filteredFeatures = params.features.filter(f => allowedFeatures.includes(f)).slice(0, 3);

  let additionalCode = '';

  // Add feature-specific code via AI or templates
  if (filteredFeatures.length > 0) {
    const featurePrompt = `Add the following features to the Solidity contract. Output ONLY the additional Solidity code (state variables, events, functions) for these features: ${filteredFeatures.join(', ')}. Do not include contract declaration, constructor, or imports. Use OpenZeppelin patterns.`;

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a Solidity expert. Output only valid Solidity code additions.' },
          { role: 'user', content: featurePrompt }
        ],
        max_tokens: 800,
        temperature: 0.1
      }, {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      additionalCode = response.data.choices[0].message.content.trim();
      // Clean up any markdown
      additionalCode = additionalCode.replace(/```[\s\S]*?```/g, '').trim();
    } catch (error) {
      console.warn('AI feature generation failed, using basic template only');
      additionalCode = '';
    }
  }

  const fullCode = baseTemplate + additionalCode + '\n}';
  return fullCode;
}

module.exports = { generateWithAI };
