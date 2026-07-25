# MI Logistics — React Admin Dashboard Frontend

Vite + React 18 admin dashboard for the MI Logistics parcel management system.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Build | Vite 5 |
| UI | React 18 |
| Routing | React Router v6 |
| HTTP | Axios (with JWT interceptor + auto-refresh) |
| Charts | Chart.js + react-chartjs-2 |
| Icons | react-icons (Feather set) |
| Toasts | react-hot-toast |
| Dates | date-fns |

---

## Project Structure

```
mi-logistics/
├── src/
│   ├── context/
│   │   ├── AuthContext.jsx   # JWT login, session restore, logout
│   │   └── AppContext.jsx    # All data (shipments/customers/staff) + CRUD
│   ├── services/
│   │   └── api.js            # Axios instance + JWT interceptor + all services
│   ├── pages/
│   │   ├── auth/             # Login, ForgotPassword
│   │   ├── dashboard/        # Dashboard with stat cards + charts
│   │   ├── shipments/        # Shipments CRUD table
│   │   ├── tracking/         # Internal tracking search
│   │   ├── customers/        # Customers CRUD table
│   │   ├── staff/            # Staff CRUD table
│   │   ├── reports/          # Analytics charts
│   │   └── settings/         # Company profile, theme, password
│   ├── components/
│   │   └── common/           # Sidebar, UIComponents (Modal, Badge, etc.)
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   ├── layouts/
│   │   └── MainLayout.jsx
│   ├── utils/
│   │   └── helpers.js        # formatCurrency, formatDate, etc.
│   └── data/
│       └── sampleData.js     # Static chart data (monthly reports placeholder)
├── .env                      # VITE_API_BASE_URL (created during setup)
├── .env.example
└── README.md
```

---

## Setup (Step by Step)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

The default `.env` content:

```ini
VITE_API_BASE_URL=http://localhost:8000/api
```

Change the URL if your Django backend runs on a different host/port.

### 3. Start the dev server

```bash
npm run dev
```

Frontend runs at **http://localhost:5173**

Make sure the Django backend is also running at port 8000 (or whatever
you set in `.env`) before logging in.

### 4. Login

```
Email:    admin@milogistics.in
Password: admin123
```

(Created by the backend's `python manage.py seed_data` command.)

---

## Build for Production

```bash
npm run build
```

Output goes to `dist/`. Serve it with any static file server, Nginx, or
upload to Netlify/Vercel — just make sure `VITE_API_BASE_URL` points at
your deployed Django backend.

---

## Auth Flow

- Login sends `POST /api/auth/login/` → receives `access` + `refresh` tokens + user profile.
- Tokens are stored in `localStorage` under `mi-token` and `mi-refresh-token`.
- Every request from `api.js` automatically attaches `Authorization: Bearer {access}`.
- On a 401 response, the axios interceptor automatically calls `/api/auth/refresh/`
  once and retries the original request.
- If the refresh also fails (token expired), the user is logged out and
  redirected to `/login`.
- On page refresh, `AuthContext` re-validates the stored token via
  `GET /api/auth/me/` before showing any protected route.

---

## Pages & Features

### Dashboard
- Real-time stat cards: Total Shipments, Delivered, Pending, In Transit
- Revenue overview (monthly placeholder chart)
- Shipment status donut chart (live data)
- Recent shipments table

### Shipments
- Full CRUD (create, view, edit, delete)
- Filter by status (All / Pending / In Transit / Delivered / Cancelled)
- Search by tracking number, customer name, destination
- Pagination (8 per page)

### Tracking
- Search by tracking number (e.g. `MIL-2024-002`)
- Full timeline of events with location, timestamp, status dots
- Calls authenticated endpoint, so staff can see full parcel details

### Customers
- Full CRUD with paginated table
- Real-time computed `totalShipments` and `totalSpent` per customer
- Filter by status (Active / Inactive)

### Staff
- Full CRUD
- Department filter (Delivery / Support / Warehouse / Operations)
- Star rating display, salary, delivery count (linked to real shipments)

### Reports
- Monthly shipment volume + revenue charts (placeholder data)
- Active customer count is live

### Settings
- Company profile form (local state)
- Change password (calls `/api/auth/change-password/`)
- Theme toggle (light / dark)

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000/api` | Django backend base URL |

---

## Notes

- Decimal fields from DRF (amount, salary, rating, totalSpent) are
  coerced to `Number` in `AppContext` when data loads, so currency
  calculations work correctly without type errors.
- The sidebar shows the logged-in user's name, role, and initials from
  the JWT token's embedded user profile (via `AuthContext`).
- Staff deliveries count reflects actual delivered shipments in the DB,
  not hardcoded numbers — will be low with the seed dataset (10 shipments).
