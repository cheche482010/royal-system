@echo off
setlocal

:: Navega a la carpeta principal y ejecuta git pull
echo Actualizando repositorio desde origin/dev...
cd /d C:\xampp\htdocs\www\proyectos\royal-system
git pull origin dev
if %errorlevel% neq 0 (
    echo Error al actualizar el repositorio
    pause
    exit /b
)

:: Espera 2 segundos para que se pueda ver el mensaje
timeout /t 2 >nul

:: Abre la primera ventana de comando para el backend
start cmd /k "cd /d C:\xampp\htdocs\www\proyectos\royal-system\api && echo Instalando dependencias del backend... && npm install && cls && echo Ejecutando Backend royal-system... && npm run dev || pause"

:: Abre la segunda ventana de comando para el frontend
start cmd /k "cd /d C:\xampp\htdocs\www\proyectos\royal-system\web && echo Instalando dependencias del frontend... && npm install && cls && echo Ejecutando Frontend royal-system... && npm run dev || pause"

endlocal