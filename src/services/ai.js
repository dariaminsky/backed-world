// Using node-fetch for backend/Node.js context.
// For React Native, this would be different (e.g., using built-in fetch or a library like axios).
// For web (React DOM), global fetch is available.
// Consider making fetch an injectable dependency if environment varies significantly.
import fetch from 'node-fetch';

const GOOGLE_AI_API_KEY = process.env.REACT_APP_GOOGLE_AI_API_KEY;

// Helper to call Google AI API
const callGoogleAI = async (prompt, showToast) => {
  if (!GOOGLE_AI_API_KEY) {
    console.error('Google AI API Key is missing.');
    showToast('AI Service is not configured.', 'error');
    return null;
  }
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_AI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Google AI API Error:', response.status, errorBody);
      throw new Error(`Failed to generate content. Status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error('Invalid response structure from Google AI:', data);
      throw new Error('Invalid response structure from AI.');
    }
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('AI Generation Error:', error);
    showToast(error.message || 'AI request failed. Please try again.', 'error');
    return null;
  }
};

export const generateAIBudget = async (projectDescription, projectGoal, showToast, setBudgetItems) => {
  const prompt = `Create a realistic budget breakdown for this project: "${projectDescription}" with a goal of $${projectGoal}.

Return exactly 5-7 budget items in this exact JSON format (no markdown, no extra text):
[
  {"name": "Item Name", "amount": 150.00, "category": "Equipment", "description": "Brief description"},
  {"name": "Item Name", "amount": 75.00, "category": "Software", "description": "Brief description"}
]

Categories must be one of: Equipment, Software, Marketing, Materials, Services, Other
Amounts should be realistic and add up to roughly the goal amount. Ensure 'amount' is a number.`;

  const budgetText = await callGoogleAI(prompt, showToast);
  if (!budgetText) return false;

  try {
    const budgetData = JSON.parse(budgetText.replace(/```json\n?|\n?```/g, ''));
    budgetData.forEach(item => {
      const itemId = Date.now().toString() + Math.random().toString(36).substr(2, 9); // More unique ID
      const newItem = {
        id: itemId,
        ...item,
        amount: parseFloat(item.amount) || 0, // Ensure amount is a number
        createdAt: new Date().toISOString(),
        isAIGenerated: true
      };
      setBudgetItems(prev => new Map(prev).set(itemId, newItem));
    });
    showToast('AI budget generated successfully!', 'success');
    return true;
  } catch (error) {
    console.error('AI Budget Parsing Error:', error, "Raw text:", budgetText);
    showToast('Failed to parse AI budget response.', 'error');
    return false;
  }
};

export const generateGrantIdeas = async (projectDescription, projectCategory, showToast, setGrants) => {
  const prompt = `Find relevant grants for this ${projectCategory} project: "${projectDescription}"

Return exactly 3-5 grant opportunities in this exact JSON format (no markdown, no extra text):
[
  {
    "name": "Grant Name",
    "organization": "Organization Name",
    "amount": "Up to $X,XXX",
    "deadline": "Month Year or Rolling",
    "description": "Brief description of what they fund",
    "eligibility": "Key eligibility requirements",
    "website": "https://website.com or Contact for info"
  }
]

Focus on real, relevant grants for ${projectCategory} projects. Include a mix of government, foundation, and corporate grants.`;

  const grantsText = await callGoogleAI(prompt, showToast);
  if (!grantsText) return false;

  try {
    const grantsData = JSON.parse(grantsText.replace(/```json\n?|\n?```/g, ''));
    grantsData.forEach(grant => {
      const grantId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const newGrant = {
        id: grantId,
        ...grant,
        createdAt: new Date().toISOString(),
        isAIGenerated: true
      };
      setGrants(prev => new Map(prev).set(grantId, newGrant));
    });
    showToast('Grant opportunities found!', 'success');
    return true;
  } catch (error) {
    console.error('Grant Parsing Error:', error, "Raw text:", grantsText);
    showToast('Failed to parse grant opportunities.', 'error');
    return false;
  }
};

export const generateAvatar = async (name, showToast) => {
  // This function doesn't use Google AI, so it's simpler.
  try {
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
    // No toast needed for success here, as it's just returning a URL.
    return avatarUrl;
  } catch (error) {
    console.error('Avatar Generation Error:', error);
    showToast('Failed to generate avatar.', 'error'); // Toast on error
    return null;
  }
};

export const generateProjectImage = async (projectTitle, category, showToast) => {
  // This function uses Unsplash, not Google AI.
  try {
    const keywords = `${category},${projectTitle.split(' ').slice(0, 3).join(',')}`; // Use up to 3 keywords
    const imageUrl = `https://source.unsplash.com/800x400/?${encodeURIComponent(keywords)}`;
    // No success toast, just return URL
    return imageUrl;
  } catch (error) {
    console.error('Project Image Generation Error:', error);
    showToast('Failed to generate project image.', 'error');
    return null;
  }
};

export const enhanceDescription = async (basicDescription, projectType, showToast) => {
  const prompt = `Enhance this ${projectType} project description to be more compelling and professional for crowdfunding:

Original: "${basicDescription}"

Make it:
- More engaging and persuasive
- Clear about the project's value
- Include why people should support it
- Keep it concise but compelling (2-3 paragraphs max)
- Professional but approachable tone

Return only the enhanced description, no extra formatting or markdown.`;

  const enhancedText = await callGoogleAI(prompt, showToast);
  if (enhancedText) {
    showToast('Description enhanced!', 'success');
    return enhancedText.trim();
  }
  return basicDescription; // Return original on failure
};

export const generateProjectTitle = async (description, category, showToast) => {
  const prompt = `Generate 3 compelling project titles for this ${category} project:

Description: "${description}"

Requirements:
- Catchy and memorable
- Clear about what the project is
- Good for crowdfunding campaigns
- 3-8 words each

Return exactly 3 titles in this format, each on a new line (no extra text, no numbering, no markdown):
Title One
Title Two
Title Three`;

  const titlesText = await callGoogleAI(prompt, showToast);
  if (!titlesText) return [];

  try {
    const titles = titlesText.split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.match(/^\d+\.\s*/)); // Filter out empty lines and numbered lines if any

    if (titles.length === 0 && titlesText.length > 0) { // Fallback if parsing fails but text exists
        showToast('AI returned titles in an unexpected format. Using raw output.', 'info');
        return [titlesText.trim()]; // Return raw text as a single title
    }
    if (titles.length > 0) showToast('Titles generated!', 'success');
    return titles.slice(0,3); // Ensure only up to 3 titles
  } catch (error) {
    console.error('Title Parsing Error:', error, "Raw text:", titlesText);
    showToast('Failed to parse AI-generated titles.', 'error');
    return [];
  }
};
