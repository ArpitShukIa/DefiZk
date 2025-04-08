export const PrivacyPreservingDeFiABI = [
    // View functions
    {
        "inputs": [],
        "name": "getBalance",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
        "name": "getUserComplianceStatus",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
        "name": "getTransactionCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "_user", "type": "address"},
            {"internalType": "uint256", "name": "_txId", "type": "uint256"}
        ],
        "name": "getTransactionDetails",
        "outputs": [
            {
                "components": [
                    {"internalType": "bytes32", "name": "zkProof", "type": "bytes32"},
                    {"internalType": "address", "name": "recipient", "type": "address"},
                    {"internalType": "uint256", "name": "amount", "type": "uint256"},
                    {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
                    {"internalType": "bool", "name": "complianceVerified", "type": "bool"}
                ],
                "internalType": "struct PrivacyPreservingDeFi.Transaction",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "complianceAdmin",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    // External functions
    {
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "_amount", "type": "uint256"},
            {"internalType": "bytes32", "name": "_zkProof", "type": "bytes32"}
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "_recipient", "type": "address"},
            {"internalType": "uint256", "name": "_amount", "type": "uint256"},
            {"internalType": "bytes32", "name": "_zkProof", "type": "bytes32"}
        ],
        "name": "privateTransfer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "bytes32", "name": "_kycHash", "type": "bytes32"},
            {"internalType": "bytes32", "name": "_amlVerification", "type": "bytes32"},
            {"internalType": "uint256", "name": "_riskScore", "type": "uint256"}
        ],
        "name": "submitComplianceProof",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    // Admin functions
    {
        "inputs": [
            {"internalType": "address", "name": "_verifier", "type": "address"},
            {"internalType": "bool", "name": "_status", "type": "bool"}
        ],
        "name": "setComplianceVerifier",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "_newAdmin", "type": "address"}],
        "name": "setComplianceAdmin",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_newScore", "type": "uint256"}],
        "name": "setMinComplianceScore",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];