// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BasicAgent is Ownable {
    string public agentName;
    uint256 public lastActionTimestamp;
    bool public isActive;

    event AgentActivated(bool active);
    event ActionPerformed(string action, uint256 timestamp);

    constructor(address initialOwner, string memory _agentName) Ownable(initialOwner) {
        agentName = _agentName;
        isActive = true;
    }

    modifier onlyActive() {
        require(isActive, "Agent is not active");
        _;
    }

    function performAction(string memory action) external onlyOwner onlyActive {
        lastActionTimestamp = block.timestamp;
        emit ActionPerformed(action, block.timestamp);
    }

    function toggleAgent() external onlyOwner {
        isActive = !isActive;
        emit AgentActivated(isActive);
    }

    function getAgentStatus() external view returns (
        string memory name,
        uint256 lastAction,
        bool active
    ) {
        return (agentName, lastActionTimestamp, isActive);
    }
}