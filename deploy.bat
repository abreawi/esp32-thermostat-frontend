@echo off
echo ========================================
echo   Desplegar Frontend a GitHub Pages
echo ========================================
echo.

REM Verificar si Git esta inicializado
if not exist ".git" (
    echo Inicializando repositorio Git...
    git init
    echo.
)

echo Anadiendo archivos...
git add .
echo.

REM Pedir mensaje de commit
set /p commit_msg="Mensaje del commit: "
if "%commit_msg%"=="" set commit_msg="Update frontend"

echo.
echo Haciendo commit...
git commit -m "%commit_msg%"
echo.

echo Subiendo a GitHub...
git push
echo.

echo ========================================
echo   Deployment completado!
echo ========================================
echo.
echo Tu sitio se actualizara en 1-2 minutos en:
echo https://TU-USUARIO.github.io/NOMBRE-REPO/
echo.
pause
