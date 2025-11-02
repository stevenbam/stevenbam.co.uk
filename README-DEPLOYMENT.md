# 🚀 stevenBAM Deployment Guide

Automated deployment scripts for your React + PHP website.

## Quick Start

### Deploy Everything
```bash
# Build and package both React frontend + PHP API
deploy-all.bat
```

### Deploy Just React (after frontend changes)
```bash
# Build React and create deployment package
deploy-react.bat
```

### Deploy Just PHP (after backend changes)
```bash
# Package PHP API files
deploy-php.bat
```

## How It Works

### React Deployment (`deploy-react.bat`)
1. Runs `npm run build` to create optimized production files
2. Creates `react-app-deploy.tar.gz` package
3. Upload to `public_html/` on Hostinger

### PHP Deployment (`deploy-php.bat`)
1. Packages all `.php` files, `.htaccess`, and `uploads/` folder
2. Creates `php-api-deploy.tar.gz` package  
3. Upload to `public_html/api/` on Hostinger

### Full Deployment (`deploy-all.bat`)
1. Builds React frontend
2. Packages both React and PHP
3. Creates both deployment packages

## Upload Process

1. **Run deployment script** (creates .tar.gz files)
2. **Go to Hostinger File Manager**
3. **Upload packages to correct directories:**
   - `react-app-deploy.tar.gz` → `public_html/`
   - `php-api-deploy.tar.gz` → `public_html/api/`
4. **Extract the files** in their respective directories
5. **Your site is live!** ✨

## Development Workflow

```bash
# 1. Make changes to React or PHP code
# 2. Test locally with npm start + development servers  
# 3. When ready to deploy:
deploy-all.bat        # For major updates
# OR
deploy-react.bat      # Just frontend changes
deploy-php.bat        # Just backend changes
```

## File Structure After Deployment

```
Hostinger public_html/
├── index.html (React app)
├── static/ (React assets)
└── api/
    ├── index.php (PHP router)
    ├── config.php (Database config)
    ├── blog.php (Blog endpoints)
    ├── photo.php (Photo endpoints)
    ├── .htaccess (URL rewriting)
    └── uploads/ (Photo storage)
```

## Troubleshooting

- **React build fails**: Check for TypeScript/ESLint errors
- **PHP upload fails**: Ensure `.htaccess` and `uploads/` folder are included
- **Site not updating**: Clear browser cache or try incognito mode
- **Database errors**: Check `config.php` credentials

## Pro Tips

- Test everything locally before deploying
- Keep the C# API code for future VPS migration (2027!)
- The scripts create timestamped packages for easy rollback
- PHP changes take effect immediately, React needs rebuild