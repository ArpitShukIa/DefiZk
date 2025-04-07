# Privacy-Preserving DeFi with Zero-Knowledge Compliance

This project demonstrates a privacy-preserving DeFi application that uses zero-knowledge proofs while maintaining regulatory compliance capabilities. It's built using the Foundry development framework.

## Overview

The system consists of two main components:

1. **PrivacyPreservingDeFi**: The main contract that handles deposits, withdrawals, and private transfers using ZK proofs
2. **ComplianceVerifier**: Handles KYC verification and risk scoring for users

## Features

- Privacy-preserving transfers using zero-knowledge proofs
- Regulatory compliance capabilities with KYC verification
- Risk scoring for users
- Admin controls for compliance verification
- Double-spending protection for ZK proofs
- Comprehensive test suite

## Requirements

- [Foundry](https://getfoundry.sh/)
- Solidity 0.8.19+

## Installation

```bash
git clone <repo-url>
cd privacy-preserving-defi
forge install
```

## Building

```bash
forge build
```

## Testing

```bash
forge test
```

For verbose output:

```bash
forge test -vvv
```

## Deployment

To deploy to a local network:

1. Start a local node (e.g., Anvil)
```bash
anvil
```

2. Deploy using the script
```bash
forge script script/Deploy.s.sol --fork-url http://localhost:8545 --private-key <private-key>
```

To deploy to a testnet or mainnet:

1. Set up environment variables
```bash
export PRIVATE_KEY=your_private_key
export SEPOLIA_RPC_URL=your_sepolia_rpc_url
export ETHERSCAN_API_KEY=your_etherscan_api_key
```

2. Deploy to the chosen network
```bash
forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --verify
```

## Usage

### User Flow

1. **KYC Verification**:
    - Users are verified through the ComplianceVerifier contract
    - Verification includes KYC status and risk score assessment

2. **Depositing Funds**:
    - Users deposit ETH into the PrivacyPreservingDeFi contract

3. **Private Transfers**:
    - Users generate a zero-knowledge proof (off-chain)
    - They submit the proof with their transfer transaction
    - The contract verifies the proof and compliance status before executing the transfer

4. **Withdrawals**:
    - Similar to transfers, but funds are sent to the user's wallet
    - Requires both a valid ZK proof and compliance verification

### Admin Operations

- Set compliance verifiers
- Adjust compliance thresholds
- Verify KYC status of users
- Set risk scores for users

## Security Considerations

- The ZK verification in this example is simplified. In a production environment, you would use a proper ZK proving system like Groth16 or PLONK
- The compliance verification should be integrated with proper KYC/AML providers
- Additional access controls and time locks should be implemented for admin functions
- Formal verification recommended before production use

## License

This project is licensed under MIT.