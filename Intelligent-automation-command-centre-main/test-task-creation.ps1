$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "IACC Authentication & Task Creation Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8081/api"
$username = "staff41"
$password = "Test@1234"

# Step 1: Login
Write-Host "[1/3] Testing Login..." -ForegroundColor Yellow
$loginBody = @{
    username = $username
    password = $password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/signin" `
        -Method Post `
        -Body $loginBody `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    $token = $loginResponse.token
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "   User: $($loginResponse.username)" -ForegroundColor Gray
    Write-Host "   Roles: $($loginResponse.roles -join ', ')" -ForegroundColor Gray
    Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
}
catch {
    Write-Host "❌ Login failed!" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Verify Token
Write-Host "[2/3] Verifying Token..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type"  = "application/json"
}

try {
    $tasksResponse = Invoke-RestMethod -Uri "$baseUrl/tasks" `
        -Method Get `
        -Headers $headers `
        -ErrorAction Stop
    
    Write-Host "✅ Token is valid!" -ForegroundColor Green
    Write-Host "   Found $($tasksResponse.Count) existing tasks" -ForegroundColor Gray
    Write-Host ""
}
catch {
    Write-Host "❌ Token verification failed!" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host "   Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    exit 1
}

# Step 3: Create Task
Write-Host "[3/3] Creating Test Task..." -ForegroundColor Yellow
$taskBody = @{
    title       = "Automated Test Task - $(Get-Date -Format 'HH:mm:ss')"
    description = "This is a test task created by the automated testing script to verify task creation functionality"
    department  = "REVENUE"
    priority    = "HIGH"
    status      = "PENDING"
} | ConvertTo-Json

try {
    $taskResponse = Invoke-RestMethod -Uri "$baseUrl/tasks" `
        -Method Post `
        -Headers $headers `
        -Body $taskBody `
        -ErrorAction Stop
    
    Write-Host "✅ Task created successfully!" -ForegroundColor Green
    Write-Host "   Task ID: $($taskResponse.id)" -ForegroundColor Gray
    Write-Host "   Title: $($taskResponse.title)" -ForegroundColor Gray
    Write-Host "   AI Classification: $($taskResponse.aiClassification)" -ForegroundColor Gray
    Write-Host "   Assigned Bot: $($taskResponse.assignedBotType)" -ForegroundColor Gray
    Write-Host "   Risk Level: $($taskResponse.riskLevel)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "✅ ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Task creation failed!" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host "   Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    
    # Try to get more details
    try {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Red
    }
    catch {}
    
    exit 1
}
