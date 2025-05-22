/**
 * Mock function to simulate speech-to-text conversion
 * In the future, this will be replaced with actual Google Cloud Speech-to-Text API integration
 * @param {string} audioUri - URI of the recorded audio file
 * @returns {Promise<string>} - Promise resolving to the transcribed text
 */
export const transcribeAudio = async (audioUri) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock response - in the future, this will be replaced with actual API response
  const mockTranscripts = [
    "I am feeling a bit stressed today",
    "I'm really happy and excited about my new project",
    "I've been feeling anxious lately, but I'm working on it",
    "Today was a good day, I accomplished a lot",
    "I'm feeling overwhelmed with all the work I have to do"
  ];

  // Return a random transcript from the mock responses
  return mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
}; 