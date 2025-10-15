// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/AgentContract.sol";

contract AgentTest is Test {
    AgentContract agent;

    function setUp() public {
        agent = new AgentContract();
    }

    function test_TriggerActionUpdatesTimestamp() public {
        vm.warp(1000); // Simulate time
        agent.triggerAgentAction("test data");
        assertEq(agent.lastActionTimestamp(), 1000);
    }

    function test_TriggerActionUpdatesData() public {
        string memory testData = "AI triggered action";
        agent.triggerAgentAction(testData);
        assertEq(agent.lastActionData(), testData);
    }

    function test_OnlyOwnerCanTriggerAction() public {
        vm.prank(address(0x123)); // Switch to different address
        vm.expectRevert("Only owner can call this function");
        agent.triggerAgentAction("unauthorized action");
    }

    function test_GetAgentStatus() public {
        vm.warp(2000);
        agent.triggerAgentAction("status check");
        (uint256 timestamp, string memory data) = agent.getAgentStatus();
        assertEq(timestamp, 2000);
        assertEq(data, "status check");
    }
}