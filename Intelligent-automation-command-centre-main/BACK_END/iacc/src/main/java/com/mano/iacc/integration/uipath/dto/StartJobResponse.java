package com.mano.iacc.integration.uipath.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class StartJobResponse {

    private List<JobDto> value;

    public List<JobDto> getValue() {
        return value;
    }

    public void setValue(List<JobDto> value) {
        this.value = value;
    }

    public static class JobDto {
        @JsonProperty("Key")
        private String key;

        @JsonProperty("State")
        private String state;

        public String getKey() {
            return key;
        }

        public void setKey(String key) {
            this.key = key;
        }

        public String getState() {
            return state;
        }

        public void setState(String state) {
            this.state = state;
        }
    }
}
