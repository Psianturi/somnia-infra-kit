// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AgentContract is Ownable {
    uint256 public yield;

    event Withdrawn(address indexed to, uint256 amount);

    constructor(address initialOwner) Ownable(initialOwner) {}

    // Deposit ETH to contract
    receive() external payable {}

    // Set yield value
    function setYield(uint256 _yield) external onlyOwner {
        require(_yield > 0, "Yield must be positive");
        yield = _yield;
    }

    // Get yield value
    function getYield() external view returns (uint256) {
        return yield;
    }

    // Withdraw all ETH to owner
    function withdraw() external onlyOwner {
        uint256 bal = address(this).balance;
        payable(owner()).transfer(bal);
        emit Withdrawn(owner(), bal);
    }
}

