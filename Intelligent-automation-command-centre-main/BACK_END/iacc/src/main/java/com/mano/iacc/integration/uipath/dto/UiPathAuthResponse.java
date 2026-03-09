package com.mano.iacc.integration.uipath.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UiPathAuthResponse {

    @JsonProperty("access_token")
    private String accessToken;

    public String getAccessToken() {
        return accessToken;
    }
}
