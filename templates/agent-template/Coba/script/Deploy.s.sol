// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.19;

  import "forge-std/Script.sol";
  import "../src/Coba.sol";

  contract DeployCoba is Script {
    function run() external {
      vm.startBroadcast();
          
      Coba agent = new Coba();
          
      console.log("Coba deployed at:", address(agent));
          
      vm.stopBroadcast();
    }
  }