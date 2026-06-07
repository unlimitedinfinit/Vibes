@echo off
:: ──────────────────────────────────────────────
:: Vibe.bat — One-click project setup
:: Drop this file in any project root and double-click.
:: Creates .vibe/ (15 files) + docs/ (11 files)
:: ──────────────────────────────────────────────

echo.
echo   ======================================================
echo      vibes — The complete semantic layer for any project
echo   ======================================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo   ERROR: Node.js is not installed.
    echo   Download it from https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: Run vibes all (init + docs) in the current directory
echo   Running: npx vibe-me@latest all
echo.
call npx -y vibe-me@latest all

echo.
echo   ======================================================
echo   DONE! Your .vibe/ and docs/ folders are ready.
echo.
echo   Next step — tell your AI coding agent:
echo.
echo     "Read .vibe/VIBE_GUIDE.md, then analyze this
echo      codebase and fill out all skeleton files in
echo      .vibe/ and docs/. For files that aren't relevant
echo      write N/A with a brief explanation. Ask me any
echo      questions you can't answer from the code."
echo.
echo   ======================================================
echo.
pause
