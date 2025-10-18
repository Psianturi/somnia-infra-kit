```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Cobain is AccessControl, Pausable {
    using SafeERC20 for IERC20;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    mapping(address => uint256) private _stakes;
    IERC20 private _token;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event PriceUpdated(uint256 newPrice);

    constructor(address token) {
        _token = IERC20(token);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(OPERATOR_ROLE, msg.sender);
    }

    function stake(uint256 amount) public whenNotPaused {
        _stakes[msg.sender] += amount;
        _token.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) public whenNotPaused {
        require(_stakes[msg.sender] >= amount, "Insufficient stake");
        _stakes[msg.sender] -= amount;
        _token.safeTransfer(msg.sender, amount);
        emit Unstaked(msg.sender, amount);
    }

    function stakeOf(address account) public view returns (uint256) {
        return _stakes[account];
    }

    function updatePrice(uint256 newPrice) public onlyRole(OPERATOR_ROLE) {
        emit PriceUpdated(newPrice);
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
```

This contract uses OpenZeppelin's AccessControl for role-based access control, Pausable for pausing contract functionality, and SafeERC20 for safe ERC20 token interactions.

The contract allows users to stake and unstake ERC20 tokens. The staked tokens are transferred from the user to the contract, and unstaked tokens are transferred back to the user. The contract also allows an operator to update the price, which could be used for price monitoring and automated trading.

The contract is pausable, which means that the contract's functionality can be paused and unpaused by an account with the DEFAULT_ADMIN_ROLE. This could be useful in case of emergencies.

Please note that this is a simplified example and may not cover all possible edge cases and security considerations. Always have your contracts audited by a professional before deploying them to the mainnet.