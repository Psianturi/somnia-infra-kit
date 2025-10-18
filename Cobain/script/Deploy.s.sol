// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/Cobain.sol";

contract DeployCobain is Script {
    function run() external {
        vm.startBroadcast();
        
        Cobain agent = new Cobain();
        
        console.log("Cobain deployed at:", address(agent));
        
        vm.stopBroadcast();
    }
}