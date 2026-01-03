# Preptrack Backend Deployment Guide (Render)

## Overview
This guide covers deploying the Django backend to Render with PostgreSQL and migrating assessment data.

---

## Prerequisites
- GitHub repository with `backendWithAuth/` code pushed
- Render account (free tier available)
- Your Render PostgreSQL connection string (user already provided)

---

## Step 1: Set Up GitHub Repository

If not already done, push your code to GitHub:

```bash
cd c:\Users\rajaa\OneDrive\Desktop\IIT K\Intern-Preptrack\Preptrack-CBT
git init
git add .
git commit -m "Initial commit: Django backend with auth, React frontend with Vite"
git remote add origin https://github.com/<your-username>/preptrack-cbt.git
git push -u origin main
```

---

## Step 2: Deploy to Render via Dashboard

### Manual Method (Recommended for First Deploy)

1. **Create Render Account & Login**
   - Go to https://render.com
   - Sign up and log in

2. **Connect GitHub Repo**
   - In Render dashboard, click "New +" → "Web Service"
   - Select "Build and deploy from a Git repository"
   - Connect your GitHub account and select the `preptrack-cbt` repo
   - Click "Connect"

3. **Configure Web Service**

   | Field | Value |
   |-------|-------|
   | **Name** | `preptrack-backend` |
   | **Runtime** | `Python 3` |
   | **Build Command** | `pip install -r backendWithAuth/requirements.txt && cd backendWithAuth && python manage.py migrate` |
   | **Start Command** | `cd backendWithAuth && gunicorn backendWithAuth.wsgi:application --bind 0.0.0.0:$PORT` |
   | **Plan** | Free (or Starter for production) |

4. **Set Environment Variables**

   Click "Advanced" → "Add Environment Variable" for each:

   | Key | Value | Notes |
   |-----|-------|-------|
   | `DATABASE_URL` | `postgresql://preptrack_db_user:Cxh7F4KNKkvpRjEQtoTFtwFqcqbsQdXd@dpg-d5co54khg0os73eiell0-a.oregon-postgres.render.com/preptrack_db` | Already provided by user |
   | `SECRET_KEY` | `<generate a long random string>` | Use `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"` |
   | `DEBUG` | `false` | **Never True in production** |
   | `ALLOWED_HOSTS` | `preptrack-backend.onrender.com` | Will be your Render domain |
   | `CORS_ALLOWED_ORIGINS` | `https://your-frontend-domain.com` | Update with your frontend URL |
   | `CSRF_TRUSTED_ORIGINS` | `https://your-frontend-domain.com` | Must match frontend domain |
   | `COOKIE_SECURE` | `true` | Render enforces HTTPS |
   | `COOKIE_SAMESITE` | `Lax` | Can be `Lax`, `Strict`, or `None` |

5. **Click "Create Web Service"**
   - Render will build and deploy automatically
   - Monitor build progress in the dashboard
   - Once deployed, you'll get a URL like `https://preptrack-backend.onrender.com`

---

## Step 3: Verify Deployment

Once deployment succeeds:

```bash
# Test the API
curl https://preptrack-backend.onrender.com/api/accounts/profile/

# Expected: 401 Unauthorized (no auth token yet)
# Good sign! Means the server is running.
```

---

## Step 4: Migrate Assessment Data (Optional)

If you have old assessment data in the local `preptrack_db2`:

### Prerequisites
- Local access to `preptrack_db2` (old database)
- Render Postgres connection string (as above)

### Steps

1. **Ensure `transfer_assessments.py` exists**
   ```
   backendWithAuth/assessments/management/commands/transfer_assessments.py
   ```

2. **Dry run locally** (preview what will be migrated)
   ```bash
   cd backendWithAuth
   python manage.py transfer_assessments --dry-run
   ```

3. **Run migration** (if preview looks good)
   ```bash
   python manage.py transfer_assessments
   ```

### What Gets Migrated
- Practice papers
- Topics
- Exams
- Sections
- Questions
- Options
- Correct answers
- Media files (images, PDFs)

---

## Step 5: Deploy Frontend (React + Vite)

### Option A: Vercel (Recommended for Vite + React)

1. **Push code to GitHub** (done in Step 1)

2. **Go to https://vercel.com**
   - Sign up with GitHub
   - Import your repo
   - Select `frontend/` as root directory
   - Add environment variable:
     ```
     VITE_API_URL=https://preptrack-backend.onrender.com/api
     ```
   - Deploy

3. **Update backend CORS**
   - In Render dashboard, update `CORS_ALLOWED_ORIGINS`:
     ```
     https://preptrack-cbt.vercel.app
     ```
   - Redeploy backend

### Option B: Render (Free but slower cold starts)

1. **Create static site on Render**
   - "New +" → "Static Site"
   - Select repo, point to `frontend/` directory
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`

---

## Step 6: Link Frontend to Backend

Update `frontend/vite.config.js`:

```javascript
export default defineConfig({
  // ... existing config ...
  server: {
    proxy: {
      '/api': {
        target: 'https://preptrack-backend.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})
```

---

## Step 7: Test Full Stack

1. **Login with your account**
   - Navigate to your frontend URL
   - Use credentials from the accounts table in Render Postgres

2. **Verify:**
   - ✅ Login/signup works
   - ✅ Cookies set (check DevTools → Application → Cookies)
   - ✅ Profile loads (GET `/api/accounts/profile/`)
   - ✅ Practices load with caching
   - ✅ Can take exams
   - ✅ Logout works

---

## Troubleshooting

### Build fails with "ModuleNotFoundError"
- Ensure `requirements.txt` has all dependencies
- Check `build_command` points to correct directory

### 500 errors on Render
- Check logs: Render dashboard → "Logs" tab
- Common issue: `DATABASE_URL` env var not set
- Ensure all `config()` calls in settings.py have sensible defaults

### Cookies not working
- Verify `COOKIE_SECURE=true` and `COOKIE_SAMESITE` are set
- Ensure frontend and backend domains match in CORS/CSRF settings
- Check browser → DevTools → Network → set `Cookie` request header visible

### CORS errors
- Verify `CORS_ALLOWED_ORIGINS` matches your frontend domain exactly
- Include `https://` in the URL

### Media files not loading
- Run `transfer_assessments.py` with media file path
- Or manually upload files to Render's storage (premium feature)

---

## Summary of Environment Variables

```bash
DATABASE_URL=postgresql://user:pass@host/dbname
SECRET_KEY=<random-string-from-django>
DEBUG=false
ALLOWED_HOSTS=preptrack-backend.onrender.com,your-custom-domain.com
CORS_ALLOWED_ORIGINS=https://frontend-domain.com
CSRF_TRUSTED_ORIGINS=https://frontend-domain.com
COOKIE_SECURE=true
COOKIE_SAMESITE=Lax
```

---

## Next Steps

1. ✅ Configure settings.py (DONE)
2. ✅ Add gunicorn to requirements.txt (DONE)
3. ✅ Create render.yaml (DONE)
4. **Push to GitHub**
5. **Deploy to Render**
6. **Migrate data** (if needed)
7. **Deploy frontend**
8. **Test end-to-end**

