@echo off
cd /d "%~dp0"
if exist node.exe (
  node.exe --env-file-if-exists=.env server.mjs
) else (
  node --env-file-if-exists=.env server.mjs
)
pause
