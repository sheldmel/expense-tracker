package com.shelton.expense_tracker_backend.controller;

import com.shelton.expense_tracker_backend.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/suggest-category")
    public ResponseEntity<Map<String, String>> suggestCategory(
            @RequestBody Map<String, String> request
    ) {
        String description = request.get("description");

        if (description == null || description.isBlank())
            throw new RuntimeException("Description is required");

        String suggestion = aiService.suggestCategory(description);
        return ResponseEntity.ok(Map.of("suggestedCategory", suggestion));
    }
}