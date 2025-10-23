// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/BasicAgent.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy BasicAgent with deployer as owner
        BasicAgent agent = new BasicAgent(msg.sender, "BasicAgent");

        vm.stopBroadcast();

        console.log("BasicAgent deployed at:", address(agent));
    }
}