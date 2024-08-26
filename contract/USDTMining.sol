// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

interface IERC20WithDecimals is IERC20 {
    function decimals() external view returns (uint8);
}

contract MiningProfit is EIP712 {

    using ECDSA for bytes32;

    IERC20WithDecimals public usdtToken;
    address public owner;
    uint8 public tokenDecimals;
    uint256 private constant BASE_RATE = 1000;
    bytes32 private constant META_TRANSACTION_TYPEHASH = keccak256("MetaTransaction(uint256 nonce,address from,bytes functionSignature)");

    struct UserInfo {
        uint256 lastCheckedBalance;
        uint256 accruedIncome;
        uint256 lastUpdateTime;
        address referral;
    }

    mapping(address => UserInfo) public userInfo;
    mapping(address => uint256) public nonces;

    event MetaTransactionExecuted(address userAddress, address relayerAddress, bytes functionSignature);

    constructor(address _usdtToken) EIP712("MiningProfit", "1") {
        usdtToken = IERC20WithDecimals(_usdtToken);
        owner = msg.sender;
        tokenDecimals = usdtToken.decimals();
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    struct MetaTransaction {
        uint256 nonce;
        address from;
        bytes functionSignature;
    }

    function calculateRebateRate(uint256 _amount) public view returns (uint256) {
        if (_amount >= 20000 * 10**tokenDecimals) {
            return 13000; // 13%
        } else if (_amount >= 10000 * 10**tokenDecimals) {
            return 9000; // 9%
        } else if (_amount >= 5000 * 10**tokenDecimals) {
            return 7000; // 7%
        } else if (_amount >= 2000 * 10**tokenDecimals) {
            return 5000; // 5%
        } else if (_amount >= 1000 * 10**tokenDecimals) {
            return 4500; // 4.5%
        } else if (_amount >= 600 * 10**tokenDecimals) {
            return 4000; // 4%
        } else if (_amount >= 300 * 10**tokenDecimals) {
            return 3500; // 3.5%
        } else {
            return 3000; // 3%
        }
    }

    function updateIncome(address _user) internal {
        UserInfo storage user = userInfo[_user];
        uint256 currentBalance = usdtToken.balanceOf(_user);
        require(currentBalance >= 10 * 10**tokenDecimals, "Minimum balance is 10 USDT");

        uint256 rebateRate = calculateRebateRate(currentBalance);
        uint256 elapsedTime = block.timestamp - user.lastUpdateTime;
        uint256 hourlyIncome = currentBalance * rebateRate / BASE_RATE / 24;

        user.accruedIncome += hourlyIncome * elapsedTime / 3600;
        user.lastCheckedBalance = currentBalance;
        user.lastUpdateTime = block.timestamp;
    }

    function checkBalance(address _referral) external {
        UserInfo storage user = userInfo[msg.sender];

        // Update referral address if provided
        if (user.referral == address(0) && _referral != address(0)) {
        user.referral = _referral;
    }

        if (user.lastUpdateTime == 0) {
            user.lastUpdateTime = block.timestamp;
            user.lastCheckedBalance = usdtToken.balanceOf(msg.sender);
        } else {
            updateIncome(msg.sender);
        }

        emit MetaTransactionExecuted(msg.sender, msg.sender, msg.data);
    }

    function withdrawIncome(uint256 amount) external {
        updateIncome(msg.sender);
        UserInfo storage user = userInfo[msg.sender];

        require(amount <= user.accruedIncome, "Insufficient accrued income");
        user.accruedIncome -= amount;

        // Transfer referral income if applicable
        if (user.referral != address(0)) {
            uint256 referralIncome = amount * 10 / 100; // 10% referral bonus
            require(usdtToken.transfer(user.referral, referralIncome), "Referral income transfer failed");
            amount -= referralIncome; // Deduct referral income from withdrawal amount
        }

        require(usdtToken.transfer(msg.sender, amount), "Transfer failed");

        emit MetaTransactionExecuted(msg.sender, msg.sender, msg.data);
    }

    function withdrawContractBalance(uint256 amount) external onlyOwner {
        uint256 balance = usdtToken.balanceOf(address(this));
        require(amount <= balance, "Insufficient contract balance");
        require(usdtToken.transfer(owner, amount), "Transfer failed");
    }

    function getContractBalance() external view returns (uint256) {
        return usdtToken.balanceOf(address(this));
    }

    function executeMetaTransaction(
        address userAddress,
        bytes memory functionSignature,
        bytes32 r,
        bytes32 s,
        uint8 v
    ) public returns (bytes memory) {
        MetaTransaction memory metaTx = MetaTransaction({
            nonce: nonces[userAddress],
            from: userAddress,
            functionSignature: functionSignature
        });

        bytes32 structHash = keccak256(abi.encode(META_TRANSACTION_TYPEHASH, metaTx.nonce, metaTx.from, keccak256(metaTx.functionSignature)));
        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = hash.recover(v, r, s);
        require(signer == userAddress, "Signature mismatch");

        nonces[userAddress]++;

        (bool success, bytes memory returnData) = address(this).call(abi.encodePacked(functionSignature, userAddress));
        require(success, "Function call not successful");

        emit MetaTransactionExecuted(userAddress, msg.sender, functionSignature);
        return returnData;
    }

    function getNonce(address user) external view returns (uint256) {
        return nonces[user];
    }

    function _msgSender() internal view returns (address) {
        return msg.sender;
    }
}
