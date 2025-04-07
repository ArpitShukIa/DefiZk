import React from 'react';

interface ComplianceStatusProps {
    status: boolean;
    account: string;
}

const ComplianceStatus: React.FC<ComplianceStatusProps> = ({ status, account }) => {
    return (
        <div className="compliance-status">
            <div className="status-icon">
                {status ? (
                    <span className="icon compliant">✓</span>
                ) : (
                    <span className="icon non-compliant">✗</span>
                )}
            </div>

            <div className="status-text">
                <h4>Compliance Status</h4>
                <p className={status ? 'compliant' : 'non-compliant'}>
                    {status ? 'Compliant' : 'Non-Compliant'}
                </p>
            </div>

            {!status && (
                <div className="status-message">
                    <p>Your account requires compliance verification to perform transactions.</p>
                    <p className="hint">Please contact a compliance verifier.</p>
                </div>
            )}
        </div>
    );
};

export default ComplianceStatus;