const fetch = require('node-fetch');
const API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const MAX_CHARS = 16000;

function sanitizeContent(content) {
  if (!content || typeof content !== 'string') {
    return null;
  }

  const trimmed = content.trim();
  if (trimmed.length === 0) return null;

  return trimmed.length > MAX_CHARS
    ? trimmed.slice(0, MAX_CHARS) + '\n\n...[Truncated for token limit]'
    : trimmed;
}

async function callGeminiAPI(promptText) {
  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: promptText
          }
        ]
      }
    ]
  };

  try {
    const res = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        `Gemini API Error: ${res.status} - ${JSON.stringify(data)}`
      );
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return text;
  } catch (error) {
    console.error('❌ Gemini API error:', error.message);
    throw error;
  }
}

async function generateSummary(jsonData) {
  const content = sanitizeContent(jsonData.content);
  if (!content) {
    return 'Summary generation failed. No valid content provided.';
  }

  const prompt = `You are receiving plain text content. Summarize it with:
1. A brief executive summary (2–3 sentences)
2. Key points and main themes
3. Insights or recommendations (if any)

Text Content:
${content}`;

  try {
    return await callGeminiAPI(prompt);
  } catch {
    return 'Summary generation failed. Please try again later.';
  }
}

async function generateBPMN(jsonData) {
  const content = sanitizeContent(jsonData.content);
  if (!content) {
    return '<?xml version="1.0" encoding="UTF-8"?><definitions>No valid content</definitions>';
  }

  const prompt = `Based on the following process description, generate a valid BPMN 2.0 XML file that models the business process.

Text:
${content}

Requirements:
- Include start/end events, tasks, decisions, lanes (if needed), and proper flows.
- Output ONLY BPMN XML.
- No markdown or code blocks.

Begin with: <?xml version="1.0" encoding="UTF-8"?>`;

  try {
    let xml = await callGeminiAPI(prompt);
    xml = xml.replace(/```xml|```/g, '').trim();
    if (!xml.startsWith('<?xml')) {
      xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + xml;
    }
    return xml;
  } catch {
    return '<?xml version="1.0" encoding="UTF-8"?><definitions>Failed to generate BPMN</definitions>';
  }
}

async function generatePRD(jsonData) {
  const content = sanitizeContent(jsonData.content);
  if (!content) {
    return '# PRD generation failed. No valid content provided.';
  }

  const prompt = `Based on the following description, generate a full Product Requirements Document (PRD) in Markdown format.

Text:
${content}

Include the following sections:
- Executive Summary
- Product Overview
- Objectives and Goals
- User Stories
- Functional Requirements
- Non-Functional Requirements
- Technical Requirements
- UI Requirements
- Timeline and Milestones
- Risks and Mitigation`;

  try {
    return await callGeminiAPI(prompt);
  } catch {
    return '# PRD generation failed. Try again.';
  }
}

async function generateDRD(jsonData) {
  const content = sanitizeContent(jsonData.content);
  if (!content) {
    return '<?xml version="1.0" encoding="UTF-8"?><definitions>Invalid content</definitions>';
  }

  const prompt = `Based on the following business rules and conditions, generate a valid DMN XML file for a Decision Requirements Diagram (DRD).

Text:
${content}

Only return valid DMN XML, no code blocks or extra formatting.
Begin with: <?xml version="1.0" encoding="UTF-8"?>`;

  try {
    let dmn = await callGeminiAPI(prompt);
    dmn = dmn.replace(/```xml|```/g, '').trim();
    if (!dmn.startsWith('<?xml')) {
      dmn = '<?xml version="1.0" encoding="UTF-8"?>\n' + dmn;
    }
    return dmn;
  } catch {
    return '<?xml version="1.0" encoding="UTF-8"?><definitions>DRD generation failed</definitions>';
  }
}

async function analyzeContent(content, contentType = 'text') {
  const cleanContent = sanitizeContent(content);
  if (!cleanContent) return 'Content analysis failed. No valid input.';

  const prompt =
    contentType === 'text'
      ? `Analyze the following text and return:
- Summary
- Key Themes
- Insights
- Recommendations

Text:
${cleanContent}`
      : `Analyze the video information and suggest metadata: ${cleanContent}`;

  try {
    return await callGeminiAPI(prompt);
  } catch {
    return 'Content analysis failed.';
  }
}

module.exports = {
  generateSummary,
  generateBPMN,
  generatePRD,
  generateDRD,
  analyzeContent
};