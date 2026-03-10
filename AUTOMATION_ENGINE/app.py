"""
IACC Local Automation Engine
============================
Flask API that acts as a local orchestrator for Robot Framework bots.
- Spring Boot backend calls POST /api/run-bot  → triggers a bot
- Spring Boot backend calls GET  /api/job-status/<job_id> → checks job status
- Spring Boot backend calls GET  /api/jobs → list all jobs
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
import threading
import time
import datetime
import logging

app = Flask(__name__)
CORS(app)  # Allow requests from the Spring Boot backend and React frontend

# ─── In-memory job store (replace with DB in production) ─────────────────────
jobs = {}

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)


# ─── Simulate bot execution in a background thread ───────────────────────────
def run_bot_simulation(job_id: str, bot_type: str):
    """Simulates a Robot Framework bot running asynchronously."""
    logger.info(f"[BOT] Starting job {job_id} for bot type: {bot_type}")
    jobs[job_id]["status"] = "RUNNING"
    jobs[job_id]["startedAt"] = datetime.datetime.now().isoformat()

    # Simulate processing time (3–8 seconds depending on bot type)
    durations = {
        "REPORT_BOT": 5,
        "EMAIL_BOT": 3,
        "DATA_ENTRY_BOT": 6,
        "APPROVAL_BOT": 4,
        "COMPLIANCE_BOT": 8,
        "RECOVERY_BOT": 4,
        "GENERIC_BOT": 3,
    }
    sleep_time = durations.get(bot_type.upper(), 5)
    time.sleep(sleep_time)

    # Mark as completed
    jobs[job_id]["status"] = "COMPLETED"
    jobs[job_id]["completedAt"] = datetime.datetime.now().isoformat()
    jobs[job_id]["logs"].append(f"[{datetime.datetime.now().isoformat()}] ✅ Bot {bot_type} completed successfully.")
    logger.info(f"[BOT] Job {job_id} COMPLETED for bot type: {bot_type}")


# ─── Routes ──────────────────────────────────────────────────────────────────

@app.route("/", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "engine": "IACC Local Automation Engine",
        "version": "1.0.0",
        "timestamp": datetime.datetime.now().isoformat()
    })


@app.route("/api/run-bot", methods=["POST"])
def run_bot():
    """
    Trigger a new bot job.
    Expected JSON body: { "botType": "REPORT_BOT" }
    """
    data = request.get_json()
    if not data or "botType" not in data:
        return jsonify({"error": "botType is required"}), 400

    bot_type = data["botType"]
    job_id = str(uuid.uuid4())

    # Register the job
    jobs[job_id] = {
        "jobId": job_id,
        "botType": bot_type,
        "status": "PENDING",
        "createdAt": datetime.datetime.now().isoformat(),
        "startedAt": None,
        "completedAt": None,
        "logs": [f"[{datetime.datetime.now().isoformat()}] 🚀 Job {job_id} queued for bot: {bot_type}"]
    }

    # Run the bot in background
    thread = threading.Thread(target=run_bot_simulation, args=(job_id, bot_type), daemon=True)
    thread.start()

    logger.info(f"[API] Job {job_id} created for botType: {bot_type}")
    return jsonify({"jobId": job_id, "status": "PENDING", "message": f"Bot {bot_type} triggered successfully"}), 201


@app.route("/api/job-status/<job_id>", methods=["GET"])
def get_job_status(job_id):
    """Get current status of a specific job."""
    job = jobs.get(job_id)
    if not job:
        return jsonify({"error": f"Job {job_id} not found"}), 404
    return jsonify({"jobId": job_id, "status": job["status"]})


@app.route("/api/jobs", methods=["GET"])
def list_jobs():
    """List all jobs (for dashboard monitoring)."""
    return jsonify(list(jobs.values()))


@app.route("/api/jobs/<job_id>/logs", methods=["GET"])
def get_job_logs(job_id):
    """Get execution logs for a specific job."""
    job = jobs.get(job_id)
    if not job:
        return jsonify({"error": f"Job {job_id} not found"}), 404
    return jsonify({"jobId": job_id, "logs": job["logs"]})


# ─── Entry Point ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 60)
    print("  IACC Local Automation Engine")
    print("  Running on: http://localhost:5000")
    print("  Press CTRL+C to stop")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5000, debug=True)
