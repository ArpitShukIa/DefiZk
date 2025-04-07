import React, { useState } from 'react';

interface WithdrawFormProps {
    onWithdraw: (amount: string) => void;
    maxAmount: string;
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({ onWithdraw, maxAmount }) => {
    const [amount, setAmount] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (amount && parseFloat(amount) > 0 && parseFloat(amount) <= parseFloat(maxAmount)) {
            onWithdraw(amount);
            setAmount('');
        }
    };

    const setMaxAmount = () => {
        setAmount(maxAmount);
    };

    return (
        <form onSubmit={handleSubmit} className="transaction-form">
            <div className="form-group">
                <label htmlFor="withdraw-amount">Amount</label>
                <div className="input-group">
                    <input
                        id="withdraw-amount"
                        type="number"
                        step="0.0001"
                        min="0"
                        max={maxAmount}
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <span className="input-suffix">ETH</span>
                    <button type="button" className="max-button" onClick={setMaxAmount}>MAX</button>
                </div>
            </div>

            <div className="form-actions">
                <div className="privacy-indicator">
                    <span className="icon">🔒</span>
                    <span>Private Withdrawal</span>
                </div>
                <button type="submit" className="button primary">Withdraw</button>
            </div>
        </form>
    );
};

export default WithdrawForm;