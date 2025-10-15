// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/AgentContract.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        AgentContract agent = new AgentContract();

        vm.stopBroadcast();

        console.log("AgentContract deployed at:", address(agent));
    }
}