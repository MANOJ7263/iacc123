package com.mano.iacc.integration.uipath.service;

import com.mano.iacc.integration.uipath.config.UiPathProperties;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class UiPathAuthService {

    private final UiPathProperties props;
    private final RestTemplate restTemplate = new RestTemplate();

    public UiPathAuthService(UiPathProperties props) {
        this.props = props;
    }

    public String getAccessToken() {

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "client_credentials");
        body.add("client_id", props.getClient().getId());
        body.add("client_secret", props.getClient().getSecret());
        body.add("scope", "OR.Jobs");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request =
                new HttpEntity<>(body, headers);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(
                        props.getAuthUrl(),
                        request,
                        Map.class
                );

        return (String) response.getBody().get("access_token");
    }
}
