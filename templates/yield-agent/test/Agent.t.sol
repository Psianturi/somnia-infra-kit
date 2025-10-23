// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/AgentContract.sol";

contract AgentTest is Test {
    AgentContract agent;
    address owner = address(2);
    address nonOwner = address(1);

    event Withdrawn(address indexed to, uint256 amount);

    function setUp() public {
        vm.prank(owner);
        agent = new AgentContract(owner);
    }

    function test_Constructor() public {
        assertEq(agent.owner(), owner);
        assertEq(agent.getYield(), 0);
    }

    function test_SetYield() public {
        vm.prank(owner);
        agent.setYield(100);
        assertEq(agent.getYield(), 100);
    }

    function test_SetYield_RevertsWhenNotOwner() public {
        vm.prank(nonOwner);
        vm.expectRevert();
        agent.setYield(100);
    }

    function test_SetYield_RevertsWhenZero() public {
        vm.prank(owner);
        vm.expectRevert("Yield must be positive");
        agent.setYield(0);
    }

    function test_GetYield() public {
        vm.prank(owner);
        agent.setYield(200);
        assertEq(agent.getYield(), 200);
    }

    function test_ReceiveEther() public {
        vm.deal(address(this), 1 ether);
        (bool success,) = address(agent).call{value: 0.5 ether}("");
        assertTrue(success);
        assertEq(address(agent).balance, 0.5 ether);
    }

    function test_Withdraw() public {
        // Fund the contract
        vm.deal(address(this), 1 ether);
        (bool success,) = address(agent).call{value: 1 ether}("");
        assertTrue(success);

        uint256 initialBalance = address(owner).balance;

        vm.prank(owner);
        agent.withdraw();

        assertEq(address(agent).balance, 0);
        assertEq(address(owner).balance, initialBalance + 1 ether);
    }

    function test_Withdraw_RevertsWhenNotOwner() public {
        vm.deal(address(this), 1 ether);
        (bool success,) = address(agent).call{value: 1 ether}("");
        assertTrue(success);

        vm.prank(nonOwner);
        vm.expectRevert();
        agent.withdraw();
    }

    function test_Withdraw_EmitsEvent() public {
        vm.deal(address(this), 1 ether);
        (bool success,) = address(agent).call{value: 1 ether}("");
        assertTrue(success);

        vm.prank(owner);
        vm.expectEmit(true, false, false, true);
        emit Withdrawn(owner, 1 ether);
        agent.withdraw();
    }
}
