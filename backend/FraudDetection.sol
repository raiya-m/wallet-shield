// SPDX-License-Identifier: MIT
//open source
pragma solidity ^0.8.0;

contract FraudDetection {
    address public owner;

    // Mapping for flagged wallets with reasons
    mapping(address => string) public flaggedWallets;

    // Mapping for flagged transactions with reasons
    mapping(string => string) public flaggedTransactions;

    // Events for logging flagged entities
    event WalletFlagged(address indexed wallet, string reason);
    event TransactionFlagged(string indexed transactionHash, string reason);

    constructor() {
        owner = msg.sender; // Set deployer as the owner
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    // Function to flag a wallet
    function flagWallet(address wallet, string memory reason) public onlyOwner {
        require(bytes(reason).length > 0, "Reason is required");
        flaggedWallets[wallet] = reason;
        emit WalletFlagged(wallet, reason);
    }

    // Function to flag a transaction
    function flagTransaction(string memory transactionHash, string memory reason) public onlyOwner {
        require(bytes(reason).length > 0, "Reason is required");
        flaggedTransactions[transactionHash] = reason;
        emit TransactionFlagged(transactionHash, reason);
    }

    // Function to check if a wallet is flagged
    function isWalletFlagged(address wallet) public view returns (bool, string memory) {
        string memory reason = flaggedWallets[wallet];
        return (bytes(reason).length > 0, reason);
    }

    // Function to check if a transaction is flagged
    function isTransactionFlagged(string memory transactionHash) public view returns (bool, string memory) {
        string memory reason = flaggedTransactions[transactionHash];
        return (bytes(reason).length > 0, reason);
    }
}
