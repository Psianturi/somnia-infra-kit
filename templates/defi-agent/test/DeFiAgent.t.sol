// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/DeFiAgent.sol";

contract DeFiAgentTest is Test {
    DeFiAgent agent;
    uint256 constant PRICE_THRESHOLD = 1000;

    function setUp() public {
        agent = new DeFiAgent(PRICE_THRESHOLD);
    }

    function test_InitialState() public {
        assertEq(agent.priceThreshold(), PRICE_THRESHOLD);
        assertEq(agent.isActive(), true);
        assertEq(agent.owner(), address(this));
    }

    function test_UpdatePrice() public {
        vm.warp(1000);
        agent.updatePrice(500);
        
        (uint256 price, , uint256 timestamp, ) = agent.getAgentStatus();
        assertEq(price, 500);
        assertEq(timestamp, 1000);
    }

    function test_PriceThresholdTrigger() public {
        vm.expectEmit(true, true, true, true);
        emit DeFiAgent.ThresholdTriggered(1500, "BUY_SIGNAL", block.timestamp);
        
        agent.updatePrice(1500);
    }

    function test_SellSignalTrigger() public {
        vm.expectEmit(true, true, true, true);
        emit DeFiAgent.ThresholdTriggered(700, "SELL_SIGNAL", block.timestamp);
        
        agent.updatePrice(700); // 70% of threshold triggers sell
    }

    function test_OnlyOwnerCanUpdate() public {
        vm.prank(address(0x123));
        vm.expectRevert("Only owner can call this function");
        agent.updatePrice(500);
    }

    function test_ToggleAgent() public {
        agent.toggleAgent();
        assertEq(agent.isActive(), false);
        
        vm.expectRevert("Agent is not active");
        agent.updatePrice(500);
    }
}