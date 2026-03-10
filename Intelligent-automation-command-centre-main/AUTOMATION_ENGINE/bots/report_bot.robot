*** Settings ***
Documentation     A mock robot script representing a Report Generation task.
Library           RPA.Desktop

*** Tasks ***
Generate Analytics Report
    Log    Connecting to data warehouse...
    Sleep    2s
    Log    Extracting department metrics...
    Sleep    2s
    Log    Compiling PDF Report...
    Sleep    2s
    Log    Report generation complete.
