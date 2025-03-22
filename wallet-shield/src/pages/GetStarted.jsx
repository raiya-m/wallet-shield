import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../styles.css';

function GetStarted() {
    const [file, setFile] = useState(null); 
    const [message, setMessage] = useState('')
    const navigate = useNavigate(); 

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) {
            setMessage("No file selected.");
            return;
        }

        if (selectedFile.type !== "application/json") {
            setMessage("Invalid file type. Please upload a JSON file.");
            setFile(null);
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            setMessage("File is too large. Maximum size allowed is 10MB.");
            setFile(null);
            return;
        }
        setFile(selectedFile);
        setMessage("Uploading file...");

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage(response.data.message || "File processed successfully!");

            navigate('/aianalysis'); 

        } catch (error) {
            if (error.response) {
                setMessage(`Error: ${error.response.data.error || "Upload failed."}`);
            } else {
                setMessage("An error occurred during upload.");
            }
        }
    };

    return (
        <div className="get-started">
            <main className="upload-section">
                <h1>Upload Carbon Credit Transactions</h1>
                <p>Upload a JSON file to analyze anomalies, detect fraud, and tokenize valid credits.</p>
                <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="file-input"
                />
                <button
                    onClick={() => document.getElementById('file-input').click()}
                    className="upload-button"
                >
                    Select and Upload File
                </button>
                {message && <p className="message">{message}</p>}
            </main>
        </div>
    );
}

export default GetStarted;
