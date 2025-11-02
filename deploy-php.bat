@echo off
echo ================================
echo   stevenBAM PHP API Deployment
echo ================================
echo.

REM Navigate to PHP API directory
cd php-api

echo [1/2] Creating PHP API deployment package...
tar -czf php-api-deploy.tar.gz *.php .htaccess uploads/
if errorlevel 1 (
    echo ERROR: Failed to create PHP deployment package!
    pause
    exit /b 1
)

echo [2/2] Moving package to project root...
move php-api-deploy.tar.gz ..\
cd ..

echo.
echo ✅ PHP API deployment package created successfully!
echo 📦 File: php-api-deploy.tar.gz
echo 🚀 Upload this file to your Hostinger public_html/api/ directory
echo.
echo Next steps:
echo 1. Go to Hostinger File Manager
echo 2. Navigate to public_html/api/
echo 3. Delete old PHP files (keep any existing uploads)
echo 4. Upload php-api-deploy.tar.gz
echo 5. Extract the contents
echo.
pause