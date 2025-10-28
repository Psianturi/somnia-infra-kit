// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/AgentContract.sol";

contract Deploy is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(pk);

        // Deploy AgentContract with deployer as owner (wrap to catch revert)
        try new AgentContract(msg.sender) returns (AgentContract agent) {
            console.log("AgentContract deployed at:", address(agent));
        } catch {
            console.log("AgentContract deployment reverted");
        }

        vm.stopBroadcast();
    }
}