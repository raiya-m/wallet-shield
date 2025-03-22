import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function GetStarted() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) {
            setMessage("No file selected.");
            return;
        }
        if (selectedFile.type !== "application/json") {
            setMessage("Invalid file type. Please upload a JSON file.");
            return;
        }
        setFile(selectedFile);
        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
            const response = await axios.post('http://127.0.0.1:5000/ai_analysis', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage(response.data.message || "Analysis complete!");

            navigate('/aianalysis', { state: { 
                flagged_transactions: response.data.flagged_transactions, 
                message: response.data.message 
            }});
        } catch (error) {
            setMessage("Error during analysis. Please try again.");
            console.error(error);
        }
    };

    return (
        <div className="get-started">
            <h1>Upload Transactions for AI Analysis</h1>
            <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-input"
            />
            <button onClick={() => document.getElementById('file-input').click()}>
                Upload JSON File
            </button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default GetStarted;
