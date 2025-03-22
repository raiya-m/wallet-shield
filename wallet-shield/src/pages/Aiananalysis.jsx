import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bar } from 'react-chartjs-2'; 
import 'chart.js/auto'; 
import { useState, useEffect } from 'react';

const Aiananalysis = () => {
    const location = useLocation();
    const { flagged_transactions = [], message = '' } = location.state || {};
    useEffect(() => {
        if (flagged_transactions.length > 0) {
            const labels = flagged_transactions.map((txn) => txn.transaction_id);
            const gasFeeData = flagged_transactions.map((txn) => {
                const match = txn.reason.match(/Gas Fee: (\d+\.?\d*)/);
                return match ? parseFloat(match[1]) : 0;
            });
            const transactionAmountData = flagged_transactions.map((txn) => {
                const match = txn.reason.match(/Transaction Amount: (\d+\.?\d*)/);
                return match ? parseFloat(match[1]) : 0;
            });

           
        }
    }, [flagged_transactions]);
    return (
        <div className="ai-analysis" >
            <h1>AI Analysis Results</h1>

            {flagged_transactions.length > 0 ? (
                <>
                    <div style={{ marginBottom: '20px' }}>
                        <h2>Summary</h2>
                        <p><strong>Total Flagged Transactions:</strong> {flagged_transactions.length}</p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h2>Flagged Transactions</h2>
                        <table style={{ borderCollapse: 'collapse', width: '100%', margin: '20px 0', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f2f2f2' }}>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Transaction ID</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flagged_transactions.map((txn, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{txn.transaction_id}</td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{txn.reason}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                </>
            ) : (
                <p>No flagged transactions.</p>
            )}
        </div>
    );
}

export default Aiananalysis;
