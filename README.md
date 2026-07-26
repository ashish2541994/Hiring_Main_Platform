# Wind Hire - Enterprise Hiring Platform

A modern, production-ready hiring platform built with the MERN stack.

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS v4
- shadcn/ui
- Framer Motion
- React Router DOM
- Axios
- TanStack Query
- React Hook Form
- Zod
- React Icons
- Lucide React
- Recharts
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Refresh Token
- bcrypt
- Multer
- Cloudinary
- Socket.io
- Nodemailer
- Helmet
- Rate Limiting
- Compression
- Morgan
- Express Validator

## Project Structure

### Frontend
```
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── auth/
│   │   ├── layout/
│   │   ├── ui/
│   │   └── layouts/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── candidate/
│   │   ├── companies/
│   │   ├── error/
│   │   ├── jobs/
│   │   ├── messages/
│   │   ├── notifications/
│   │   ├── public/
│   │   └── recruiter/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── constants/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### Backend
```
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── repositories/
├── utils/
├── helpers/
├── socket/
├── emails/
├── uploads/
├── logs/
├── server.js
├── package.json
└── .env.example
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Wind_Hire
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd ../backend
npm install
```

4. Set up environment variables
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

5. Start MongoDB
```bash
# Make sure MongoDB is running on your system
# Default connection: mongodb://localhost:27017/windhire
```

6. Start the development servers

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

7. Open your browser
```
Frontend: http://localhost:5173
Backend API: http://localhost:5000
```

## Features

### For Candidates
- Job search with filters
- Apply to jobs
- Track applications
- Save jobs
- Profile management
- Real-time notifications
- Messaging with recruiters

### For Recruiters
- Post and manage jobs
- Review applications
- Candidate management
- Company profile
- Analytics dashboard
- Messaging with candidates

### For Admins
- User management
- Platform analytics
- Content moderation
- System settings

## Environment Variables

Backend (.env):
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/windhire
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_here
JWT_REFRESH_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=noreply@windhire.com
FRONTEND_URL=http://localhost:5173
```

## Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
npm test         # Run tests
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email support@windhire.com or open an issue in the repository.
