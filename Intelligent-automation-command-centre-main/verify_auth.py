import requests
import json
import sys

BASE_URL = "http://localhost:8081/api/auth"

users = [
    {
        "username": "test41",
        "email": "test41@gmail.com",
        "password": "Test@1234",
        "role": "ROLE_DEPT_HEAD",
        "department": "REVENUE"
    },
    {
        "username": "staff41",
        "email": "staff41@gmail.com",
        "password": "Test@1234",
        "role": "ROLE_STAFF",
        "department": "HEALTH"
    },
    {
        "username": "auto41",
        "email": "auto41@gmail.com",
        "password": "Test@1234",
        "role": "ROLE_AUTO_SUPERVISOR",
        "department": "TRANSPORT"
    },
    {
        "username": "collector41",
        "email": "collector41@gmail.com",
        "password": "Test@1234",
        "role": "ROLE_COLLECTOR",
        "department": "ADMIN"
    }
]

def register_and_login():
    with open("auth_report.txt", "w", encoding="utf-8") as f:
        f.write("Starting Auth Verification...\n\n")
        
        for user_data in users:
            f.write(f"--- Processing {user_data['username']} ---\n")
            
            # 1. Register
            signup_payload = user_data.copy()
            try:
                f.write(f"Registering...\n")
                regy_resp = requests.post(f"{BASE_URL}/signup", json=signup_payload)
                f.write(f"Registration Status: {regy_resp.status_code}\n")
                f.write(f"Registration Response: {regy_resp.text}\n")
            except Exception as e:
                f.write(f"Registration Error: {e}\n")

            # 2. Login
            login_payload = {
                "username": user_data['username'],
                "password": user_data['password']
            }
            try:
                f.write(f"Logging in...\n")
                login_resp = requests.post(f"{BASE_URL}/signin", json=login_payload)
                f.write(f"Login Status: {login_resp.status_code}\n")
                
                if login_resp.status_code == 200:
                    data = login_resp.json()
                    f.write("Login Successful!\n")
                    f.write(f"Returned Username: {data.get('username')}\n")
                    f.write(f"Returned Roles: {data.get('roles')}\n")
                    f.write(f"Returned Dept: {data.get('department')}\n")
                    f.write(f"Token present: {'Yes' if data.get('token') else 'No'}\n")
                else:
                    f.write(f"Login Failed: {login_resp.text}\n")
            except Exception as e:
                f.write(f"Login Error: {e}\n")
            
            f.write("\n")

if __name__ == "__main__":
    register_and_login()
