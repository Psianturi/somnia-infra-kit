// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/AgentContract.sol";

contract Deploy is Script {
    function run() external {
        // Read private key from environment and derive deployer address for logging
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);
        console.log("Deployer address:", deployer);
        console.log("Deployer balance (wei):", deployer.balance);

        // Start broadcasting with the provided private key
        vm.startBroadcast(pk);

        // Wrap construction in try/catch to capture revert reason if constructor fails
        try new AgentContract() returns (AgentContract agent) {
            console.log("AgentContract deployed at:", address(agent));
        } catch (bytes memory reason) {
            console.log("AgentContract constructor reverted. Revert data:");
            console.logBytes(reason);
            vm.stopBroadcast();
            // Re-throw to make the script exit non-zero after logging
            revert("AgentContract deployment failed: constructor reverted");
        }

        vm.stopBroadcast();
    }
}
