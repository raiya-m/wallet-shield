import React, { useState, useEffect } from 'react';
import axios from 'axios';


function AIAnalysis() {
    const [transactions, setTransactions] = useState([]);
    const [message, setMessage] = useState('');


    useEffect(() => {
        axios.get('http://127.0.0.1:5000/ai_analysis')
            .then(response => {
                setTransactions(response.data.flagged_transactions || []);
                setMessage(response.data.message || '');
            })
            .catch(error => {
                setMessage('Error fetching analysis results.');
            });
    }, []);


    return (
        <div className="ai-analysis">
            <h1>AI Analysis Results</h1>
            {message && <p>{message}</p>}
            {transactions.length > 0 ? (
                <ul>
                    {transactions.map((txn, index) => (
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


export default AIAnalysis;