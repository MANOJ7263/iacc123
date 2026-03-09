package com.mano.iacc.integration.uipath.service;

import com.mano.iacc.integration.uipath.config.UiPathProperties;
import com.mano.iacc.integration.uipath.dto.StartJobRequest;
import com.mano.iacc.integration.uipath.dto.StartJobResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class UiPathJobService {

  @org.springframework.beans.factory.annotation.Value("${uipath.folder.id}")
  private String folderId;

  private static final Logger logger = LoggerFactory.getLogger(UiPathJobService.class);
  private final UiPathAuthService authService;
  private final UiPathProperties props;
  private final RestTemplate restTemplate = new RestTemplate();

  public UiPathJobService(UiPathAuthService authService,
      UiPathProperties props) {
    this.authService = authService;
    this.props = props;
  }

  public String startJob(String releaseKey) {
    try {
      String token = authService.getAccessToken();

      HttpHeaders headers = new HttpHeaders();
      headers.setBearerAuth(token);
      headers.setContentType(MediaType.APPLICATION_JSON);

      if (folderId != null && !folderId.isEmpty()) {
        headers.set("X-UIPATH-OrganizationUnitId", folderId);
      }

      StartJobRequest requestDto = new StartJobRequest();
      requestDto.startInfo = new StartJobRequest.StartInfo(releaseKey);
      // Ensure strategy matches cloud requirements
      requestDto.startInfo.Strategy = "ModernJobsCount";
      requestDto.startInfo.JobsCount = 1;

      HttpEntity<StartJobRequest> entity = new HttpEntity<>(requestDto, headers);

      String url = props.getOrchestratorUrl() + "/odata/Jobs/UiPath.Server.Configuration.OData.StartJobs";
      logger.info("Starting UiPath Job with ReleaseKey: {}", releaseKey);

      ResponseEntity<StartJobResponse> response = restTemplate.postForEntity(
          url,
          entity,
          StartJobResponse.class);

      if (response.getBody() != null && response.getBody().getValue() != null
          && !response.getBody().getValue().isEmpty()) {
        String jobKey = response.getBody().getValue().get(0).getKey();
        logger.info("Job Started Successfully. Job Key: {}", jobKey);
        return jobKey;
      }
    } catch (Exception e) {
      logger.error("Failed to start UiPath Job", e);
    }
    return null;
  }

  public String getJobStatus(String jobKey) {
    try {
      String token = authService.getAccessToken();
      HttpHeaders headers = new HttpHeaders();
      headers.setBearerAuth(token);

      HttpEntity<Void> entity = new HttpEntity<>(headers);

      String url = props.getOrchestratorUrl() + "/odata/Jobs(" + jobKey + ")";
      ResponseEntity<StartJobResponse.JobDto> response = restTemplate.exchange(
          url,
          HttpMethod.GET,
          entity,
          StartJobResponse.JobDto.class);

      if (response.getBody() != null) {
        return response.getBody().getState();
      }
    } catch (Exception e) {
      logger.error("Failed to get job status for Key: " + jobKey, e);
    }
    return "Unknown";
  }
}
