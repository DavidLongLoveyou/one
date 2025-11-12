# Project Setup

## GitHub Authentication

Your GitHub Personal Access Token has been configured. Here are secure ways to use it:

### Quick Setup
Run the setup script to configure authentication:
```powershell
.\setup-github.ps1
```

### Option 1: Git Credential Manager (Recommended)
Git Credential Manager is already configured. When you push/pull, you'll be prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Use your Personal Access Token (not your GitHub password)

The credential manager will securely store your credentials for future use.

### Option 2: Environment Variable (Current Session)
The token is set as an environment variable for the current PowerShell session. You can also set it manually:
```powershell
$env:GITHUB_TOKEN = "your-token-here"
```

### Option 3: Remote URL with Token
When adding a remote, you can include the token in the URL:
```bash
git remote add origin https://your-token-here@github.com/username/repo.git
```

### Current Git Configuration
- **User**: Huyth
- **Email**: huyth@example.com
- **Default Branch**: main
- **Credential Helper**: manager-core (Windows Credential Manager)

## Next Steps

1. **Connect to a GitHub repository:**
   ```bash
   git remote add origin https://github.com/username/repo.git
   git push -u origin main
   ```

2. **Or create a new repository on GitHub** and then connect it.

⚠️ **Security Note**: 
- Never commit your token to version control. It's already added to `.gitignore`.
- If this token was exposed, revoke it immediately in GitHub Settings → Developer settings → Personal access tokens.




