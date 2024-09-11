const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const getAIRecommendations = async (interests, destination) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const prompt = `Suggest unique activities in ${destination} based on these interests: ${interests.join(', ')}`;

  const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
    prompt,
    max_tokens: 150,
    n: 1,
    stop: null,
    temperature: 0.7,
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  const recommendations = response.data.choices[0].text.trim().split('\n').filter(line => line);
  return recommendations;
};

module.exports = getAIRecommendations;
