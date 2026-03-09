package com.mano.iacc.service;

import com.mano.iacc.entity.Task;
import com.mano.iacc.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReportService {

    private final TaskRepository taskRepository;

    public ReportService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public ByteArrayInputStream generateTaskCsv() {
        List<Task> tasks = taskRepository.findAll();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try (PrintWriter writer = new PrintWriter(out)) {
            // Header
            writer.println("Task ID,Title,Department,Status,Priority,Risk Level,Bot Assigned,Created Date,Created By");

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

            for (Task task : tasks) {
                writer.printf("%s,\"%s\",%s,%s,%s,%s,%s,%s,%s\n",
                        task.getId(),
                        escapeSpecialCharacters(task.getTitle()),
                        task.getDepartment(),
                        task.getStatus(),
                        task.getPriority(),
                        task.getRiskLevel(),
                        task.getAssignedBotType() != null ? task.getAssignedBotType() : "N/A",
                        task.getCreatedAt() != null ? task.getCreatedAt().format(formatter) : "N/A",
                        task.getCreatedBy() != null ? task.getCreatedBy().getUsername() : "Unknown");
            }

            writer.flush();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    private String escapeSpecialCharacters(String data) {
        if (data == null) {
            return "";
        }
        String escapedData = data.replaceAll("\\R", " ");
        if (data.contains(",") || data.contains("\"") || data.contains("'")) {
            data = data.replace("\"", "\"\"");
            escapedData = "\"" + data + "\"";
        }
        return escapedData;
    }
}
