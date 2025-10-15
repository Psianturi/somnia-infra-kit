// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract AgentContract {
    address public owner;
    uint256 public lastActionTimestamp;
    string public lastActionData;

    event AgentActionTriggered(string data, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function triggerAgentAction(string memory _data) public onlyOwner {
        lastActionTimestamp = block.timestamp;
        lastActionData = _data;
        emit AgentActionTriggered(_data, block.timestamp);
    }

    function getAgentStatus() public view returns (uint256, string memory) {
        return (lastActionTimestamp, lastActionData);
    }
}