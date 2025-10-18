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
  const prompt = `Generate a secure, production-ready Solidity smart contract for an onchain agent with the following requirements:\n\nAgent Name: ${params.agentName}\nType: ${params.agentType}\nFeatures: ${params.features.join(', ') || 'None'}\nDescription: ${params.description}\n\nThe contract must use Solidity ^0.8.0, include SPDX license, and only use safe, audited patterns.\n\nIMPORTANT: The contract name MUST be exactly '${params.agentName}'. Output ONLY the contract code, no explanations.`;

  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a Solidity smart contract expert.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 1200,
    temperature: 0.2
  }, {
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json'
    }
  });

  const code = response.data.choices[0].message.content.trim();
  return code;
}

module.exports = { generateWithAI };
