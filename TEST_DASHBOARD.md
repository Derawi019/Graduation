# Testing the Dashboard

## Quick Test Steps

### 1. **Make sure the app is running**
   - The app should be running at `http://localhost:5000`
   - Check: Visit `http://localhost:5000/health` - should show "healthy"

### 2. **Login to your account**
   - Go to: `http://localhost:5000/login`
   - Login with your credentials

### 3. **Access the Dashboard**
   There are **3 ways** to access the dashboard:

   **Option A: Click the Dashboard button**
   - After logging in, look at the top-right header
   - Click the "📊 Dashboard" button

   **Option B: Type the URL directly**
   - Go to: `http://localhost:5000/dashboard`
   - (You must be logged in first!)

   **Option C: Use the main app page**
   - The dashboard button is in the header on the main translation page

### 4. **What you should see**
   - **Statistics Cards** (6 cards):
     - Total Translations
     - This Month
     - This Week
     - Today
     - Favorites
     - Total Characters
   
   - **Charts** (if you have translations):
     - Activity Timeline (line chart)
     - Language Distribution (doughnut chart)
   
   - **Top Language Pairs** (if available)
   - **Additional Stats**

### 5. **If the dashboard is empty**
   - This is normal if you haven't made any translations yet!
   - Go to the main app page and create some translations
   - Then come back to the dashboard to see the stats

---

## Troubleshooting

### Dashboard shows "Loading..." forever
   - Check browser console (F12 → Console tab) for errors
   - Check if API endpoint is working: `http://localhost:5000/api/dashboard/stats`
   - Verify you're logged in

### "404 Not Found" error
   - Make sure the dashboard route exists
   - Restart the app: `pkill -f "python.*app.py"` then start again

### Dashboard shows but no data
   - This is normal if you have no translations
   - Make some translations first, then refresh the dashboard

### Redirects to login page
   - You're not logged in
   - Login first at: `http://localhost:5000/login`

---

## Testing Checklist

- [ ] App is running (`http://localhost:5000/health` shows healthy)
- [ ] Logged in to your account
- [ ] Dashboard button visible in header
- [ ] Can access `/dashboard` URL
- [ ] Dashboard page loads (shows stats cards)
- [ ] Charts appear (if you have translations)
- [ ] No errors in browser console (F12)

---

## Quick Test Command

Test the API endpoint directly (requires authentication):

```bash
# First, get a session cookie by logging in via browser
# Then test the API:
curl -b cookies.txt http://localhost:5000/api/dashboard/stats
```

Or just use your browser's developer tools (F12 → Network tab) to see the API response.

---

## Expected Dashboard Structure

```
📊 My Dashboard
├── Statistics Cards (6 cards in a row)
│   ├── Total Translations
│   ├── This Month
│   ├── This Week
│   ├── Today
│   ├── Favorites
│   └── Total Characters
│
├── Charts Section
│   ├── Activity Timeline (Line Chart)
│   └── Language Distribution (Doughnut Chart)
│
├── Top Language Pairs (List)
└── Additional Stats (Member Since, etc.)
```

---

## Need Help?

If the dashboard doesn't work:
1. Check browser console for JavaScript errors
2. Check server logs: `tail -f translation_app.log`
3. Verify all files exist:
   - `templates/dashboard.html`
   - `static/dashboard.js`
   - Dashboard route in `app.py`

