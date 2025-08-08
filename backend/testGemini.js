const fetch = require('node-fetch'); // if using Node <18. For Node 18+, you can use global fetch
require('dotenv').config(); // to load .env

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function testGemini() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const payload = {
    contents: [
      {
        parts: [
          {
            text: "Summarize the following text in a concise manner."
          }
        ]
      }
    ]
  };

  console.log("Sending payload to Gemini...");
  console.log(JSON.stringify(payload, null, 2));

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    console.log("✅ Response from Gemini:");
    console.log(JSON.stringify(data, null, 2));

    if (!res.ok) {
      throw new Error(`Gemini API Error: ${res.status} - ${JSON.stringify(data)}`);
    }

  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

testGemini();
