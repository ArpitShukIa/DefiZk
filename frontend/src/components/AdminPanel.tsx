import React, {useState} from 'react';

interface AdminPanelProps {
    onVerifyKYC: (user: string, status: boolean) => void;
    onSetRiskScore: (user: string, score: number) => void;
    onSetComplianceVerifier: (verifier: string, status: boolean) => void;
    onSubmitComplianceProof: (user: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
                                                   onVerifyKYC,
                                                   onSetRiskScore,
                                                   onSetComplianceVerifier,
                                                   onSubmitComplianceProof
                                               }) => {
    const [activeTab, setActiveTab] = useState<string>('kyc');
    const [kycUser, setKycUser] = useState<string>('');
    const [kycStatus, setKycStatus] = useState<boolean>(true);
    const [riskUser, setRiskUser] = useState<string>('');
    const [riskScore, setRiskScore] = useState<number>(50);
    const [verifierAddress, setVerifierAddress] = useState<string>('');
    const [verifierStatus, setVerifierStatus] = useState<boolean>(true);
    const [proofUser, setProofUser] = useState<string>('');

    const handleKycSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (kycUser) {
            onVerifyKYC(kycUser, kycStatus);
        }
    };

    const handleRiskSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (riskUser) {
            onSetRiskScore(riskUser, riskScore);
        }
    };

    const handleVerifierSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (verifierAddress) {
            onSetComplianceVerifier(verifierAddress, verifierStatus);
        }
    };

    const handleProofSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (proofUser) {
            onSubmitComplianceProof(proofUser);
        }
    };

    return (
        <div className="admin-panel">
            <div className="tab-header">
                <button
                    className={`tab-button ${activeTab === 'kyc' ? 'active' : ''}`}
                    onClick={() => setActiveTab('kyc')}
                >
                    KYC Verification
                </button>
                <button
                    className={`tab-button ${activeTab === 'risk' ? 'active' : ''}`}
                    onClick={() => setActiveTab('risk')}
                >
                    Risk Scoring
                </button>
                <button
                    className={`tab-button ${activeTab === 'verifier' ? 'active' : ''}`}
                    onClick={() => setActiveTab('verifier')}
                >
                    Compliance Verifiers
                </button>
                <button
                    className={`tab-button ${activeTab === 'proof' ? 'active' : ''}`}
                    onClick={() => setActiveTab('proof')}
                >
                    Submit Proof
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'kyc' && (
                    <form onSubmit={handleKycSubmit} className="admin-form">
                        <div className="form-group">
                            <label htmlFor="kyc-user">User Address</label>
                            <input
                                id="kyc-user"
                                type="text"
                                placeholder="0x..."
                                value={kycUser}
                                onChange={(e) => setKycUser(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group radio-group">
                            <label>KYC Status</label>
                            <div className="radio-options">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="kyc-status"
                                        checked={kycStatus}
                                        onChange={() => setKycStatus(true)}
                                    />
                                    Verified
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="kyc-status"
                                        checked={!kycStatus}
                                        onChange={() => setKycStatus(false)}
                                    />
                                    Not Verified
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="button primary">Update KYC Status</button>
                    </form>
                )}

                {activeTab === 'risk' && (
                    <form onSubmit={handleRiskSubmit} className="admin-form">
                        <div className="form-group">
                            <label htmlFor="risk-user">User Address</label>
                            <input
                                id="risk-user"
                                type="text"
                                placeholder="0x..."
                                value={riskUser}
                                onChange={(e) => setRiskUser(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="risk-score">Risk Score (0-100)</label>
                            <div className="slider-container">
                                <input
                                    id="risk-score"
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={riskScore}
                                    onChange={(e) => setRiskScore(parseInt(e.target.value))}
                                    className="slider"
                                />
                                <span className="slider-value">{riskScore}</span>
                            </div>
                            <div className="slider-labels">
                                <span>Low Risk</span>
                                <span>High Risk</span>
                            </div>
                        </div>

                        <button type="submit" className="button primary">Set Risk Score</button>
                    </form>
                )}

                {activeTab === 'verifier' && (
                    <form onSubmit={handleVerifierSubmit} className="admin-form">
                        <div className="form-group">
                            <label htmlFor="verifier-address">Verifier Address</label>
                            <input
                                id="verifier-address"
                                type="text"
                                placeholder="0x..."
                                value={verifierAddress}
                                onChange={(e) => setVerifierAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group radio-group">
                            <label>Verifier Status</label>
                            <div className="radio-options">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="verifier-status"
                                        checked={verifierStatus}
                                        onChange={() => setVerifierStatus(true)}
                                    />
                                    Active
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="verifier-status"
                                        checked={!verifierStatus}
                                        onChange={() => setVerifierStatus(false)}
                                    />
                                    Inactive
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="button primary">Update Verifier</button>
                    </form>
                )}

                {activeTab === 'proof' && (
                    <form onSubmit={handleProofSubmit} className="admin-form">
                        <div className="form-group">
                            <label htmlFor="proof-user">User Address</label>
                            <input
                                id="proof-user"
                                type="text"
                                placeholder="0x..."
                                value={proofUser}
                                onChange={(e) => setProofUser(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-info">
                            <p>
                                This will generate and submit compliance proof for the user based on their current KYC
                                status and risk score.
                            </p>
                        </div>

                        <button type="submit" className="button primary">Submit Compliance Proof</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;