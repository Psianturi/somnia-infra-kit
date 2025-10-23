// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/AgentContract.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy AgentContract with deployer as owner
        AgentContract agent = new AgentContract(msg.sender);

        vm.stopBroadcast();

        console.log("AgentContract deployed at:", address(agent));
    }
}