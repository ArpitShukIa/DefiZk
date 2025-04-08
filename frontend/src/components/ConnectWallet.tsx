import React from 'react';

interface ConnectWalletProps {
    onConnect: () => void;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ onConnect }) => {
    return (
        <button className="button primary connect-wallet" onClick={onConnect}>
        Connect Wallet
    </button>
);
};

export default ConnectWallet;
