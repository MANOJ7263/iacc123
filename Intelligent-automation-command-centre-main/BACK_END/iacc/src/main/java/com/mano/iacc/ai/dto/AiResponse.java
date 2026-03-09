package com.mano.iacc.ai.dto;

public class AiResponse {

    private boolean matched;
    private String automationCode;
    private String automationName;
    private double confidence;

    public AiResponse(boolean matched,
                      String automationCode,
                      String automationName,
                      double confidence) {
        this.matched = matched;
        this.automationCode = automationCode;
        this.automationName = automationName;
        this.confidence = confidence;
    }

    public boolean isMatched() {
        return matched;
    }

    public String getAutomationCode() {
        return automationCode;
    }

    public String getAutomationName() {
        return automationName;
    }

    public double getConfidence() {
        return confidence;
    }
}