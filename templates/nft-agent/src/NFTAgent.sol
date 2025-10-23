// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NFTAgent {
    address public owner;
    uint256 public floorPriceThreshold;
    uint256 public lastFloorPrice;
    uint256 public lastActionTimestamp;
    bool public isActive;
    mapping(address => bool) public watchedCollections;

    event FloorPriceUpdated(address collection, uint256 newPrice, uint256 timestamp);
    event TradingSignal(address collection, uint256 price, string action, uint256 timestamp);
    event CollectionAdded(address collection);
    event AgentStatusChanged(bool active);

    constructor(uint256 _floorPriceThreshold) {
        owner = msg.sender;
        floorPriceThreshold = _floorPriceThreshold;
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

    function addCollection(address _collection) external onlyOwner {
        watchedCollections[_collection] = true;
        emit CollectionAdded(_collection);
    }

    function updateFloorPrice(address _collection, uint256 _newPrice) external onlyOwner onlyActive {
        require(watchedCollections[_collection], "Collection not watched");
        
        lastFloorPrice = _newPrice;
        lastActionTimestamp = block.timestamp;
        emit FloorPriceUpdated(_collection, _newPrice, block.timestamp);

        if (_newPrice <= (floorPriceThreshold * 80) / 100) {
            emit TradingSignal(_collection, _newPrice, "BUY_OPPORTUNITY", block.timestamp);
        } else if (_newPrice >= (floorPriceThreshold * 120) / 100) {
            emit TradingSignal(_collection, _newPrice, "SELL_OPPORTUNITY", block.timestamp);
        }
    }

    function setFloorPriceThreshold(uint256 _newThreshold) external onlyOwner {
        floorPriceThreshold = _newThreshold;
    }

    function toggleAgent() external onlyOwner {
        isActive = !isActive;
        emit AgentStatusChanged(isActive);
    }

    function getAgentStatus() external view returns (
        uint256 currentFloorPrice,
        uint256 threshold,
        uint256 lastUpdate,
        bool active
    ) {
        return (lastFloorPrice, floorPriceThreshold, lastActionTimestamp, isActive);
    }

    function isCollectionWatched(address _collection) external view returns (bool) {
        return watchedCollections[_collection];
    }
}