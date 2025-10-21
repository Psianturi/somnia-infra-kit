// SPDX-License-Identifier: MIT// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;pragma solidity ^0.8.0;



import "forge-std/Script.sol";contract AgentContract {

import "openzeppelin-contracts/contracts/access/Ownable.sol";    // Example: Yield agent stores funds and allows withdrawal

    address public owner;

contract AgentContract is Ownable {

    // Example state variable    constructor() {

    uint256 public yield;        owner = msg.sender;

    }

    // Example function to set yield

    function setYield(uint256 _yield) external onlyOwner {    // Deposit ETH to contract

        yield = _yield;    receive() external payable {}

    }

    // Withdraw all ETH to owner

    // Example function to get yield    function withdraw() external {

    function getYield() external view returns (uint256) {        require(msg.sender == owner, "Not owner");

        return yield;        payable(owner).transfer(address(this).balance);

    }    }

}}

