// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/NFTAgent.sol";

contract Deploy is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(pk);

        // Deploy NFTAgent with floor price threshold of 1000 (wrapped to catch revert)
        try new NFTAgent(1000) returns (NFTAgent agent) {
            console.log("NFTAgent deployed at:", address(agent));
        } catch {
            console.log("NFTAgent deployment reverted");
        }

        vm.stopBroadcast();
    }
}