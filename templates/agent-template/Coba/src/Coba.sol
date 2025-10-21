```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Coba is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant STAKER_ROLE = keccak256("STAKER_ROLE");

    struct StakingInfo {
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => mapping(address => StakingInfo)) private _stakes;

    event Staked(address indexed user, address indexed tokenAddress, uint256 amount);
    event Withdrawn(address indexed user, address indexed tokenAddress, uint256 amount);

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function stakeTokens(address tokenAddress, uint256 amount) external onlyRole(STAKER_ROLE) nonReentrant {
        IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), amount);
        _stakes[msg.sender][tokenAddress].amount += amount;
        _stakes[msg.sender][tokenAddress].timestamp = block.timestamp;

        emit Staked(msg.sender, tokenAddress, amount);
    }

    function withdrawTokens(address tokenAddress) external onlyRole(STAKER_ROLE) nonReentrant {
        uint256 amount = _stakes[msg.sender][tokenAddress].amount;
        require(amount > 0, "No tokens staked");

        IERC20(tokenAddress).safeTransfer(msg.sender, amount);
        _stakes[msg.sender][tokenAddress].amount = 0;

        emit Withdrawn(msg.sender, tokenAddress, amount);
    }

    function getStakeAmount(address user, address tokenAddress) external view returns (uint256) {
        return _stakes[user][tokenAddress].amount;
    }

    function getStakeTimestamp(address user, address tokenAddress) external view returns (uint256) {
        return _stakes[user][tokenAddress].timestamp;
    }
}
```

Please note that this contract uses OpenZeppelin libraries for secure and audited contract patterns. The contract allows users with the 'STAKER_ROLE' to stake and withdraw tokens. The contract also emits events when tokens are staked and withdrawn. The contract is non-reentrant to prevent re-entrancy attacks.