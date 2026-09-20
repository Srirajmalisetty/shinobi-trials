@REM ----------------------------------------------------------------------------
@REM Maven Startup Script
@REM ----------------------------------------------------------------------------
@echo off
setlocal

where mvn >nul 2>&1
if %ERRORLEVEL% equ 0 (
    mvn %*
    exit /b %ERRORLEVEL%
)

if exist "C:\Program Files\JetBrains\IntelliJ IDEA 2025.3.2\plugins\maven\lib\maven3\bin\mvn.cmd" (
    "C:\Program Files\JetBrains\IntelliJ IDEA 2025.3.2\plugins\maven\lib\maven3\bin\mvn.cmd" %*
    exit /b %ERRORLEVEL%
)

echo Maven is not found in PATH or IntelliJ plugins directory.
exit /b 1
