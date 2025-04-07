// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

// Compliance Verifier contract
contract ComplianceVerifier {
    address public owner;
    address public defiContract;

    mapping(address => bool) private kycVerified;
    mapping(address => uint256) private userRiskScores;

    event KYCVerified(address indexed user, bool status);
    event RiskScoreUpdated(address indexed user, uint256 score);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(address _defiContract) {
        owner = msg.sender;
        defiContract = _defiContract;
    }

    function verifyKYC(address _user, bool _status) external onlyOwner {
        kycVerified[_user] = _status;
        emit KYCVerified(_user, _status);
    }

    function setRiskScore(address _user, uint256 _score) external onlyOwner {
        require(_score <= 100, "Score must be between 0 and 100");
        userRiskScores[_user] = _score;
        emit RiskScoreUpdated(_user, _score);
    }

    function getKYCStatus(address _user) external view returns (bool) {
        return kycVerified[_user];
    }

    function getRiskScore(address _user) external view returns (uint256) {
        return userRiskScores[_user];
    }

    function generateComplianceProof(address _user) external view returns (bytes32, bytes32, uint256) {
        require(kycVerified[_user], "User not KYC verified");

        bytes32 kycHash = keccak256(abi.encodePacked(_user, "KYC_VERIFIED", block.timestamp));
        bytes32 amlVerification = keccak256(abi.encodePacked(_user, "AML_CHECK", userRiskScores[_user]));

        return (kycHash, amlVerification, userRiskScores[_user]);
    }

    function submitProofToDefi(address _user) external onlyOwner {
        require(kycVerified[_user], "User not KYC verified");

        (bytes32 kycHash, bytes32 amlVerification, uint256 riskScore) = this.generateComplianceProof(_user);

        // Call the DeFi contract to verify compliance
        // Note: This requires the ComplianceVerifier to be registered with the DeFi contract
        (bool success,) = defiContract.call(
            abi.encodeWithSignature(
                "verifyCompliance(address,bytes32,bytes32,uint256)",
                _user,
                kycHash,
                amlVerification,
                riskScore
            )
        );

        require(success, "Failed to submit compliance proof");
    }

    function setDefiContract(address _defiContract) external onlyOwner {
        defiContract = _defiContract;
    }
}
