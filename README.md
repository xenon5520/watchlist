# Watchlist App

A modern, full-stack movie and series tracking application built with the MERN stack (MongoDB, Express, React, Node.js) and Vite.

## 🚀 Features

- **Full CRUD Operations**: Add, view, update, and delete movies or series from your watchlist.
- **Detailed Tracking**: Store information such as title, type (Movie/Series), genre, rating, watch status, streaming platform, and release year.
- **Responsive Design**: A clean and modern UI built with Tailwind CSS and DaisyUI.
- **State Management**: Optimized with Zustand for a smooth user experience.
- **Interactive UI**: Featuring smooth scrolling, hot toast notifications, and dynamic routing.
- **Global Search & Detail View**: Easily find and view specific details for any entry in your list.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Routing**: [React Router](https://reactrouter.com/)
- **API Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Environment Management**: [Dotenv](https://github.com/motdotla/dotenv)
- **CORS Handling**: [CORS](https://github.com/expressjs/cors)

## 📂 Project Structure

```text
watchlist/
├── backend/
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # API logic
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API endpoints
│   │   └── server.js     # Entry point
│   ├── .env              # Environment variables
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── lib/          # Axios & utilities
    │   ├── pages/        # Application pages (Home, Create, Details)
    │   ├── App.jsx       # Main application logic
    │   └── main.jsx      # Entry point
    ├── tailwind.config.js
    └── package.json
