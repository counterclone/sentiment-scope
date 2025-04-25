import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import 'chart.js/auto';
import './Analysis.css';

const hateWords = ['al', 'anti-Muslim', 'anti-national', 'arrogance', 'arrogant', 'ass', 'assassin', 'assassinated', 'assassins', 'attack', 'attacked', 'attacking', 'attacks', 'bakchod', 'bakchodi', 'barbarism', 'betray', 'betrayal', 'betrayed', 'bhikari', 'bhosadika', 'bhosadike', 'bitch', 'blame', 'blamed', 'blames', 'blaming', 'blast', 'blasts', 'blood', 'bloody', 'bombed', 'bombs', 'brandishing', 'bribary', 'bribe', 'bribed', 'bribes', 'bribing', 'characterless', 'chutiya', 'corrupt', 'corrupted', 'corruption', 'cremate', 'cruel', 'cruelty', 'curse', 'cursed', 'cuss', 'cut', 'darpok', 'dead', 'death', 'derogatory', 'destroy', 'destroyed', 'destroying', 'destruction', 'dictator', 'dictatorship', 'die', 'died', 'dies', 'dirty', 'discrimination', 'disgusting', 'executed', 'execution', 'executions', 'extremist', 'fail', 'failed', 'failure', 'fool', 'fooled', 'foolish', 'fraud', 'frauds', 'fuck', 'gareeb', 'gazwa', 'gazwaehind', 'genocide', 'hang', 'hanged', 'harass', 'harassed', 'harassment', 'hell', 'hindu', 'hoe', 'homicide', 'hot-headed', 'idiot', 'idiotic', 'idiots', 'insane', 'inshallah', 'islamic', 'jain', 'jammu', 'jew', 'jihad', 'jihadi', 'jihadis', 'joker', 'kafir', 'kashmir', 'khalistani', 'khoon', 'kill', 'killed', 'killer', 'killers', 'killing', 'killings', 'liar', 'lie', 'lied', 'lies', 'mad', 'massacre', 'mercenaries', 'mercenary', 'minority', 'mob', 'modi', 'murder', 'murderer', 'murderers', 'muslim', 'naked', 'pakistan', 'pedophile', 'pedophiles', 'poison', 'poisoned', 'psychotic', 'racism', 'racist', 'rape', 'raped', 'rapist', 'rapists', 'rascal', 'rascals', 'riot', 'riots', 'rob', 'robbed', 'robs', 'ruthless', 'ruthlessly', 'ruthlessness', 'scam', 'scammed', 'scammer', 'scams', 'sexism', 'sexist', 'shameless', 'shoot', 'shootings', 'shot', 'sick', 'slash', 'slashed', 'slashes', 'snake', 'snakes', 'stab', 'stabbed', 'stabbing', 'stabs', 'stain', 'strike', 'striked', 'strikes', 'stupid', 'sucide', 'suck', 'sucked', 'sucks', 'suffocate', 'supremacist', 'terror', 'terrorism', 'terrorist', 'terrorists', 'thrash', 'thrashed', 'thrashes', 'thrashing', 'traitor', 'turmoil', 'turmoiled', 'venom', 'venomous', 'violence', 'violent', 'violently', 'weapon', 'whore', 'nude', 'nudity', 'weapons', 'weaponize', 'weaponized', 'illegal', 'smuggle', 'smuggling', 'smuggled', 'smuggles', 'humla', 'hamla', 'deshdrohi'];

