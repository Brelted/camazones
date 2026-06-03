import apiClient from './apiClient';

export const getSpeechStatus = async () => apiClient.get('/speech/status');

export const transcribeSearchAudio = async ({ uri, language }) => {
  const form = new FormData();
  form.append('audio', {
    uri,
    name: 'voice-search.m4a',
    type: 'audio/m4a',
  });
  if (language) {
    form.append('language', language);
  }

  return apiClient.post('/speech/transcribe', form, {
    timeout: 30000,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
