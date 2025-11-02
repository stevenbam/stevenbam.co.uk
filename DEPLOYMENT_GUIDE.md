# Hostinger Deployment Guide

## Files Ready for Upload

### 1. Frontend (React) - Main Website
**Location**: `react-app/build/`
**Upload to**: Your main domain root (e.g., `public_html/`)
**Domain**: https://stevenbam.co.uk

### 2. Backend (C# API) - API Server
**Location**: `StevenSiteAPI/publish/`
**Upload to**: Subdomain folder (e.g., `public_html/api/`)
**Domain**: https://api.stevenbam.co.uk

## Deployment Steps

### Step 1: Upload Frontend Files
1. Compress the `react-app/build/` folder contents
2. Upload to your main domain root directory
3. Extract files in the root directory

### Step 2: Upload Backend Files
1. Compress the `StevenSiteAPI/publish/` folder contents
2. Upload to your API subdomain directory
3. Extract files in the API directory
4. Ensure `web.config` is in the root of API directory

### Step 3: Configure Hostinger

#### A. Domain Setup
1. Set up main domain: `stevenbam.co.uk`
2. Create subdomain: `api.stevenbam.co.uk`
3. Point subdomain to `/api/` folder

#### B. Database Setup
- Server: 127.0.0.1:3306
- Database: u128398700_stevenbam
- Username: stevenbam
- Password: $Aragorn60
- *Database should already be configured in production settings*

#### C. SSL Certificate
- Enable SSL for both domains in Hostinger control panel
- Ensure HTTPS is working for both main site and API

### Step 4: Environment Configuration

#### Frontend Environment
- Production build automatically uses: `https://api.stevenbam.co.uk/api`
- No additional configuration needed

#### Backend Environment
- Uses MySQL in production mode
- Connection string configured in `appsettings.Production.json`
- CORS configured for `https://stevenbam.co.uk`

## File Structure After Upload

```
public_html/
├── index.html (React app)
├── static/
│   ├── css/
│   ├── js/
│   └── media/
└── api/
    ├── StevenSiteAPI.dll
    ├── appsettings.json
    ├── appsettings.Production.json
    ├── web.config
    ├── wwwroot/
    │   └── uploads/
    └── [other API files]
```

## Post-Deployment Checklist

1. ✅ Main website loads: https://stevenbam.co.uk
2. ✅ API responds: https://api.stevenbam.co.uk/api/blog
3. ✅ Database connection works
4. ✅ CORS headers allow frontend requests
5. ✅ File uploads work (photos)
6. ✅ Blog posts can be created/deleted
7. ✅ Authentication works for admin actions

## Troubleshooting

### Common Issues:
- **500 Error**: Check web.config and .NET runtime on server
- **CORS Error**: Verify domain settings in Program.cs
- **Database Error**: Check MySQL connection string
- **File Upload Error**: Ensure wwwroot/uploads folder exists

### Admin Access
- Password: `steven2024`
- Required for: Creating/deleting blog posts, uploading/deleting photos

## Important Notes

1. **Security**: Database credentials are in production config
2. **File Uploads**: Photos stored in `wwwroot/uploads/`
3. **Authentication**: Client-side only, suitable for personal site
4. **Environment**: Automatically detects production vs development

## Support

If you encounter issues:
1. Check Hostinger error logs
2. Verify .NET Core runtime is available
3. Ensure MySQL connection is working
4. Check domain DNS settings