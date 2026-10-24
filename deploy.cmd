@echo off
REM ============================================================
REM  Cerámica Puerto Rico — despliegue por FTPS (Hostmar / ProFTPD)
REM
REM  Este archivo es solo un atajo: el trabajo real esta en deploy.ps1.
REM
REM  Credenciales (NO van al repo): se leen de variables de entorno
REM  o del archivo .ferozo-credentials, que esta en .gitignore.
REM
REM    set FTP_HOST=a1000380.ferozo.com
REM    set FTP_USER=codex@ceramicaptorico.com.ar
REM    set FTP_PASS=...
REM    set FTP_DIR=/
REM
REM  El servidor es ProFTPD con "AUTH SSL" en el puerto 21 (FTPS
REM  explicito). El puerto 990 esta cerrado.
REM
REM  Uso:
REM    deploy.cmd            publica
REM    deploy.cmd --dry-run  no toca el servidor
REM ============================================================

setlocal
set SCRIPT_DIR=%~dp0

if /i "%~1"=="--dry-run" (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%deploy.ps1" -DryRun
) else (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%deploy.ps1"
)

set CODE=%ERRORLEVEL%
if not "%CODE%"=="0" (
  echo.
  echo  El deploy termino con error ^(codigo %CODE%^).
  echo  Se dejo el .htaccess anterior respaldado en /revision-^<sello^>/.htaccess
  echo  por si hay que volver atras.
  echo.
)
endlocal
exit /b %CODE%
