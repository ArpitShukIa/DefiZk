import React from 'react';
import { formatEther } from 'viem';

interface Transaction {
    zkProof: string;
    recipient: string;
    amount: bigint;
    timestamp: bigint;
    complianceVerified: boolean;
}

interface TransactionHistoryProps {
    transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
    // Format timestamp to readable date
    const formatTimestamp = (timestamp: bigint) => {
        return new Date(Number(timestamp) * 1000).toLocaleString();
    };

    // Format address for display
    const formatAddress = (address: string) => {
        return `${address.substring(0, 6)}...${address.substring(38)}`;
    };

    return (
        <div className="transaction-history">
            {transactions.length === 0 ? (
                <p className="no-transactions">No transactions yet</p>
            ) : (
                <div className="transaction-table-container">
                    <table className="transaction-table">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>To</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map((tx, index) => (
                            <tr key={index}>
                                <td>{formatTimestamp(tx.timestamp)}</td>
                                <td>Transfer</td>
                                <td title={tx.recipient}>{formatAddress(tx.recipient)}</td>
                                <td>{formatEther(tx.amount)} ETH</td>
                                <td>
                    <span className={`status-pill ${tx.complianceVerified ? 'verified' : 'pending'}`}>
                      {tx.complianceVerified ? 'Verified' : 'Pending'}
                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TransactionHistory;