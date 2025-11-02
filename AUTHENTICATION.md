# Authentication Information

## Password Protected Sections

The following sections of the website are password protected:

### Blog Section
- **URL**: `/blog`
- **Password**: `steven2024`
- **Access**: Required to create, view, and manage blog posts

### Photo Gallery
- **URL**: `/photos`
- **Password**: `steven2024`
- **Access**: Required to upload, view, and manage photos

## Security Features

- **Session-based authentication**: Password is only required once per browser session
- **Individual section protection**: Each section can be accessed independently
- **Logout functionality**: Red logout button appears in top-right corner when authenticated
- **Automatic session expiry**: Authentication expires when browser session ends

## Changing the Password

To change the password, edit the `correctPassword` variable in:
- `react-app/src/components/PasswordProtected.tsx` (line 45)

```typescript
const correctPassword = 'your-new-password-here';
```

## Technical Implementation

- Frontend-only authentication using React session storage
- No backend authentication required
- Password is stored in component code (client-side)
- Suitable for basic content protection, not high-security applications

## Usage Notes

- Authentication persists until browser tab/window is closed
- Each protected section requires separate authentication
- Refreshing the page maintains authentication status
- Logout button forces page reload and clears authentication