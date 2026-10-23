@echo off
REM ============================================================
REM  Cerámica Puerto Rico — despliegue por FTPS (Hostmar / ProFTPD)
REM
REM  Las credenciales NO se guardan en el repo: se leen de variables
REM  de entorno, así no quedan en el historial de git.
REM
REM  Configurar una vez (en esta consola):
REM    set FTP_HOST=a1000380.ferozo.com
REM    set FTP_USER=codex@ceramicaptorico.com.ar
REM    set FTP_PASS=...
REM    set FTP_DIR=/            (la raíz del docroot = public_html)
REM
REM  El servidor es ProFTPD con "AUTH SSL" en el puerto 21 (FTPS
REM  explícito). El puerto 990 está cerrado.
REM
REM  Uso:
REM    deploy.cmd            compila y sube
REM    deploy.cmd --dry-run  compila y muestra lo que se sube, sin tocar
REM                          el servidor
REM ============================================================

setlocal EnableDelayedExpansion

if "%FTP_HOST%"=="" goto :sin_config
if "%FTP_USER%"=="" goto :sin_config
if "%FTP_PASS%"=="" goto :sin_config
if "%FTP_DIR%"=="" set FTP_DIR=/

set CURL=%SystemRoot%\System32\curl.exe
set REMOTO=ftp://%FTP_HOST%%FTP_DIR%
set DRY=0
if /i "%~1"=="--dry-run" set DRY=1

echo.
echo  1/5  Compilando el sitio...
call npm run build
if errorlevel 1 (
  echo.
  echo  ERROR en el build. Se aborta.
  exit /b 1
)

REM ------------------------------------------------------------
REM  Backup: copia el .htaccess que hay hoy en el servidor a una
REM  carpeta revision-<sello>. Con ese archivo se puede volver
REM  atrás: si el nuevo .htaccess rompe algo, se sube el viejo y
REM  el sitio vuelve a como estaba.
REM ------------------------------------------------------------
set SELLO=%DATE:~-4%%DATE:~3,2%%DATE:~0,2%-%TIME:~0,2%%TIME:~3,2%
set SELLO=%SELLO: =0%
set SELLO=%SELLO::=%
set BACKUP=revision-%SELLO%
set TMP=%TEMP%\ceramica-deploy-%SELLO%
if not exist "%TMP%" mkdir "%TMP%"

echo.
echo  2/5  Respaldando el .htaccess actual en /%BACKUP%/ ...
"%CURL%" --ssl-reqd --user "%FTP_USER%:%FTP_PASS%" --max-time 60 -s ^
  -o "%TMP%\htaccess.anterior" "%REMOTO%/.htaccess"
if exist "%TMP%\htaccess.anterior" (
  "%CURL%" --ssl-reqd --user "%FTP_USER%:%FTP_PASS%" --max-time 60 -s ^
    --ftp-create-dirs -T "%TMP%\htaccess.anterior" "%REMOTO%/%BACKUP%/.htaccess"
  echo  Guardado: /%BACKUP%/.htaccess
) else (
  echo  No habia .htaccess anterior: se crea la carpeta de respaldo igual.
  "%CURL%" --ssl-reqd --user "%FTP_USER%:%FTP_PASS%" --max-time 60 -s ^
    --ftp-create-dirs -Q "-MKD /%BACKUP%" "%REMOTO%/" > NUL
)

REM ------------------------------------------------------------
REM  Subida. El .htaccess va ULTIMO: hasta que no se sube, el
REM  sitio sigue sirviendo el .htaccess de WordPress y no se ve
REM  ningun cambio. Si el nuevo .htaccess fuera a dar un 500, el
REM  sitio sigue en pie con la version anterior.
REM ------------------------------------------------------------
echo.
echo  3/5  Subiendo dist\ ...
set TOTAL=0
set SUBIDOS=0
for /r "dist" %%f in (*) do (
  set "REL=%%f"
  set "REL=!REL:dist\=!"
  set "REL=!REL:\=/!"
  set /a TOTAL+=1
  if /i "!REL!"==".htaccess" (
    set "HTACCESS=!REL!"
  ) else (
    if "%DRY%"=="1" (
      echo   [dry-run] !REL!
    ) else (
      "%CURL%" --ssl-reqd --user "%FTP_USER%:%FTP_PASS%" --max-time 120 -s ^
        --ftp-create-dirs -T "%%f" "%REMOTO%/!REL!"
      if errorlevel 1 (
        echo  ERROR subiendo %%f
        exit /b 1
      )
      set /a SUBIDOS+=1
    )
  )
)
if not defined HTACCESS set "HTACCESS=.htaccess"

echo.
echo  4/5  Subiendo el .htaccess (va ultimo) ...
if "%DRY%"=="1" (
  echo   [dry-run] %HTACCESS%
) else (
  "%CURL%" --ssl-reqd --user "%FTP_USER%:%FTP_PASS%" --max-time 120 -s ^
    --ftp-create-dirs -T "dist\%HTACCESS%" "%REMOTO%/%HTACCESS%"
  if errorlevel 1 (
    echo  ERROR subiendo el .htaccess
    exit /b 1
  )
)

echo.
echo  5/5  Comprobando que el sitio responde ...
"%CURL%" --ssl-reqd --max-time 30 -s -o NUL -w "  HTTP %%{http_code} en %%{time_total}s`n" ^
  https://ceramicaptorico.com.ar/

echo.
echo  Archivos en dist: %TOTAL%
if not "%DRY%"=="1" echo  Archivos subidos: %SUBIDOS%
echo  Respaldo del .htaccess anterior: /%BACKUP%/.htaccess
echo.
echo  Para volver atras: subir el .htaccess respaldado a la raiz.
echo  Recorda: si el hosting es Apache, public\.htaccess ya viaja con
echo  el build (las 301 de las URLs que se sacaron del sitio).
echo.

endlocal
exit /b 0

:sin_config
echo.
echo  Faltan las variables de entorno. Definelas y volve a correr:
echo    set FTP_HOST=...
echo    set FTP_USER=...
echo    set FTP_PASS=...
echo    set FTP_DIR=/
echo.
endlocal
exit /b 1
