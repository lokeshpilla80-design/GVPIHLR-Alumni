# Gayatri Vidya Parishad (GVP) Alumni Website MVP2

A full-stack web application for GVP College alumni management, featuring a public website for alumni networking, event management, heritage preservation, and an admin dashboard for content management.

## Features

### Public Features
- **Alumni Directory**: Browse 30,000+ alumni profiles with achievements
- **Events**: View upcoming and past college events (reunions, workshops, cultural)
- **Heritage Center**: Document and celebrate institutional history
- **Gallery**: Photo collection from alumni events
- **Contact Forms**: Submit inquiries and feedback
- **Content Pages**: Dynamic about sections, messages, governing body
- **User Accounts**: Alumni account registration, sign-in, password recovery, and sign-out

### Admin Features
- **Dashboard**: Manage all content and data
- **Alumni Management**: Add/edit/delete alumni profiles
- **Event Management**: Create and manage events
- **Content Management**: Update website content dynamically
- **Gallery Management**: Upload, edit, delete photos with drag-and-drop
- **Contact Management**: View and respond to submissions

### Alumni Data Management
- Alumni users can save and update their private alumni profile at `/alumni-profile`.
- Profiles are stored in the separate MongoDB `alumnirecords` collection and are linked one-to-one to the signed-in `users` account.
- Admin, manager, and super-admin roles can use `/admin/alumni` to review statistics, search/filter, sort, paginate, edit/delete, and export the matching records as `.xlsx`.
- Profile records are not exposed through the public alumni directory. Alumni users can access only their own record.
- Profile photos are uploaded to Cloudinary. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in the backend environment to enable photo uploads.
- Excel import is not included; it remains a separate optional feature and no import is presented in the dashboard.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | Next.js 14, React 18, Tailwind CSS 3.3, Axios |
| **Backend** | Node.js, Express 5.2 |
| **Database** | MongoDB (Atlas/local) |
| **Authentication** | JWT (jsonwebtoken 9.0), bcryptjs 3.0 |
| **File Upload** | Multer 2.1, Cloudinary |
| **Deployment** | Frontend: Vercel, Backend: Render, DB: MongoDB Atlas |

