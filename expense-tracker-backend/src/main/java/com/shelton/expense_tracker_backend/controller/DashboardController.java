package com.shelton.expense_tracker_backend.controller;

import com.shelton.expense_tracker_backend.dto.dashboard.DashboardResponse;
import com.shelton.expense_tracker_backend.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardResponse> getSummary(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year
    ) {
        return ResponseEntity.ok(dashboardService.getSummary(month, year));
    }
}
