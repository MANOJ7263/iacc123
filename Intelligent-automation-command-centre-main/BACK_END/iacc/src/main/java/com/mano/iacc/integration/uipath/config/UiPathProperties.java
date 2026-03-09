package com.mano.iacc.integration.uipath.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "uipath")
public class UiPathProperties {

    private String authUrl;
    private String orchestratorUrl;
    private Client client = new Client();

    // ---------- GETTERS ----------

    public String getAuthUrl() {
        return authUrl;
    }

    public String getOrchestratorUrl() {
        return orchestratorUrl;
    }

    public Client getClient() {
        return client;
    }

    // ---------- SETTERS ----------

    public void setAuthUrl(String authUrl) {
        this.authUrl = authUrl;
    }

    public void setOrchestratorUrl(String orchestratorUrl) {
        this.orchestratorUrl = orchestratorUrl;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    // ---------- NESTED CLIENT CLASS ----------

    public static class Client {

        private String id;
        private String secret;

        public String getId() {
            return id;
        }

        public String getSecret() {
            return secret;
        }

        public void setId(String id) {
            this.id = id;
        }

        public void setSecret(String secret) {
            this.secret = secret;
        }
    }
}
