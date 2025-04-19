const express = require('express');
// const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS and JSON parsing
// app.use(cors());
app.use(express.json());

// Get current UTC datetime in YYYY-MM-DD HH:MM:SS format
const getCurrentUTCDateTime = () => {
    return new Date().toISOString()
        .replace('T', ' ')
        .replace(/\.\d+Z$/, '');
};

// Create meeting route
app.post('/api/meet', (req, res) => {
    try {
        const meetUrl = 'https://meet.google.com/new';
        
        console.log("Meeting Created:", {
            url: meetUrl,
            timestamp: getCurrentUTCDateTime(),
            user: 'r3yc0n1c'
        });

        res.json({
            success: true,
            meeting: {
                url: meetUrl,
                createdAt: getCurrentUTCDateTime(),
                createdBy: 'r3yc0n1c'
            }
        });
    } catch (error) {
        console.error("Error creating meeting:", {
            error: error.message,
            timestamp: getCurrentUTCDateTime(),
            user: 'r3yc0n1c'
        });
        
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: getCurrentUTCDateTime(),
            user: 'r3yc0n1c'
        });
    }
});

// Serve HTML page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Instant Meet</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 min-h-screen flex items-center justify-center">
            <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Create Instant Meeting</h1>
                
                <div class="mb-6 text-sm text-gray-600">
                    <p>Current Time (UTC): ${getCurrentUTCDateTime()}</p>
                    <p>User: r3yc0n1c</p>
                </div>

                <button 
                    onclick="createMeeting()"
                    class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                    New Meeting
                </button>

                <div id="result" class="mt-4 p-4 rounded-lg hidden">
                </div>
            </div>

            <script>
            async function createMeeting() {
                try {
                    const response = await fetch('/api/meet', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    const data = await response.json();
                    
                    if (data.success) {
                        // Open Meet in new tab
                        window.open(data.meeting.url, '_blank');
                        
                        // Show success message
                        const resultDiv = document.getElementById('result');
                        resultDiv.className = 'mt-4 p-4 rounded-lg bg-green-100 text-green-700';
                        resultDiv.innerHTML = \`
                            <p class="font-semibold">Meeting Created!</p>
                            <p class="text-sm mt-1">Created at: \${data.meeting.createdAt}</p>
                            <p class="text-sm">By: \${data.meeting.createdBy}</p>
                            <a href="\${data.meeting.url}" target="_blank" 
                               class="text-blue-500 hover:text-blue-600 underline mt-2 inline-block">
                                Open Meeting
                            </a>
                        \`;
                    } else {
                        throw new Error(data.error);
                    }
                    
                } catch (error) {
                    // Show error message
                    const resultDiv = document.getElementById('result');
                    resultDiv.className = 'mt-4 p-4 rounded-lg bg-red-100 text-red-700';
                    resultDiv.innerHTML = \`
                        <p class="font-semibold">Error!</p>
                        <p class="text-sm mt-1">\${error.message}</p>
                    \`;
                }
            }
            </script>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`
Server is running!
URL: http://localhost:${port}
Current Time (UTC): ${getCurrentUTCDateTime()}
User: r3yc0n1c
    `);
});