## Local Development Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Gayatri_mvp2
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env file with:
   # MONGO_URI=your_mongodb_connection_string
   # JWT_SECRET=your_jwt_secret
   # GOOGLE_CLIENT_ID=your_google_oauth_web_client_id
   # EMAIL_HOST=smtp.yourprovider.com
   # EMAIL_PORT=587
   # EMAIL_USER=your-smtp-username
   # EMAIL_PASS=your-smtp-password
   # EMAIL_FROM="GVP Alumni <no-reply@yourdomain.com>"
   # EMAIL_ADMIN=secgayatrigrads@gmail.com
   # FRONTEND_URL=http://localhost:3000
   # CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   # CLOUDINARY_API_KEY=your_cloudinary_api_key
   # CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   npm start  # or node server.js
   ```
   Backend runs on http://localhost:5000

   Alternatively run MongoDB locally via Docker Compose (recommended for development):

   ```bash
   # from project root
   cp .env.example .env
   docker compose up -d
   # then start backend (it will connect to the mongo service):
   cd backend
   npm install
   npm start
   ```

   To seed sample notifications after MongoDB is available:

   ```bash
   cd backend
   npm run seed:notifications
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # Create .env.local with:
   # NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_web_client_id
   npm run dev
   ```
   Frontend runs on http://localhost:3000 (or 3001 if 3000 occupied)

   Configure a Google OAuth 2.0 Web application client in Google Cloud Console.
   Add each frontend origin (for local development, `http://localhost:3000`) to
   its authorized JavaScript origins. Set the same client ID as
   `GOOGLE_CLIENT_ID` in the backend environment and
   `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in the frontend environment. Google sign-in
   verifies the ID token on the backend. User Google sign-in starts a
   temporary user-dashboard session; its profile is held only in frontend
   memory.    Users register at `/register` with a name, email, password, and confirmation,
   then sign in at `/user-login`. Registration stores bcrypt password hashes
   and assigns only the `alumni` role. Authenticated users can access the
   existing home page; expired or signed-out sessions return to user sign-in.
   Forgot-password emails require the backend SMTP settings above and a
   `FRONTEND_URL` matching the deployed frontend origin. Reset links expire
   after one hour. The separate `/login` administrator sign-in remains
   unchanged.

### Admin Login
- Create the first admin by setting `ADMIN_NAME`, `ADMIN_EMAIL`, and
  `ADMIN_PASSWORD` (at least 8 characters) in the backend environment, then run
  `node create-admin.js` from the `backend` directory.
- Admin-managed password accounts remain in MongoDB in the `users` collection;
  passwords are stored as bcrypt hashes.
- Google role approvals are stored separately in `accessgrants` with the
  admin-entered display name, approved email, and assigned role. Google
  profile details and passwords are not saved. Admins can add, edit, or remove
  approvals from Dashboard → Admin Accounts; revoked or changed approvals
  invalidate previous role tokens.
- Approved Google-role tokens are stored in browser `sessionStorage` and
  contain only the grant ID and role. Temporary visitor profiles remain in
  memory only and disappear on refresh or close.
- **Dashboard**: http://localhost:3000/dashboard (after login)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create a user account (name/email/password/confirmPassword; role is always `alumni`)
- `POST /api/auth/login` - Sign in with email and password
- `POST /api/auth/user/login` - Sign in to a user account (alumni only)
- `POST /api/auth/user/forgot-password` - Email a one-time password reset link
- `POST /api/auth/user/reset-password` - Set a new password with a valid reset token
- `POST /api/auth/logout` - Revoke the current JWT session
- `POST /api/auth/google/user` - Start a non-persistent user session
- `POST /api/auth/google/admin` - Sign in an admin with an approved role
- `GET /api/auth/me` - Return the authenticated user's own profile
- `GET /api/auth/dashboard` - Admin/editor-only dashboard endpoint
- `GET /api/auth/users/password-accounts` - List password-based admin accounts (admin/super-admin)
- `POST /api/auth/users/password-accounts` - Create a password-based admin account (admin/super-admin)
- `PUT /api/auth/users/password-accounts/:id` - Update a password-based admin account, including an optional password change
- `DELETE /api/auth/users/password-accounts/:id` - Remove a password-based admin account

### Alumni Data Management
- `GET /api/alumni-records/me` - Get the signed-in alumni user's record
- `PUT /api/alumni-records/me` - Create or update the signed-in alumni user's record
- `POST /api/alumni-records/me/photo` - Upload a profile image (Cloudinary configuration required)
- `GET /api/alumni-records/admin/summary` - Administrator-only statistics
- `GET /api/alumni-records/admin` - Administrator-only search, filters, sorting, and pagination
- `GET /api/alumni-records/admin/export` - Export all matching filters to an Excel workbook
- `PUT /api/alumni-records/admin/:id` - Update a record (email remains linked to its account)
- `DELETE /api/alumni-records/admin/:id` - Delete a record

Alumni registration requires an authenticated, persistent alumni account; the form does not create authentication accounts or grant roles. MongoDB must be configured with `MONGO_URI`. Profile images additionally require the Cloudinary variables above. No sample alumni rows are inserted into the new collection.

User registration/login creates persistent user accounts with bcrypt-hashed
passwords. The user home page requires an authenticated alumni account, and
logout or password reset revokes prior JWT sessions. Google user sign-in
continues to create a temporary session and never grants admin access. Admin
sign-in is separate and checks administrator accounts/roles. Role management
is restricted to admin and super-admin roles. From Dashboard → Admin Accounts,
authorized administrators can create password-based admin accounts; these use
the existing admin sign-in page and store only bcrypt password hashes. Admin
account rows support editing and removal; only super-admins can create, edit,
or remove super-admin accounts, and the final super-admin account cannot be
demoted or removed.

### Alumni
- `GET /api/alumni` - Public alumni list
- `POST /api/alumni` - Add alumni (admin)
- `PUT /api/alumni/:id` - Update alumni (admin)
- `DELETE /api/alumni/:id` - Delete alumni (admin)

### Events
- `GET /api/events` - Public events
- `POST /api/events` - Add event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

### Gallery
- `GET /api/gallery` - Public gallery images
- `POST /api/gallery` - Upload image (admin)
- `PUT /api/gallery/:id` - Update image metadata (admin)
- `DELETE /api/gallery/:id` - Delete image (admin)

### Content & Others
- `GET /api/content` - Dynamic content
- `GET /api/contacts` - Contact submissions
- `GET /api/heritage` - Heritage events

## Project Structure

```
Gayatri_mvp2/
├── backend/
│   ├── config/          # Database config
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── uploads/gallery/ # File storage
│   └── server.js        # Express app
├── frontend/
│   ├── components/      # Reusable React components
│   ├── pages/           # Next.js routes
│   ├── public/images/   # Static assets
│   ├── services/        # API client
│   └── styles/          # Global styles
└── docs/                # Documentation
```

## Deployment

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set build command: `npm run build`
3. Set output directory: `.next`

### Backend (Render)
1. Connect GitHub repo
2. Set build command: `npm install`
3. Set start command: `node server.js`
4. Add environment variables: `MONGO_URI`, `JWT_SECRET`

### Database (MongoDB Atlas)
1. Create cluster
2. Get connection string
3. Whitelist IP addresses
4. Create database user

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

This project is proprietary to Gayatri Vidya Parishad College.