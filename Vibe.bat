@echo off
:: ──────────────────────────────────────────────
:: Vibe.bat — One-click project setup
:: Drop this file in any project root and double-click.
:: Creates .vibe/ semantic layer + docs/ operational docs.
:: ──────────────────────────────────────────────

echo.
echo   ⚡ Vibe.bat — Setting up semantic layer + docs
echo   ─────────────────────────────────────────────────
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo   ✖ Node.js is not installed.
    echo     Download it from https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: Run vibes all (init + docs) in the current directory
echo   Running: npx vibe-me@latest all
echo.
call npx -y vibe-me@latest all

echo.
echo   ─────────────────────────────────────────────────
echo   ✔ Done! Now tell your AI agent:
echo.
echo     "Read .vibe/VIBE_GUIDE.md, then analyze this
echo      codebase and fill out all skeleton files in
echo      .vibe/ and docs/. Ask me any questions you
echo      can't answer from the code."
echo.
echo   ─────────────────────────────────────────────────
echo.
pause
