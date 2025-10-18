// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Cobain
 * @dev Clever, target oriented, focus on EVM, memcoin and SOMNIA
 * @author Somnia AI Agent CLI
 */
contract Cobain {
    address public owner;
    bool public isActive;
    uint256 public lastUpdate;
    
    // Events
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event AgentActivated();
    event AgentDeactivated();
    event PriceThresholdReached(uint256 price);
    event TradeExecuted(uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    modifier onlyActive() {
        require(isActive, "Agent not active");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        isActive = true;
        lastUpdate = block.timestamp;
        emit AgentActivated();
    }

    mapping(address => uint256) public stakes;
    uint256 public totalStaked;
    
    function stake(uint256 amount) external {
        // Staking logic here
        stakes[msg.sender] += amount;
        totalStaked += amount;
        emit Staked(msg.sender, amount);
    }
    event Staked(address indexed user, uint256 amount);
    
    mapping(address => bool) public admins;
    
    modifier onlyAdmin() {
        require(admins[msg.sender], "Not admin");
        _;
    }
    
    function setAdmin(address user, bool isAdmin) external onlyOwner {
        admins[user] = isAdmin;
        emit AdminSet(user, isAdmin);
    }
    event AdminSet(address indexed user, bool isAdmin);
    
    uint256 public currentPrice;
    uint256 public priceThreshold;
    
    function updatePrice(uint256 _price) external onlyOwner {
        currentPrice = _price;
        if (_price > priceThreshold) {
            emit PriceThresholdReached(_price);
        }
    }
    bool public tradingEnabled;
    uint256 public maxTradeSize;
    
    function executeTrade(uint256 amount) external onlyOwner {
        require(tradingEnabled, "Trading disabled");
        require(amount <= maxTradeSize, "Trade too large");
        // Trading logic here
        emit TradeExecuted(amount);
    }
    function toggleAgent() external onlyOwner {
        isActive = !isActive;
        if (isActive) {
            emit AgentActivated();
        } else {
            emit AgentDeactivated();
        }
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
    
    function getStatus() external view returns (bool active, uint256 lastUpdateTime) {
        return (isActive, lastUpdate);
    }
}