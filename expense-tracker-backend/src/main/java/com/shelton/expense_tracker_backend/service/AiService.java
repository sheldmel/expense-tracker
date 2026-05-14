package com.shelton.expense_tracker_backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shelton.expense_tracker_backend.entity.Category;
import com.shelton.expense_tracker_backend.entity.User;
import com.shelton.expense_tracker_backend.repository.CategoryRepository;
import com.shelton.expense_tracker_backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AiService {

    private final ChatClient chatClient;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private Map<String, List<String>> keywordMap;

    public AiService(ChatClient.Builder chatClientBuilder,
                     CategoryRepository categoryRepository,
                     UserRepository userRepository) {
        this.chatClient = chatClientBuilder.build();
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @Value("classpath:category-keywords.json")
    private Resource keywordsResource;

    @PostConstruct
    public void loadKeywords() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            keywordMap = mapper.readValue(keywordsResource.getInputStream(),
                    new TypeReference<Map<String, List<String>>>() {});
        } catch (Exception e) {
            keywordMap = new HashMap<>();
            System.err.println("Failed to load category keywords: " + e.getMessage());
        }
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private String checkLocalKeywords(String description) {
        String lower = description.toLowerCase().trim();
        for (Map.Entry<String, List<String>> entry : keywordMap.entrySet()) {
            for (String keyword : entry.getValue()) {
                if (lower.contains(keyword)) {
                    return entry.getKey();
                }
            }
        }
        return null;
    }

    public String suggestCategory(String description) {
        Long userId = getCurrentUser().getId();
        List<Category> categories = categoryRepository.findAllForUser(userId);

        // default category names only for local keyword matching
        List<String> defaultCategoryNames = categories.stream()
                .filter(c -> c.getUser() == null)
                .map(Category::getName)
                .map(String::toLowerCase)
                .toList();

        // check local keywords first
        String localSuggestion = checkLocalKeywords(description);
        if (localSuggestion != null && defaultCategoryNames.contains(localSuggestion.toLowerCase())) {
            return localSuggestion;
        }

        // fall back to OpenAI
        return callAi(description, categories);
    }

    private String callAi(String description, List<Category> categories) {
        String categoryNames = categories.stream()
                .map(Category::getName)
                .collect(Collectors.joining(", "));

        String prompt = String.format("""
                Given this expense description: '%s'
                Available categories: %s
                
                Return ONLY the single most appropriate category name from the list.
                No explanation, punctuation or extra text — just the category name.
                """, description, categoryNames);

        try {
            return chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content()
                    .trim();
        } catch (Exception e) {
            System.err.println("AI model error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to get AI suggestion");
        }
    }
}