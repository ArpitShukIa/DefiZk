// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/PrivacyPreservingDeFi.sol";
import "../src/ComplianceVerifier.sol";

contract PrivacyPreservingDeFiTest is Test {
    PrivacyPreservingDeFi public defi;
    ComplianceVerifier public compliance;

    address public owner = address(1);
    address public user1 = address(2);
    address public user2 = address(3);

    bytes32 public mockZkProof = keccak256(abi.encodePacked("valid_zk_proof"));
    bytes32 public mockZkProof2 = keccak256(abi.encodePacked("valid_zk_proof_2"));

    function setUp() public {
        vm.startPrank(owner);
        defi = new PrivacyPreservingDeFi();
        compliance = new ComplianceVerifier(address(defi));

        // Set compliance verifier
        defi.setComplianceVerifier(address(compliance), true);

        // Deal some ETH to users for testing
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
        vm.stopPrank();
    }

    function testDeposit() public {
        vm.startPrank(user1);
        defi.deposit{value: 1 ether}();
        assertEq(defi.getBalance(), 1 ether, "Balance should be 1 ether after deposit");
        vm.stopPrank();
    }

    function testFailDepositZero() public {
        vm.startPrank(user1);
        defi.deposit{value: 0}();
        vm.stopPrank();
    }

    function testComplianceVerification() public {
        vm.startPrank(owner);

        // Verify KYC and set risk score for user1
        compliance.verifyKYC(user1, true);
        compliance.setRiskScore(user1, 50); // Low risk score = good

        // Submit compliance proof to DeFi contract
        compliance.submitProofToDefi(user1);

        vm.stopPrank();

        bool isCompliant = defi.getUserComplianceStatus(user1);
        assertTrue(isCompliant, "User1 should be compliant");
    }

    function testFailTransferWithoutCompliance() public {
        vm.startPrank(user1);
        defi.deposit{value: 1 ether}();

        // Try to transfer without compliance - should fail
        defi.privateTransfer(user2, 0.5 ether, mockZkProof);
        vm.stopPrank();
    }

    function testPrivateTransfer() public {
        // Setup compliance for both users
        vm.startPrank(owner);
        compliance.verifyKYC(user1, true);
        compliance.setRiskScore(user1, 50);
        compliance.submitProofToDefi(user1);

        compliance.verifyKYC(user2, true);
        compliance.setRiskScore(user2, 50);
        compliance.submitProofToDefi(user2);
        vm.stopPrank();

        // User1 deposits and transfers to user2
        vm.startPrank(user1);
        defi.deposit{value: 1 ether}();
        defi.privateTransfer(user2, 0.5 ether, mockZkProof);
        vm.stopPrank();

        // Check balances
        vm.startPrank(user1);
        assertEq(defi.getBalance(), 0.5 ether, "User1 should have 0.5 ether remaining");
        vm.stopPrank();

        vm.startPrank(user2);
        assertEq(defi.getBalance(), 0.5 ether, "User2 should have received 0.5 ether");
        vm.stopPrank();
    }

    function testWithdraw() public {
        // Setup compliance for user1
        vm.startPrank(owner);
        compliance.verifyKYC(user1, true);
        compliance.setRiskScore(user1, 50);
        compliance.submitProofToDefi(user1);
        vm.stopPrank();

        // Initial balance check
        uint256 initialBalance = user1.balance;

        // User1 deposits and then withdraws
        vm.startPrank(user1);
        defi.deposit{value: 1 ether}();
        defi.withdraw(0.5 ether, mockZkProof);
        vm.stopPrank();

        // Check contract balance
        vm.startPrank(user1);
        assertEq(defi.getBalance(), 0.5 ether, "User1 should have 0.5 ether remaining in contract");
        vm.stopPrank();

        // Check actual ETH balance - should be initial minus 1 plus 0.5
        assertEq(user1.balance, initialBalance - 1 ether + 0.5 ether, "User1 wallet balance incorrect after withdrawal");
    }

    function testFailReuseZkProof() public {
        // Setup compliance for both users
        vm.startPrank(owner);
        compliance.verifyKYC(user1, true);
        compliance.setRiskScore(user1, 50);
        compliance.submitProofToDefi(user1);

        compliance.verifyKYC(user2, true);
        compliance.setRiskScore(user2, 50);
        compliance.submitProofToDefi(user2);
        vm.stopPrank();

        // User1 deposits and makes two transfers with the same ZK proof
        vm.startPrank(user1);
        defi.deposit{value: 1 ether}();
        defi.privateTransfer(user2, 0.4 ether, mockZkProof);
        // This should fail - reusing the same proof
        defi.privateTransfer(user2, 0.1 ether, mockZkProof);
        vm.stopPrank();
    }

    function testNonCompliantUser() public {
        vm.startPrank(owner);
        // Verify KYC but set high risk score (non-compliant)
        compliance.verifyKYC(user1, true);
        compliance.setRiskScore(user1, 90); // High risk score = bad
        compliance.submitProofToDefi(user1);
        vm.stopPrank();

        bool isCompliant = defi.getUserComplianceStatus(user1);
        assertFalse(isCompliant, "User1 should not be compliant with high risk score");
    }

    function testSetComplianceAdmin() public {
        address newAdmin = address(4);

        vm.startPrank(owner);
        defi.setComplianceAdmin(newAdmin);
        vm.stopPrank();

        vm.startPrank(newAdmin);
        // New admin should be able to change compliance parameters
        defi.setMinComplianceScore(60);
        vm.stopPrank();

        vm.startPrank(user1);
        // User should not be able to change compliance parameters
        vm.expectRevert("Only compliance admin can call this function");
        defi.setMinComplianceScore(80);
        vm.stopPrank();
    }

    function testTransactionDetails() public {
        // Setup compliance for both users
        vm.startPrank(owner);
        compliance.verifyKYC(user1, true);
        compliance.setRiskScore(user1, 50);
        compliance.submitProofToDefi(user1);

        compliance.verifyKYC(user2, true);
        compliance.setRiskScore(user2, 50);
        compliance.submitProofToDefi(user2);
        vm.stopPrank();

        // User1 deposits and transfers to user2
        vm.startPrank(user1);
        defi.deposit{value: 1 ether}();
        defi.privateTransfer(user2, 0.5 ether, mockZkProof);
        vm.stopPrank();

        // Check transaction count and details
        vm.startPrank(user1);
        assertEq(defi.getTransactionCount(user1), 1, "Should have 1 transaction");

        PrivacyPreservingDeFi.Transaction memory tx = defi.getTransactionDetails(user1, 0);
        assertEq(tx.zkProof, mockZkProof, "ZK proof mismatch");
        assertEq(tx.recipient, user2, "Recipient mismatch");
        assertEq(tx.amount, 0.5 ether, "Amount mismatch");
        assertTrue(tx.complianceVerified, "Compliance should be verified");
        vm.stopPrank();
    }

    function testMultipleTransactions() public {
        // Setup compliance for both users
        vm.startPrank(owner);
        compliance.verifyKYC(user1, true);
        compliance.setRiskScore(user1, 50);
        compliance.submitProofToDefi(user1);

        compliance.verifyKYC(user2, true);
        compliance.setRiskScore(user2, 50);
        compliance.submitProofToDefi(user2);
        vm.stopPrank();

        // User1 deposits and transfers to user2 twice with different proofs
        vm.startPrank(user1);
        defi.deposit{value: 1 ether}();
        defi.privateTransfer(user2, 0.3 ether, mockZkProof);
        defi.privateTransfer(user2, 0.2 ether, mockZkProof2);
        vm.stopPrank();

        // Check transaction count
        vm.startPrank(user1);
        assertEq(defi.getTransactionCount(user1), 2, "Should have 2 transactions");
        vm.stopPrank();

        // Check balances
        vm.startPrank(user1);
        assertEq(defi.getBalance(), 0.5 ether, "User1 should have 0.5 ether remaining");
        vm.stopPrank();

        vm.startPrank(user2);
        assertEq(defi.getBalance(), 0.5 ether, "User2 should have received 0.5 ether total");
        vm.stopPrank();
    }
}