package com.camazones.speech.controller;

import com.camazones.speech.dto.TranscriptionResponse;
import com.camazones.speech.service.OpenAiTranscriptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/speech")
public class SpeechController {

    private final OpenAiTranscriptionService transcriptionService;

    public SpeechController(OpenAiTranscriptionService transcriptionService) {
        this.transcriptionService = transcriptionService;
    }

    @GetMapping("/status")
    ResponseEntity<SpeechStatusResponse> status() {
        boolean configured = transcriptionService.isConfigured();
        return ResponseEntity.ok(new SpeechStatusResponse(
                configured,
                configured
                        ? "Transcription vocale configuree via " + transcriptionService.providerLabel() + "."
                        : "Transcription vocale non configuree. Definis GOOGLE_API_KEY ou OPENAI_API_KEY."
        ));
    }

    @PostMapping("/transcribe")
    ResponseEntity<TranscriptionResponse> transcribe(
            @RequestParam("audio") MultipartFile audio,
            @RequestParam(value = "language", required = false) String language) throws IOException {
        return ResponseEntity.ok(transcriptionService.transcribe(audio, language));
    }

    @ExceptionHandler(IllegalStateException.class)
    ResponseEntity<ErrorResponse> notConfigured(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<ErrorResponse> badRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(RestClientResponseException.class)
    ResponseEntity<ErrorResponse> providerError(RestClientResponseException ex) {
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(new ErrorResponse(ex.getResponseBodyAsString()));
    }

    record SpeechStatusResponse(boolean configured, String message) {}

    record ErrorResponse(String message) {}
}
