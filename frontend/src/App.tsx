// App.tsx
import React, { useState, useEffect } from 'react';
import {createPublicClient, createWalletClient, custom, http, parseEther, formatEther, Hex} from 'viem';
import { PrivacyPreservingDeFiABI } from './abis/PrivacyPreservingDeFiABI';
import { ComplianceVerifierABI } from './abis/ComplianceVerifierABI';
import './App.css';

// Components
import ConnectWallet from './components/ConnectWallet';
import Dashboard from './components/Dashboard';
import TransferForm from './components/TransferForm';
import WithdrawForm from './components/WithdrawForm';
import ComplianceStatus from './components/ComplianceStatus';
import TransactionHistory from './components/TransactionHistory';
import AdminPanel from './components/AdminPanel';

// Mock ZK proof generator (in a real app, this would be using a proper ZK library)
import { generateMockZkProof } from './utils/zkProofGenerator';
import {baseSepolia} from "viem/chains";

function App() {
  // State variables
  const [account, setAccount] = useState<Hex | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [complianceStatus, setComplianceStatus] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [defiContractAddress, setDefiContractAddress] = useState<string>('0x7E3DE9bB767E6a36f686262D5fB9226BD5146783');
  const [complianceContractAddress, setComplianceContractAddress] = useState<string>('0xaEF0cC12F1ac324F774291cEC9e1903090eFD5b0');
  const [notification, setNotification] = useState<{message: string, type: string} | null>(null);

  // Create public client
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  // Connect wallet function
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsLoading(true);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        await fetchUserData(accounts[0]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        setIsLoading(false);
        showNotification('Failed to connect wallet', 'error');
      }
    } else {
      showNotification('Please install MetaMask', 'error');
    }
  };

  // Create wallet client
  const walletClient = account
      ? createWalletClient({
        chain: baseSepolia,
        transport: custom(window.ethereum as any),
        account,
      })
      : null;

  // Fetch user data
  const fetchUserData = async (userAccount: string) => {
    try {
      setIsLoading(true);

      // Get contract balance
      const balance = await publicClient.readContract({
        address: defiContractAddress as `0x${string}`,
        abi: PrivacyPreservingDeFiABI,
        functionName: 'getBalance',
        account: userAccount as `0x${string}`,
      });

      setBalance(formatEther(balance as bigint));

      // Get compliance status
      const compliance = await publicClient.readContract({
        address: defiContractAddress as `0x${string}`,
        abi: PrivacyPreservingDeFiABI,
        functionName: 'getUserComplianceStatus',
        args: [userAccount],
      });

      setComplianceStatus(compliance as boolean);

      // Check if admin (owner or compliance admin)
      const owner = await publicClient.readContract({
        address: defiContractAddress as `0x${string}`,
        abi: PrivacyPreservingDeFiABI,
        functionName: 'owner',
      });

      const complianceAdmin = await publicClient.readContract({
        address: defiContractAddress as `0x${string}`,
        abi: PrivacyPreservingDeFiABI,
        functionName: 'complianceAdmin',
      });

      setIsAdmin(
          userAccount.toLowerCase() === (owner as string).toLowerCase() ||
          userAccount.toLowerCase() === (complianceAdmin as string).toLowerCase()
      );

      // Get transaction history
      const txCount = await publicClient.readContract({
        address: defiContractAddress as `0x${string}`,
        abi: PrivacyPreservingDeFiABI,
        functionName: 'getTransactionCount',
        args: [userAccount],
      });

      const txs = [];
      for (let i = 0; i < Number(txCount); i++) {
        const tx = await publicClient.readContract({
          address: defiContractAddress as `0x${string}`,
          abi: PrivacyPreservingDeFiABI,
          functionName: 'getTransactionDetails',
          args: [userAccount, i],
        });
        txs.push(tx);
      }

      setTransactions(txs);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsLoading(false);
      showNotification('Failed to fetch user data', 'error');
    }
  };

  // Deposit function
  const deposit = async (amount: string) => {
    if (!walletClient || !account) return;

    try {
      setIsLoading(true);

      const hash = await walletClient.writeContract({
        address: defiContractAddress as `0x${string}`,
        abi: PrivacyPreservingDeFiABI,
        functionName: 'deposit',
        value: parseEther(amount),
      });

      await publicClient.waitForTransactionReceipt({ hash });

      await fetchUserData(account);
      setIsLoading(false);
      showNotification(`Successfully deposited ${amount} ETH`, 'success');
    } catch (error) {
      console.error('Error depositing funds:', error);
      setIsLoading(false);
      showNotification('Failed to deposit funds', 'error');
    }
  };

  // Transfer function
  const transfer = async (recipient: string, amount: string) => {
    if (!walletClient || !account) return;

    try {
      setIsLoading(true);

      // Generate ZK proof (mock implementation)
      const zkProof = generateMockZkProof(account, recipient, amount);

      const hash = await walletClient.writeContract({
        address: defiContractAddress as `0x${string}`,
        abi: PrivacyPreservingDeFiABI,
        functionName: 'privateTransfer',
        args: [recipient, parseEther(amount), zkProof],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      await fetchUserData(account);
      setIsLoading(false);
      showNotification(`Successfully transferred ${amount} ETH to ${recipient}`, 'success');
    } catch (error) {
      console.error('Error transferring funds:', error);
      setIsLoading(false);
      showNotification('Failed to transfer funds', 'error');
    }
  };

  // Withdraw function
  const withdraw = async (amount: string) => {
    if (!walletClient || !account) return;

    try {
      setIsLoading(true);

      // Generate ZK proof (mock implementation)
      const zkProof = generateMockZkProof(account, account, amount);

      const hash = await walletClient.writeContract({
        address: defiContractAddress as `0x${string}`,
        abi: PrivacyPreservingDeFiABI,
        functionName: 'withdraw',
        args: [parseEther(amount), zkProof],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      await fetchUserData(account);
      setIsLoading(false);
      showNotification(`Successfully withdrew ${amount} ETH`, 'success');
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      setIsLoading(false);
      showNotification('Failed to withdraw funds', 'error');
    }
  };

  // Set compliance verifier (admin function)
  const setComplianceVerifier = async (verifier: string, status: boolean) => {
    if (!walletClient || !account || !isAdmin) return;

    try {
      setIsLoading(true);

      const hash = await walletClient.writeContract({
        address: defiContractAddress as `0x${string}`,
        abi: PrivacyPreservingDeFiABI,
        functionName: 'setComplianceVerifier',
        args: [verifier, status],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      setIsLoading(false);
      showNotification(`Successfully updated compliance verifier status`, 'success');
    } catch (error) {
      console.error('Error setting compliance verifier:', error);
      setIsLoading(false);
      showNotification('Failed to update compliance verifier', 'error');
    }
  };

  // Verify KYC (admin function)
  const verifyKYC = async (user: string, status: boolean) => {
    if (!walletClient || !account || !isAdmin) return;

    try {
      setIsLoading(true);

      const hash = await walletClient.writeContract({
        address: complianceContractAddress as `0x${string}`,
        abi: ComplianceVerifierABI,
        functionName: 'verifyKYC',
        args: [user, status],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      setIsLoading(false);
      showNotification(`Successfully updated KYC status for ${user}`, 'success');
    } catch (error) {
      console.error('Error verifying KYC:', error);
      setIsLoading(false);
      showNotification('Failed to update KYC status', 'error');
    }
  };

  // Set risk score (admin function)
  const setRiskScore = async (user: string, score: number) => {
    if (!walletClient || !account || !isAdmin) return;

    try {
      setIsLoading(true);

      const hash = await walletClient.writeContract({
        address: complianceContractAddress as `0x${string}`,
        abi: ComplianceVerifierABI,
        functionName: 'setRiskScore',
        args: [user, score],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      setIsLoading(false);
      showNotification(`Successfully set risk score for ${user}`, 'success');
    } catch (error) {
      console.error('Error setting risk score:', error);
      setIsLoading(false);
      showNotification('Failed to set risk score', 'error');
    }
  };

  // Submit compliance proof (admin function)
  const submitComplianceProof = async (user: string) => {
    if (!walletClient || !account || !isAdmin) return;

    try {
      setIsLoading(true);

      const hash = await walletClient.writeContract({
        address: complianceContractAddress as `0x${string}`,
        abi: ComplianceVerifierABI,
        functionName: 'submitProofToDefi',
        args: [user],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      setIsLoading(false);
      showNotification(`Successfully submitted compliance proof for ${user}`, 'success');
    } catch (error) {
      console.error('Error submitting compliance proof:', error);
      setIsLoading(false);
      showNotification('Failed to submit compliance proof', 'error');
    }
  };

  // Notification handler
  const showNotification = (message: string, type: string) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Effect to refresh data periodically
  useEffect(() => {
    if (account) {
      const interval = setInterval(() => {
        fetchUserData(account);
      }, 30000); // refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [account]);

  return (
      <div className="app-container">
        <header className="app-header">
          <h1>Privacy-Preserving DeFi with ZK Compliance</h1>
          {account ? (
              <div className="account-info">
                <p className="account-address">{`${account.substring(0, 6)}...${account.substring(38)}`}</p>
                <button className="button secondary" onClick={() => setAccount(null)}>Disconnect</button>
              </div>
          ) : (
              <ConnectWallet onConnect={connectWallet} />
          )}
        </header>

        {notification && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
        )}

        {isLoading && <div className="loading-overlay">Processing...</div>}

        <main className="app-main">
          {!account ? (
              <div className="welcome-container">
                <h2>Welcome to Privacy-Preserving DeFi</h2>
                <p>Connect your wallet to get started with private transactions and compliant DeFi.</p>
                <ConnectWallet onConnect={connectWallet} />
              </div>
          ) : (
              <>
                <div className="dashboard-section">
                  <Dashboard
                      balance={balance}
                      complianceStatus={complianceStatus}
                      onDeposit={deposit}
                  />
                </div>

                <div className="transactions-section">
                  <div className="transactions-grid">
                    <div className="transaction-card">
                      <h3>Private Transfer</h3>
                      <TransferForm onTransfer={transfer} />
                    </div>
                    <div className="transaction-card">
                      <h3>Withdraw Funds</h3>
                      <WithdrawForm onWithdraw={withdraw} maxAmount={balance} />
                    </div>
                    <div className="transaction-card">
                      <h3>Compliance Status</h3>
                      <ComplianceStatus
                          status={complianceStatus}
                          account={account}
                      />
                    </div>
                  </div>
                </div>

                <div className="history-section">
                  <h3>Transaction History</h3>
                  <TransactionHistory transactions={transactions} />
                </div>

                {isAdmin && (
                    <div className="admin-section">
                      <h3>Admin Panel</h3>
                      <AdminPanel
                          onVerifyKYC={verifyKYC}
                          onSetRiskScore={setRiskScore}
                          onSetComplianceVerifier={setComplianceVerifier}
                          onSubmitComplianceProof={submitComplianceProof}
                      />
                    </div>
                )}
              </>
          )}
        </main>

        <footer className="app-footer">
          <p>Privacy-Preserving DeFi with Zero-Knowledge Proofs &copy; 2025</p>
        </footer>
      </div>
  );
}

export default App;