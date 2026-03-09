package com.mano.iacc.integration.uipath.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class UiPathAssetService {

    @Value("${uipath.orchestrator.url}")
    private String orchestratorUrl;

    @Value("${uipath.folder.id}")
    private String folderId;

    @Value("${uipath.asset.name}")
    private String assetName;

    private final UiPathAuthService authService;

    public UiPathAssetService(UiPathAuthService authService) {
        this.authService = authService;
    }

    public void updateAssetValue(String value) {

        String token = authService.getAccessToken();

        String url = orchestratorUrl + "/odata/Assets/UiPath.Server.Configuration.OData.SetAssetValue";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.set("X-UIPATH-OrganizationUnitId", folderId);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
                "Name", assetName,
                "Value", Map.of(
                        "StringValue", value
                )
        );

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(body, headers);

        restTemplate.postForEntity(url, entity, Void.class);
    }
}
