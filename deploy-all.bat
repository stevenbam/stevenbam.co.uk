@echo off
echo ========================================
echo   stevenBAM Full Site Deployment
echo ========================================
echo.
echo This will build and package both:
echo - React frontend (for public_html/)
echo - PHP API backend (for public_html/api/)
echo.
pause

echo [STEP 1] Building React App...
echo ================================
cd react-app
call npm run build
if errorlevel 1 (
    echo ERROR: React build failed!
    pause
    exit /b 1
)
echo ✅ React build completed
echo.

echo [STEP 2] Packaging React App...
echo ================================
cd build
tar -czf react-app-deploy.tar.gz *
move react-app-deploy.tar.gz ..\..\
cd ..\..
echo ✅ React package created
echo.

echo [STEP 3] Packaging PHP API...
echo ================================
cd php-api
tar -czf php-api-deploy.tar.gz *.php .htaccess uploads/
move php-api-deploy.tar.gz ..\
cd ..
echo ✅ PHP API package created
echo.

echo ========================================
echo   🎉 DEPLOYMENT PACKAGES READY! 🎉
echo ========================================
echo.
echo Created files:
echo 📦 react-app-deploy.tar.gz  → Upload to public_html/
echo 📦 php-api-deploy.tar.gz    → Upload to public_html/api/
echo.
echo Upload Instructions:
echo 1. Go to Hostinger File Manager
echo 2. Upload react-app-deploy.tar.gz to public_html/ and extract
echo 3. Upload php-api-deploy.tar.gz to public_html/api/ and extract
echo 4. Your site will be live! ✨
echo.
echo Tip: Run deploy-react.bat or deploy-php.bat for individual updates
echo.
pause