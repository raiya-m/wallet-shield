import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bar } from 'react-chartjs-2'; 
import 'chart.js/auto'; 
import { useState, useEffect } from 'react';

const Aiananalysis = () => {
    const location = useLocation();
    const { flagged_transactions = [], message = '' } = location.state || {};
    const [chartData, setChartData] = useState(null);

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

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Gas Fee',
                        data: gasFeeData,
                        backgroundColor: 'rgba(108, 92, 231, 0.5)',  // Soft purple color
                        borderColor: 'rgba(108, 92, 231, 1)',  // Matching border
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(108, 92, 231, 0.7)',
                    },
                    {
                        label: 'Transaction Amount',
                        data: transactionAmountData,
                        backgroundColor: 'rgba(102, 51, 153, 0.5)',  // Lighter purple
                        borderColor: 'rgba(102, 51, 153, 1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(102, 51, 153, 0.7)',
                    }
                ]
            });
        }
    }, [flagged_transactions]);

    return (
        <div className="ai-analysis">
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

                    {chartData && (
                        <div style={{ marginTop: '30px', padding: '20px', borderRadius: '12px', backgroundColor: '#f3f3f8', boxShadow: '0px 4px 12px rgba(108, 92, 231, 0.2)' }}>
                            <h2>Transaction Data Visualization</h2>
                            <Bar
                                data={chartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                            labels: {
                                                fontFamily: 'Varela Round, sans-serif',
                                                fontSize: 14,
                                                fontColor: '#6c5ce7',
                                            }
                                        },
                                        tooltip: {
                                            backgroundColor: '#6c5ce7',
                                            titleFontFamily: 'Poppins, sans-serif',
                                            bodyFontFamily: 'Poppins, sans-serif',
                                            bodyFontSize: 14,
                                            bodyFontColor: '#fff',
                                        }
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            grid: {
                                                color: 'rgba(108, 92, 231, 0.2)', // Light purple grid lines
                                            },
                                            ticks: {
                                                fontFamily: 'Poppins, sans-serif',
                                                fontSize: 14,
                                                fontColor: '#6c5ce7',
                                            },
                                        },
                                        x: {
                                            ticks: {
                                                fontFamily: 'Poppins, sans-serif',
                                                fontSize: 14,
                                                fontColor: '#6c5ce7',
                                            },
                                        }
                                    },
                                    layout: {
                                        padding: 20
                                    }
                                }}
                            />
                        </div>
                    )}
                </>
            ) : (
                <p>No flagged transactions.</p>
            )}
        </div>
    );
}

export default Aiananalysis;
