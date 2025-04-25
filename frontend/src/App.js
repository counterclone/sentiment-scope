
import React, { useState } from 'react';
import axios from 'axios';
import { Routes, Route, Link } from 'react-router-dom';
import Chatbot from './components/Chatbot';
import Analysis from './components/Analysis';

const App = () => {
    const [textInput, setTextInput] = useState('');
    const [numericInput, setNumericInput] = useState(1);
    const [selectedScripts, setSelectedScripts] = useState({
        reddit: false,
        twitter: false,
        quora: false,
    });
    const [output, setOutput] = useState({});
    const [csvData, setCsvData] = useState({});
    const [showButtons, setShowButtons] = useState(false);

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setSelectedScripts((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:3000/run-scripts', {
                text: textInput,
                numeric: numericInput,
                scripts: Object.keys(selectedScripts).filter((key) => selectedScripts[key]),
            });
            setOutput(response.data.scriptOutput);
            setCsvData(response.data.csvData);
            setShowButtons(true);
        } catch (err) {
            setOutput({ error: err.response?.data || 'Error occurred' });
        }
    };

    const renderTable = (data, source) => (
        <div>
            <h4>{`Source: ${source}`}</h4>
            <table border="1" style={{ margin: '10px auto', textAlign: 'left', width: '80%' }}>
                <thead>
                    <tr>
                        {Object.keys(data[0] || {}).map((key) => (
                            <th key={key}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            {Object.values(row).map((value, idx) => (
                                <td key={idx}>{value}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div>
            <Routes>
                {/* Main Page */}
                <Route
                    path="/"
                    element={
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            <h1>SentimentScope</h1>
                            <div style={{ margin: '20px 0' }}>
                                <input
                                    type="text"
                                    placeholder="Enter text"
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    style={{ marginRight: '10px', padding: '5px' }}
                                />
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={numericInput}
                                    onChange={(e) => setNumericInput(Number(e.target.value))}
                                    style={{ padding: '5px' }}
                                />
                            </div>
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="reddit"
                                        checked={selectedScripts.reddit}
                                        onChange={handleCheckboxChange}
                                    />
                                    Reddit
                                </label>
                                <label style={{ marginLeft: '10px' }}>
                                    <input
                                        type="checkbox"
                                        name="twitter"
                                        checked={selectedScripts.twitter}
                                        onChange={handleCheckboxChange}
                                    />
                                    Twitter
                                </label>
                                <label style={{ marginLeft: '10px' }}>
                                    <input
                                        type="checkbox"
                                        name="quora"
                                        checked={selectedScripts.quora}
                                        onChange={handleCheckboxChange}
                                    />
                                    Quora
                                </label>
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                <button onClick={handleSubmit}>Submit</button>
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                <h3>Script Output:</h3>
                                <pre>{JSON.stringify(output, null, 2)}</pre>
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                <h3>CSV Data:</h3>
                                {Object.entries(csvData).map(([source, data]) => renderTable(data, source))}
                            </div>
                            {showButtons && (
                                <div style={{ marginTop: '20px' }}>
                                    <Link to="/analysis">
                                        <button>Analysis</button>
                                    </Link>
                                    <Link to="/chatbot" style={{ marginLeft: '10px' }}>
                                        <button>Chatbot</button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    }
                />

                {/* Routed Pages */}
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/chatbot" element={<Chatbot />} />
            </Routes>
        </div>
    );
};

export default App;
