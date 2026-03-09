package com.mano.iacc.integration.uipath.dto;

import java.util.List;
import java.util.Map;

public class StartJobRequest {

    public StartInfo startInfo;

    public static StartJobRequest forProcess(String processName) {
        StartJobRequest req = new StartJobRequest();
        req.startInfo = new StartInfo(processName);
        return req;
    }

    public static class StartInfo {
        public String ReleaseKey;
        public String Strategy = "ModernJobsCount";
        public int JobsCount = 1;

        public StartInfo(String releaseKey) {
            this.ReleaseKey = releaseKey;
        }
    }
}
