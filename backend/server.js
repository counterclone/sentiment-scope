const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const { exec } = require('child_process');
const csv = require('csv-parser');
const bodyParser = require('body-parser');
//const { GoogleGenerativeAI } = require("@google/generative-ai")
const app = express();
const PORT = 3000;
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Helper function to read CSV and convert to JSON
const readCsvToJson = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (err) => reject(err));
    });
};

const readTweetsFromCsv = (filePath) => {
    return new Promise((resolve, reject) => {
        const tweets = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                if (row.tweet) {
                    tweets.push(row.tweet);
                }
            })
            .on('end', () => resolve(tweets.join('\n')))
            .on('error', (err) => reject(err));
    });
};

// Handle script execution based on input
app.post('/run-scripts', async (req, res) => {
    const { text, numeric, scripts } = req.body;

    // Save inputs to text files
    fs.writeFileSync('input.txt', text);
    fs.writeFileSync('rate.txt', numeric.toString());
    fs.writeFileSync('scripts.txt', scripts.join(','));

    let output = {};
    const csvData = {};

    const scriptProcesses = scripts.map((script) => {
        return new Promise((resolve) => {
            exec(`py ${script}.py`, (err, stdout, stderr) => {
                if (err) {
                    resolve({ [script]: `Error: ${stderr}` });
                } else {
                    resolve({ [script]: stdout });
                }
            });
        });
    });

    try {
        const results = await Promise.all(scriptProcesses);
        results.forEach((result) => {
            output = { ...output, ...result };
        });

        // Read CSV files
        if (scripts.includes('reddit')) {
            csvData.reddit = await readCsvToJson('output_r.csv');
        }
        if (scripts.includes('twitter')) {
            csvData.twitter = await readCsvToJson('output_t.csv');
        }
        if (scripts.includes('quora')) {
            csvData.quora = await readCsvToJson('output_q.csv');
        }

        res.json({ scriptOutput: output, csvData });
    } catch (error) {
        res.status(500).json({ error: 'Error executing scripts or reading CSV files' });
    }
});

app.post('/analysis', async (req, res) => {
    try {
        // Execute the merge.py script
        exec('python merge.py', (err, stdout, stderr) => {
            if (err) {
                console.error(`Error executing merge.py: ${stderr}`);
                return res.status(500).json({ error: `Error executing merge.py: ${stderr}` });
            }

            console.log(`merge.py output: ${stdout}`);

            
            readCsvToJson('results.csv')
                .then((data) => {
                    console.log('results.csv successfully read');
                    res.json({ data });
                })
                .catch((csvError) => {
                    console.error('Error reading results.csv:', csvError);
                    res.status(500).json({ error: 'Error reading results.csv' });
                });
        });
    } catch (error) {
        console.error('Unexpected error in /analysis route:', error);
        res.status(500).json({ error: 'Unexpected error in /analysis route' });
    }
});

app.use(express.json());

const { GoogleGenerativeAI } = require("@google/generative-ai");

// app.post('/chatbot', async (req, res) => {
//     try {
//         const tweets = await readTweetsFromCsv('output.csv');
//         const question = req.body.message;

//         const prompt = `Analyze the following comments and answer the question: ${question}\n\n${tweets}`;
//         console.log("request-sent");
//         console.log(prompt);

//         // Use the same key as working in Python
//         const genAI = new GoogleGenerativeAI({
//             apiKey: "AIzaSyDDi1TgHMDUerr6_51m1mxPzRSt4sNYCpc"
//         });

//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//         const result = await model.generateContent(prompt);
//         const response = await result.response;
//         const botResponse = response.text();

//         res.json({ reply: botResponse });

//     } catch (error) {
//         console.error('Error in /chatbot route:', error);
//         res.status(500).json({ error: 'Error processing chatbot request' });
//     }
// });

app.post('/chatbot', async (req, res) => {
    try {
        const tweets = await readTweetsFromCsv('output.csv');
        const question = req.body.message;

        const prompt = `Analyze the following comments and answer the question: ${question}\n\n${tweets}`;

        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
            {
                contents: [{
                    parts: [{ text: prompt }],
                    role: "user"
                }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': 'AIzaSyDDi1TgHMDUerr6_51m1mxPzRSt4sNYCpc'
                }
            }
        );

        const botResponse = response.data.candidates[0].content.parts[0].text;
        res.json({ reply: botResponse });

    } catch (error) {
        console.error('Error in /chatbot route:', error?.response?.data || error.message);
        res.status(500).json({ error: 'Error processing chatbot request' });
    }
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
