import React, { useState } from 'react';

interface TransferFormProps {
    onTransfer: (recipient: string, amount: string) => void;
}

const TransferForm: React.FC<TransferFormProps> = ({ onTransfer }) => {
    const [recipient, setRecipient] = useState<string>('');
    const [amount, setAmount] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (recipient && amount && parseFloat(amount) > 0) {
            onTransfer(recipient, amount);
            setAmount('');
            // Keep recipient for convenience
        }
    };

    return (
        <form onSubmit={handleSubmit} className="transaction-form">
            <div className="form-group">
                <label htmlFor="recipient">Recipient Address</label>
                <input
                    id="recipient"
                    type="text"
                    placeholder="0x..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="transfer-amount">Amount</label>
                <div className="input-group">
                    <input
                        id="transfer-amount"
                        type="number"
                        step="0.0001"
                        min="0"
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <span className="input-suffix">ETH</span>
                </div>
            </div>

            <div className="form-actions">
                <div className="privacy-indicator">
                    <span className="icon">🔒</span>
                    <span>Private Transfer</span>
                </div>
                <button type="submit" className="button primary">Send</button>
            </div>
        </form>
    );
};

export default TransferForm;