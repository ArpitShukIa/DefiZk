// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/PrivacyPreservingDeFi.sol";
import "../src/ComplianceVerifier.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy main contract
        PrivacyPreservingDeFi defi = new PrivacyPreservingDeFi();
        console.log("PrivacyPreservingDeFi deployed at:", address(defi));

        // Deploy compliance verifier
        ComplianceVerifier compliance = new ComplianceVerifier(address(defi));
        console.log("ComplianceVerifier deployed at:", address(compliance));

        // Set compliance verifier in main contract
        defi.setComplianceVerifier(address(compliance), true);
        console.log("Compliance verifier set in DeFi contract");

        vm.stopBroadcast();
    }
}