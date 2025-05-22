/**
 * Mock function to analyze text using OpenAI's GPT-4
 * In the future, this will be replaced with actual API calls
 * @param {string} transcript - The text to analyze
 * @returns {Promise<Object>} - Promise resolving to mood analysis object
 */
export const analyzeMood = async (transcript) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock responses based on transcript content
  const mockResponses = [
    {
      mood: "happy",
      sentiment: "positive",
      summary: "Expressing joy and satisfaction with current situation"
    },
    {
      mood: "anxious",
      sentiment: "negative",
      summary: "Showing signs of worry and stress about current circumstances"
    },
    {
      mood: "neutral",
      sentiment: "neutral",
      summary: "Maintaining a balanced emotional state"
    },
    {
      mood: "sad",
      sentiment: "negative",
      summary: "Feeling down and expressing negative emotions"
    }
  ];

  // Select response based on transcript content
  let response;
  if (transcript.toLowerCase().includes('happy') || transcript.toLowerCase().includes('excited')) {
    response = mockResponses[0];
  } else if (transcript.toLowerCase().includes('anxious') || transcript.toLowerCase().includes('stressed')) {
    response = mockResponses[1];
  } else if (transcript.toLowerCase().includes('sad') || transcript.toLowerCase().includes('down')) {
    response = mockResponses[3];
  } else {
    response = mockResponses[2];
  }

  return response;
}; 