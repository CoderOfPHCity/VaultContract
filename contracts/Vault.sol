// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract Vault {
    error ONLY_OWNER();
    error ZERO_ADDRESS();

    mapping(address => mapping(address => uint256)) balances;
    uint256 duration = 1 minutes;
    address owner;

    function donate() external payable {
        require(msg.value > 0, "Amount must be positive");
        if (msg.sender == address(0)) {
            revert ZERO_ADDRESS();
        }
        balances[msg.sender][address(this)] += msg.value;
    }

    function onlyOwner() private view {
        if (owner != msg.sender) {
            revert ONLY_OWNER();
        }
    }

    function addBeneficiary(address _beneficiary) external {
        onlyOwner();
        if (_beneficiary == address(0)) {
            revert ZERO_ADDRESS();
        }
        balances[_beneficiary][address(this)] = 0;
    }

    function checkBalance(address _beneficiary)
        external
        view
        returns (uint256)
    {
        return balances[_beneficiary][address(this)];
    }

    function claim() external {
        require(block.timestamp >= duration, "not yet time");
        uint256 amount = balances[msg.sender][address(this)];
        require(amount > 0, "No bal to claim");

        balances[msg.sender][address(this)] = 0;
        payable(msg.sender).transfer(amount);
    }
}


