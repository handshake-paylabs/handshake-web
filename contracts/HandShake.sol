// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract HandshakeTokenTransfer is EIP712 {
    using ECDSA for bytes32;

    bytes32 private INITIATE_TYPEHASH =
        keccak256(
            "initiateTransaction(uint256 id,address sender,address receiver,uint256 amount,string tokenName)"
        );
    bytes32 private PERMIT_TYPEHASH =
        keccak256(
            "signByReceiver(uint256 id,address sender,address receiver,uint256 amount,string tokenName)"
        );

    struct Transaction {
        uint256 id;
        address sender;
        address receiver;
        uint256 amount;
        address tokenAddress;
        string tokenName;
    }

    constructor() EIP712("HandshakeTokenTransfer", "1") {}

    function initiateTransaction(
        bytes memory signature,
        Transaction memory _transaction
    ) internal view returns (address) {
        require(_transaction.amount > 0, "Amount must be greater than 0");
        require(_transaction.sender != address(0), "Invalid receiver address");

        bytes32 structHash = keccak256(
            abi.encode(
                INITIATE_TYPEHASH,
                _transaction.id,
                _transaction.sender,
                _transaction.receiver,
                _transaction.amount,
                keccak256(bytes(_transaction.tokenName))
            )
        );

        bytes32 hash = _hashTypedDataV4(structHash);

        address signer = ECDSA.recover(hash, signature);
        return signer;
    }

    function signByReceiver(
        bytes memory signature,
        Transaction memory _transaction
    ) internal view returns (address) {
        require(_transaction.amount > 0, "Amount must be greater than 0");
        require(
            _transaction.receiver != address(0),
            "Invalid receiver address"
        );

        bytes32 structHash = keccak256(
            abi.encode(
                PERMIT_TYPEHASH,
                _transaction.id,
                _transaction.sender,
                _transaction.receiver,
                _transaction.amount,
                keccak256(bytes(_transaction.tokenName))
            )
        );

        bytes32 hash = _hashTypedDataV4(structHash);

        address signer = ECDSA.recover(hash, signature);
        return signer;
    }

    function transferNative(
        bytes memory senderSign,
        bytes memory receiverSign,
        Transaction memory _transaction
    ) external payable {
        require(_transaction.amount > 0, "Amount must be greater than 0");
        require(
            _transaction.receiver != address(0),
            "Invalid receiver address"
        );
        require(_transaction.sender != address(0), "Invalid sender address");

        address sender = initiateTransaction(senderSign, _transaction);
        address receiver = signByReceiver(receiverSign, _transaction);

        require(sender == _transaction.sender, "Invalid signature of sender");
        require(
            receiver == _transaction.receiver,
            "Invalid signature of receiver"
        );
        payable(_transaction.receiver).transfer(msg.value);
    }

    function transferTokens(
        bytes memory senderSign,
        bytes memory receiverSign,
        Transaction memory _transaction
    ) external {
        require(_transaction.amount > 0, "Amount must be greater than 0");
        require(
            _transaction.receiver != address(0),
            "Invalid receiver address"
        );
        require(_transaction.sender != address(0), "Invalid sender address");

        address sender = initiateTransaction(senderSign, _transaction);
        address receiver = signByReceiver(receiverSign, _transaction);

        require(sender == _transaction.sender, "Invalid signature of sender");
        require(
            receiver == _transaction.receiver,
            "Invalid signature of receiver"
        );

        IERC20 token = IERC20(_transaction.tokenAddress);
        require(
            token.transferFrom(
                _transaction.sender,
                _transaction.receiver,
                _transaction.amount
            ),
            "Token transfer failed"
        );
    }

    function transferFromWithPermit(
        bytes memory senderSign,
        bytes memory receiverSign,
        uint256 deadline,
        Transaction memory _transaction,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(_transaction.amount > 0, "Amount must be greater than 0");
        require(
            _transaction.receiver != address(0),
            "Invalid receiver address"
        );
        require(_transaction.sender != address(0), "Invalid sender address");

        address sender = initiateTransaction(senderSign, _transaction);
        address receiver = signByReceiver(receiverSign, _transaction);

        require(sender == _transaction.sender, "Invalid signature of sender");
        require(
            receiver == _transaction.receiver,
            "Invalid signature of receiver"
        );
        IERC20Permit _token = IERC20Permit(_transaction.tokenAddress);
        IERC20 token = IERC20(_transaction.tokenAddress);
        _token.permit(
            _transaction.sender,
            address(this),
            _transaction.amount,
            deadline,
            v,
            r,
            s
        );
        require(
            token.transferFrom(
                _transaction.sender,
                _transaction.receiver,
                _transaction.amount
            ),
            "Token transfer failed"
        );
    }
}