import React, { useState } from 'react';

interface DashboardProps {
    balance: string;
    complianceStatus: boolean;
    onDeposit: (amount: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ balance, complianceStatus, onDeposit }) => {
    const [depositAmount, setDepositAmount] = useState<string>('');

    const handleDeposit = (e: React.FormEvent) => {
        e.preventDefault();
        if (depositAmount && parseFloat(depositAmount) > 0) {
            onDeposit(depositAmount);
            setDepositAmount('');
        }
    };

    return (
        <div className="dashboard">
            <div className="balance-card">
                <h2>Your Balance</h2>
                <div className="balance-amount">{balance} ETH</div>
                <div className={`compliance-badge ${complianceStatus ? 'compliant' : 'non-compliant'}`}>
                    {complianceStatus ? 'Compliant' : 'Non-Compliant'}
                </div>
            </div>

            <div className="deposit-card">
                <h2>Quick Deposit</h2>
                <form onSubmit={handleDeposit}>
                    <div className="input-group">
                        <input
                            type="number"
                            step="0.0001"
                            min="0"
                            placeholder="Amount in ETH"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            required
                        />
                        <span className="input-suffix">ETH</span>
                    </div>
                    <button type="submit" className="button primary">Deposit</button>
                </form>
            </div>
        </div>
    );
};

export default Dashboard;
