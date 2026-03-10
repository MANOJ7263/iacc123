package com.mano.iacc.integration.automation.service;

import com.mano.iacc.integration.automation.dto.AutomationJobRequest;
import com.mano.iacc.integration.automation.dto.AutomationJobResponse;
import com.mano.iacc.integration.automation.dto.JobStatusResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class RobotFrameworkService {

    private static final Logger logger = LoggerFactory.getLogger(RobotFrameworkService.class);
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${automation.service.url}")
    private String automationServiceUrl;

    public String startJob(String botType) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            AutomationJobRequest requestDto = new AutomationJobRequest(botType);
            HttpEntity<AutomationJobRequest> entity = new HttpEntity<>(requestDto, headers);

            String url = automationServiceUrl + "/api/run-bot";
            logger.info("Starting Robot Framework Job for BotType: {}", botType);

            ResponseEntity<AutomationJobResponse> response = restTemplate.postForEntity(
                    url,
                    entity,
                    AutomationJobResponse.class);

            if (response.getBody() != null && response.getBody().getJobId() != null) {
                String jobId = response.getBody().getJobId();
                logger.info("Local Automation Job Started Successfully. Job ID: {}", jobId);
                return jobId;
            }
        } catch (Exception e) {
            logger.error("Failed to start Local Automation Job", e);
        }
        return null;
    }

    public String getJobStatus(String jobId) {
        try {
            String url = automationServiceUrl + "/api/job-status/" + jobId;
            ResponseEntity<JobStatusResponse> response = restTemplate.getForEntity(
                    url,
                    JobStatusResponse.class);

            if (response.getBody() != null) {
                return response.getBody().getStatus();
            }
        } catch (Exception e) {
            logger.error("Failed to get job status for Job ID: " + jobId, e);
        }
        return "Unknown";
    }
}
