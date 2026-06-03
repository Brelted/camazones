package com.camazones.speech.service;

import com.camazones.speech.dto.TranscriptionResponse;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class OpenAiTranscriptionService {

    private static final String TRANSCRIPTION_URL = "https://api.openai.com/v1/audio/transcriptions";
    private static final String GEMINI_TRANSCRIPTION_URL = "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent";

    private final RestTemplate restTemplate = new RestTemplate();
    private final String apiKey;
    private final String model;
    private final String googleApiKey;
    private final String googleModel;

    public OpenAiTranscriptionService(
            @Value("${camazones.openai.api-key:}") String apiKey,
            @Value("${camazones.openai.transcription-model:gpt-4o-mini-transcribe}") String model,
            @Value("${camazones.google.api-key:}") String googleApiKey,
            @Value("${camazones.google.transcription-model:gemini-2.5-flash}") String googleModel) {
        this.apiKey = apiKey;
        this.model = model;
        this.googleApiKey = googleApiKey;
        this.googleModel = googleModel;
    }

    public TranscriptionResponse transcribe(MultipartFile audio, String language) throws IOException {
        if (audio == null || audio.isEmpty()) {
            throw new IllegalArgumentException("Aucun audio recu.");
        }
        if (hasValidGoogleApiKey()) {
            return transcribeWithGoogle(audio, language);
        }
        if (hasValidApiKey()) {
            return transcribeWithOpenAi(audio, language);
        }
        throw new IllegalStateException("Transcription non configuree. Definis GOOGLE_API_KEY ou OPENAI_API_KEY.");
    }

    public boolean isConfigured() {
        return hasValidGoogleApiKey() || hasValidApiKey();
    }

    public String providerLabel() {
        if (hasValidGoogleApiKey()) {
            return "Google Gemini";
        }
        if (hasValidApiKey()) {
            return "OpenAI";
        }
        return "Aucun";
    }

    private TranscriptionResponse transcribeWithOpenAi(MultipartFile audio, String language) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("model", model);
        body.add("file", filePart(audio));
        if (language != null && !language.isBlank()) {
            body.add("language", language.trim());
        }

        JsonNode response = restTemplate.postForObject(TRANSCRIPTION_URL, new HttpEntity<>(body, headers), JsonNode.class);
        String text = response == null ? "" : response.path("text").asText("");
        return new TranscriptionResponse(text.trim());
    }

    private TranscriptionResponse transcribeWithGoogle(MultipartFile audio, String language) throws IOException {
        String activeLanguage = language == null || language.isBlank() ? "fr" : language.trim();
        String prompt = activeLanguage.toLowerCase().startsWith("en")
                ? "Transcribe this audio exactly. Return only the spoken search query, no explanation."
                : "Transcris cet audio exactement. Retourne uniquement la recherche prononcee, sans explication.";
        String mimeType = normalizeMimeType(audio.getContentType());
        String base64Audio = Base64.getEncoder().encodeToString(audio.getBytes());
        Map<String, Object> request = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(
                                Map.of("text", prompt),
                                Map.of("inline_data", Map.of("mime_type", mimeType, "data", base64Audio))
                        )
                ))
        );
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", googleApiKey.trim());
        String url = String.format(GEMINI_TRANSCRIPTION_URL, googleModel.trim());
        JsonNode response = restTemplate.postForObject(url, new HttpEntity<>(request, headers), JsonNode.class);
        String text = response == null
                ? ""
                : response.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText("");
        return new TranscriptionResponse(text.trim());
    }

    private boolean hasValidApiKey() {
        return apiKey != null && apiKey.trim().startsWith("sk-");
    }

    private boolean hasValidGoogleApiKey() {
        return googleApiKey != null && googleApiKey.trim().startsWith("AIza");
    }

    private String normalizeMimeType(String mimeType) {
        if (mimeType == null || mimeType.isBlank()) {
            return "audio/mp4";
        }
        String value = mimeType.trim().toLowerCase();
        if (value.equals("audio/x-m4a") || value.equals("audio/m4a")) {
            return "audio/mp4";
        }
        return value;
    }

    private HttpEntity<ByteArrayResource> filePart(MultipartFile audio) throws IOException {
        ByteArrayResource resource = new ByteArrayResource(audio.getBytes()) {
            @Override
            public String getFilename() {
                String name = audio.getOriginalFilename();
                return name == null || name.isBlank() ? "voice-search.m4a" : name;
            }
        };

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(audio.getContentType() == null ? "audio/m4a" : audio.getContentType()));
        return new HttpEntity<>(resource, headers);
    }
}
