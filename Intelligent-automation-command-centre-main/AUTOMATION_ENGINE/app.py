from flask import Flask, request, jsonify
import subprocess
import uuid
import os
import threading

app = Flask(__name__)

# In-memory job store for demo purposes
jobs = {}

def run_robot(job_id, bot_type):
    script_path = f"bots/{bot_type.lower()}.robot"
    
    # Check if a specific script exists, else run default
    if not os.path.exists(script_path):
        script_path = "bots/default.robot"

    print(f"[{job_id}] Starting robot script: {script_path}")
    jobs[job_id] = "RUNNING"
    
    try:
        # Run robot framework
        result = subprocess.run(
            ["robot", "--outputdir", f"results/{job_id}", script_path],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print(f"[{job_id}] Success")
            jobs[job_id] = "COMPLETED"
        else:
            print(f"[{job_id}] Failed: {result.stderr}")
            jobs[job_id] = "FAILED"
            
    except Exception as e:
        print(f"[{job_id}] Error: {str(e)}")
        jobs[job_id] = "FAILED"

@app.route('/api/run-bot', methods=['POST'])
def start_job():
    data = request.json
    bot_type = data.get('botType', 'DEFAULT_BOT')
    
    job_id = str(uuid.uuid4())
    jobs[job_id] = "PENDING"
    
    # Run robot in a background thread so we can return the ID immediately
    thread = threading.Thread(target=run_robot, args=(job_id, bot_type))
    thread.start()
    
    return jsonify({
        "jobId": job_id,
        "status": "PENDING",
        "message": f"Started {bot_type}"
    }), 202

@app.route('/api/job-status/<job_id>', methods=['GET'])
def get_job_status(job_id):
    if job_id not in jobs:
        return jsonify({"error": "Job not found"}), 404
        
    return jsonify({
        "jobId": job_id,
        "status": jobs[job_id]
    }), 200

if __name__ == '__main__':
    # Ensure directories exist
    os.makedirs("bots", exist_ok=True)
    os.makedirs("results", exist_ok=True)
    
    print("Starting Local Automation Engine (Robot Framework) on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
