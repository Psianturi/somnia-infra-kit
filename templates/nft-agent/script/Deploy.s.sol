// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/NFTAgent.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy NFTAgent with floor price threshold of 1000
        NFTAgent agent = new NFTAgent(1000);

        vm.stopBroadcast();

        console.log("NFTAgent deployed at:", address(agent));
    }
}