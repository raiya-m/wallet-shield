import React from 'react';
import { useLocation } from 'react-router-dom';

const Aiananalysis = () => {
    const location = useLocation();
    const { flagged_transactions = [], message = '' } = location.state || {};
    return (
        <div className="ai-analysis">
            <h1>AI Analysis Results</h1>
            {message && <p>{message}</p>}
            {flagged_transactions.length > 0 ? (
                <ul>
                    {flagged_transactions.map((txn, index) => (
                        <li key={index}>
                            <p><strong>Transaction ID:</strong> {txn.transaction_id}</p>
                            <p><strong>Reason:</strong> {txn.reason}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No flagged transactions.</p>
            )}
        </div>
    );
}

export default Aiananalysis;
