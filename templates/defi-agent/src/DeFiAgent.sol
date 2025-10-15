// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract DeFiAgent {
    address public owner;
    uint256 public priceThreshold;
    uint256 public lastPrice;
    uint256 public lastActionTimestamp;
    bool public isActive;

    event PriceUpdated(uint256 newPrice, uint256 timestamp);
    event ThresholdTriggered(uint256 price, string action, uint256 timestamp);
    event AgentStatusChanged(bool active);

    constructor(uint256 _priceThreshold) {
        owner = msg.sender;
        priceThreshold = _priceThreshold;
        isActive = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyActive() {
        require(isActive, "Agent is not active");
        _;
    }

    function updatePrice(uint256 _newPrice) external onlyOwner onlyActive {
        lastPrice = _newPrice;
        lastActionTimestamp = block.timestamp;
        emit PriceUpdated(_newPrice, block.timestamp);

        if (_newPrice >= priceThreshold) {
            emit ThresholdTriggered(_newPrice, "BUY_SIGNAL", block.timestamp);
        } else if (_newPrice <= (priceThreshold * 80) / 100) {
            emit ThresholdTriggered(_newPrice, "SELL_SIGNAL", block.timestamp);
        }
    }

    function setPriceThreshold(uint256 _newThreshold) external onlyOwner {
        priceThreshold = _newThreshold;
    }

    function toggleAgent() external onlyOwner {
        isActive = !isActive;
        emit AgentStatusChanged(isActive);
    }

    function getAgentStatus() external view returns (
        uint256 currentPrice,
        uint256 threshold,
        uint256 lastUpdate,
        bool active
    ) {
        return (lastPrice, priceThreshold, lastActionTimestamp, isActive);
    }
}