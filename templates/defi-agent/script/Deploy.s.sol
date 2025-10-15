// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/DeFiAgent.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        DeFiAgent agent = new DeFiAgent(1000); // Default price threshold

        vm.stopBroadcast();

        console.log("DeFiAgent deployed at:", address(agent));
    }
}