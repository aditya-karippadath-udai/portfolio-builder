import config from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${config.GEMINI_API_KEY}`;

const callGemini = async (prompt) => {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    throw new ApiError(502, 'AI service request failed');
  }

  const result = await response.json();
  return result.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
};

export const generateBio = async ({ name, skills, experience }) => {
  const prompt = `
    Write a professional portfolio bio for the following person.
    Name: ${name}
    Skills: ${skills.join(', ')}
    Experience: ${experience}

    Requirements:
    - 3 to 4 sentences
    - First person tone
    - Highlight key skills and experience
    - End with what they are currently looking for
    - No filler phrases like "passionate" or "enthusiastic"
    
    Return only the bio text, no extra formatting.
  `;

  const bio = await callGemini(prompt);

  if (!bio) throw new ApiError(500, 'Failed to generate bio');

  return { bio };
};

export const generateProjectDescription = async ({ title, techStack, summary }) => {
  const prompt = `
    Write a concise project description for a portfolio.
    Project Title: ${title}
    Tech Stack: ${techStack.join(', ')}
    Summary: ${summary}

    Requirements:
    - 2 to 3 sentences
    - Mention the tech stack naturally
    - Focus on what the project does and its impact
    - Professional and direct tone

    Return only the description text, no extra formatting.
  `;

  const description = await callGemini(prompt);

  if (!description) throw new ApiError(500, 'Failed to generate project description');

  return { description };
};

export const generateSkillsSummary = async ({ skills, experience }) => {
  const prompt = `
    Write a skills summary section for a developer portfolio.
    Skills: ${skills.join(', ')}
    Experience: ${experience}

    Requirements:
    - 2 to 3 sentences
    - Group related skills naturally
    - Reflect experience level
    - No bullet points, plain paragraph only

    Return only the summary text, no extra formatting.
  `;

  const summary = await callGemini(prompt);

  if (!summary) throw new ApiError(500, 'Failed to generate skills summary');

  return { summary };
};