const Analysis = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [selectedSources, setSelectedSources] = useState({
        quora: true,
        twitter: true,
        reddit: true,
    });
    const [selectedWord, setSelectedWord] = useState('');
    const navigate = useNavigate();

    const handleRunAnalysis = async () => {
        try {
            const response = await axios.post('http://localhost:3000/analysis');
            const modifiedData = response.data.data.map(row => ({
                ...row,
                words: reason(row.tweet)
            }));
            setData(modifiedData);
            setFilteredData(modifiedData);
            setError('');
        } catch (err) {
            console.error(err);
            setError('Error fetching analysis data.');
            setData([]);
        }
    };

    const reason = (text) => {
        const lowerText = text.toLowerCase();
        const words = lowerText.split(' '); // Simplified cleaning
        const foundWords = hateWords.filter(word => words.includes(word));
        return foundWords.join(' ');
    };

    useEffect(() => {
        const filtered = data.filter((row) => selectedSources[row.source.toLowerCase()]);
        setFilteredData(filtered);
    }, [selectedSources, data]);

    const handleWordChange = (word) => {
        setSelectedWord(word);
    };

    const getPieChartData = () => {
        const counts = { Positive: 0, Negative: 0, Neutral: 0 };

        filteredData.forEach((row) => {
            if (counts.hasOwnProperty(row.type)) {
                counts[row.type] += 1;
            }
        });

        const total = counts.Positive + counts.Negative + counts.Neutral;
        const positivePercentage = total ? (counts.Positive / total) * 100 : 0;
        const negativePercentage = total ? (counts.Negative / total) * 100 : 0;
        const neutralPercentage = total ? (counts.Neutral / total) * 100 : 0;

        return {
            labels: ['Positive', 'Negative', 'Neutral'],
            datasets: [
                {
                    label: 'Sentiment Analysis',
                    data: [positivePercentage, negativePercentage, neutralPercentage],
                    backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
                },
            ],
        };
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setSelectedSources((prev) => ({ ...prev, [name]: checked }));
    };

    const availableWords = hateWords.filter(word => 
        data.some(row => row.words.includes(word))
    );

    const filteredWordData = data.filter(row => row.words.includes(selectedWord));

    const navigateToChatbot = () => {
        navigate('/chatbot');
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Analysis Page</h1>
            <button onClick={handleRunAnalysis}>Run Analysis</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {data.length > 0 && (
                <div>
                    <h2>Original Data</h2>
                    <table border="1" style={{ margin: '20px auto', textAlign: 'left', width: '80%' }}>
                        <thead>
                            <tr>
                                {Object.keys(data[0]).map((key) => (
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
            )}

            <div style={{ margin: '20px 0' }}>
                <label>
                    <input
                        type="checkbox"
                        name="quora"
                        checked={selectedSources.quora}
                        onChange={handleCheckboxChange}
                    />
                    Quora
                </label>
                <label style={{ marginLeft: '10px' }}>
                    <input
                        type="checkbox"
                        name="twitter"
                        checked={selectedSources.twitter}
                        onChange={handleCheckboxChange}
                    />
                    Twitter
                </label>
                <label style={{ marginLeft: '10px' }}>
                    <input
                        type="checkbox"
                        name="reddit"
                        checked={selectedSources.reddit}
                        onChange={handleCheckboxChange}
                    />
                    Reddit
                </label>
            </div>

            <div style={{ width: '60%', margin: 'auto' }}>
                <Pie data={getPieChartData()} />
            </div>

            {availableWords.length > 0 && (
                <div style={{ margin: '20px 0' }}>
                    {availableWords.map((word, index) => (
                        <label key={index} style={{ marginRight: '10px' }}>
                            <input
                                type="radio"
                                name="hateWord"
                                value={word}
                                checked={selectedWord === word}
                                onChange={() => handleWordChange(word)}
                            />
                            {word}
                        </label>
                    ))}
                </div>
            )}

            {filteredWordData.length > 0 && (
                <div>
                    <h2>Filtered Data</h2>
                    <table border="1" style={{ margin: '20px auto', textAlign: 'left', width: '80%' }}>
                        <thead>
                            <tr>
                                {Object.keys(filteredWordData[0]).map((key) => (
                                    <th key={key}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWordData.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((value, idx) => (
                                        <td key={idx}>{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <button onClick={navigateToChatbot} style={{ marginTop: '20px' }}>
                Go to Chatbot
            </button>
        </div>
    );
};

export default Analysis;