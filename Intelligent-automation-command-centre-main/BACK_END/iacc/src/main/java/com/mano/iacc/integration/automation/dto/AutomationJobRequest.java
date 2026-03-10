package com.mano.iacc.integration.automation.dto;

public class AutomationJobRequest {
    private String botType;

    public AutomationJobRequest() {
    }

    public AutomationJobRequest(String botType) {
        this.botType = botType;
    }

    public String getBotType() {
        return botType;
    }

    public void setBotType(String botType) {
        this.botType = botType;
    }
}
