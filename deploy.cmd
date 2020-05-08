@if "%SCM_TRACE_LEVEL%" NEQ "4" @echo off

IF "%SITE_ROLE%" == "bot" (
    cd ./brainy-bot
    deploy.bot.cmd
) ELSE (
  IF "%SITE_ROLE%" == "configuration" (
    cd ./brainy-configuration
    deploy.configuration.cmd
  ) ELSE (
    echo You have to set SITE_ROLE setting to either "bot" or "configuration"
    exit /b 1
  )
)