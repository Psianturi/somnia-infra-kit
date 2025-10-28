// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/DeFiAgent.sol";

contract Deploy is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(pk);

        // Deploy DeFiAgent with default price threshold (wrapped to catch revert)
        try new DeFiAgent(1000) returns (DeFiAgent agent) {
            console.log("DeFiAgent deployed at:", address(agent));
        } catch {
            console.log("DeFiAgent deployment reverted");
        }

        vm.stopBroadcast();
    }
}