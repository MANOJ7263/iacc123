*** Settings ***
Documentation     A default mock robot script for IACC automation fallback.
Library           RPA.Desktop

*** Tasks ***
Default Mock Automation Task
    Log    Starting default automation task...
    Sleep    3s  # Simulate some work being done
    Log    Task successfully processed.
    Log    Generating final outputs.
    Sleep    1s
    Log    Done.
