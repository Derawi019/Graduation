# Admin Dashboard Setup Guide

## ✅ What's Been Created

The admin dashboard has been fully implemented with the following features:

1. **Admin User Field**: Added `is_admin` boolean field to User model
2. **Admin Authentication**: Created `@admin_required` decorator to protect admin routes
3. **Admin Dashboard**: Complete admin interface at `/admin`
4. **Statistics**: System-wide statistics and analytics
5. **User Management**: View and search all users
6. **Translation Management**: View and search all translations

---

## 🚀 Setup Steps

### Step 1: Run the Migration

First, add the `is_admin` column to your database:

```bash
cd "/Users/mezan/Desktop/Translation app"
source venv/bin/activate
python migrate_add_admin_field.py
```

This will:
- Add the `is_admin` column to the `users` table
- Create an index on `is_admin` for faster queries
- Set all existing users to `is_admin = FALSE` by default

### Step 2: Make Yourself Admin

After running the migration, you need to set your user account as admin. You can do this in several ways:

#### Option A: Using SQL directly

```bash
# Connect to your database
psql -U postgres -d translation_app

# Update your user (replace with your email)
UPDATE users SET is_admin = TRUE WHERE email = 'your@email.com';

# Verify
SELECT email, is_admin FROM users WHERE email = 'your@email.com';
```

#### Option B: Using Python script

Create a file `make_admin.py`:

```python
from app import app, db
from app import User

with app.app_context():
    email = input("Enter email to make admin: ")
    user = User.query.filter_by(email=email).first()
    if user:
        user.is_admin = True
        db.session.commit()
        print(f"✅ {email} is now an admin!")
    else:
        print(f"❌ User {email} not found")
```

Then run:
```bash
python make_admin.py
```

---

## 📊 Admin Dashboard Features

### Overview Tab

- **Total Users**: Count of all registered users
- **Total Translations**: Count of all translations
- **Verified Users**: Users who have verified their email
- **Active Users**: Users who logged in within the last 30 days
- **New Users (Month)**: Users registered this month
- **Translations (Month)**: Translations made this month
- **Activity Timeline Chart**: Translations per day for last 7 days
- **Language Distribution Chart**: Most translated languages
- **Provider Distribution Chart**: Users by authentication provider (local/Google)

### Users Tab

- View all users in a searchable table
- Search by email, name, or username
- See user details:
  - Email, name, username
  - Authentication provider
  - Email verification status
  - Admin status
  - Number of translations
  - Account creation date
  - Last login date
- Pagination for large user lists

### Translations Tab

- View all translations in a searchable table
- Search by original or translated text
- See translation details:
  - User who made the translation
  - Source and target languages
  - Original and translated text (truncated for display)
  - Translation date
- Pagination for large translation lists

---

## 🔐 Access Control

### Admin Routes

The following routes are protected with `@admin_required`:

- `/admin` - Admin dashboard page
- `/api/admin/stats` - Admin statistics API
- `/api/admin/users` - Users list API
- `/api/admin/translations` - Translations list API

### Security

- Only users with `is_admin = TRUE` can access admin routes
- Non-admin users will see "Access denied" message
- Admin access attempts are logged for security

---

## 🎨 UI Features

### Navigation

- Admin button appears in navigation header (red "⚙️ Admin" button)
- Only visible to users with admin privileges
- Available on:
  - Main app page (`/`)
  - User dashboard (`/dashboard`)

### Dark Mode

- Admin dashboard supports dark mode
- Uses same theme toggle as rest of app
- Theme preference is saved in localStorage

---

## 📝 API Endpoints

### GET `/api/admin/stats`

Returns system-wide statistics:

```json
{
  "total_users": 150,
  "total_translations": 1250,
  "active_users": 45,
  "new_users_month": 12,
  "new_users_week": 3,
  "translations_month": 180,
  "translations_week": 45,
  "verified_users": 135,
  "admin_users": 2,
  "language_distribution": {
    "English": 500,
    "Spanish": 300,
    "French": 200
  },
  "provider_distribution": {
    "local": 100,
    "google": 50
  },
  "activity_timeline": [...]
}
```

### GET `/api/admin/users`

Returns paginated list of users with search and filtering:

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `per_page` (int): Items per page (default: 20)
- `search` (string): Search query (searches email, name, username)
- `sort_by` (string): Column to sort by (default: 'created_at')
- `sort_order` (string): 'asc' or 'desc' (default: 'desc')

### GET `/api/admin/translations`

Returns paginated list of translations with search:

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `per_page` (int): Items per page (default: 20)
- `search` (string): Search query (searches original/translated text)
- `user_id` (int): Filter by specific user ID

---

## 🔧 Customization

### Adding More Admin Features

To add new admin features:

1. Create a new route in `app.py`:
```python
@app.route('/admin/your-feature', methods=['GET'])
@admin_required
def your_admin_feature():
    # Your code here
    return render_template('your_template.html')
```

2. Add navigation link in templates (only visible to admins):
```html
{% if user.is_admin %}
<a href="{{ url_for('your_admin_feature') }}">Your Feature</a>
{% endif %}
```

### Customizing Statistics

Edit the `get_admin_stats()` function in `app.py` to add more statistics or modify existing ones.

---

## 🐛 Troubleshooting

### "Access denied" when accessing `/admin`

**Problem**: You're not marked as admin in the database.

**Solution**:
1. Run the migration script: `python migrate_add_admin_field.py`
2. Set your user as admin (see Step 2 above)
3. Log out and log back in

### Migration fails

**Problem**: The `is_admin` column might already exist.

**Solution**: The migration script checks if the column exists and will skip adding it if it's already there. This is safe to run multiple times.

### Charts not displaying

**Problem**: Chart.js library not loading.

**Solution**: Check browser console for errors. Ensure internet connection is available (Chart.js is loaded from CDN).

---

## 📚 Next Steps

Potential enhancements you could add:

1. **User Management Actions**:
   - Delete users
   - Toggle admin status
   - Verify/unverify emails
   - Reset user passwords

2. **Translation Management**:
   - Delete translations
   - Export all translations
   - Filter by date range

3. **Advanced Statistics**:
   - Daily/weekly/monthly growth charts
   - User activity heatmaps
   - Language pair popularity trends

4. **System Settings**:
   - Configure rate limits
   - System maintenance mode
   - Email configuration

---

## ✅ Checklist

- [ ] Run migration script: `python migrate_add_admin_field.py`
- [ ] Set your user as admin in database
- [ ] Log out and log back in
- [ ] Access `/admin` route
- [ ] Verify admin button appears in navigation
- [ ] Test all three tabs (Overview, Users, Translations)
- [ ] Test search functionality
- [ ] Test pagination
- [ ] Verify charts display correctly

---

**Enjoy your new admin dashboard!** 🎉

