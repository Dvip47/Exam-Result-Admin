# SarkariResult Admin Panel

A modern, responsive admin dashboard for managing the SarkariResult application. Built with **Next.js 14**, **Tailwind CSS**, and **React**.

## 🛠 Tech Stack

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Forms**: React Hook Form
-   **Rich Text Editor**: React Quill
-   **Date Handling**: date-fns
-   **HTTP Client**: Axios

## 📂 Project Structure

```
admin/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── dashboard/       # Protected admin routes (Layout & Overview)
│   │   ├── login/           # Authentication page
│   │   ├── layout.js        # Root layout
│   │   └── page.js          # Root page (redirects)
│   ├── components/          # Reusable UI components
│   │   └── ProtectedRoute.js # High-order component for auth protection
│   ├── lib/                 # Utilities and helpers
│   │   └── auth.js          # Authentication logic (getToken, getUser, etc.)
│   └── globals.css          # Global styles & Tailwind directives
├── public/                  # Static assets
├── .env.local               # Environment variables
└── package.json            
```

## 🚀 Features

### ✅ Implemented
-   **Authentication**: JWT-based login system with secure token storage.
-   **Responsive Layout**: Mobile-friendly sidebar navigation with toggle.
-   **Protected Routes**: `dashboard` routes are guarded; unauthenticated users are redirected to login.
-   **Dashboard Shell**: Navigation menu set up for Categories, Posts, Pages, and Media.

### 🚧 Coming Soon (Navigation exists, pages to be created)
-   **Categories Management**: Create, edit, list, and delete categories.
-   **Posts Management**: Job post editor with rich text support.
-   **Pages Management**: Static page CRUD.
-   **Media Library**: File upload and management.

## ⚙️ Setup & Installation

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Setup**
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5001/api
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    # Runs on http://localhost:3001
    ```

## 🔐 Authentication Flow

1.  User logs in at `/login`.
2.  On success, `accessToken` and `user` data are stored (typically in cookies/localStorage).
3.  `ProtectedRoute` component checks for the token.
    -   If present: Renders children (Dashboard).
    -   If missing: Redirects to `/login`.

## 📦 Key Libraries

-   `lucide-react`: Used for sidebar icons (LayoutDashboard, FolderOpen, etc.).
-   `react-hook-form`: To be used for efficient form handling in CRUD modules.
-   `react-quill`: For rich text editing of job descriptions.

## 🤝 Backend Integration

The admin panel communicates with the backend API (running on port 5001) via `axios`. Ensure the backend is running and the `NEXT_PUBLIC_API_URL` is correctly set.
# Exam-Result-Admin
