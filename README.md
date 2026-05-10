# 🌍 Traveloop - Professional Travel Planning Platform

A modern, full-stack travel planning application with a beautiful white theme design. Plan trips, track budgets, manage packing lists, and discover amazing destinations - all in one place!

![Traveloop](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)

## ✨ Features

### 🗺️ Smart Trip Planning
- Create and manage multiple trips
- Add multiple stops/cities to each trip
- Day-by-day itinerary builder
- Activity scheduling with categories

### 💰 Budget Management
- Track expenses by category
- Real-time budget monitoring
- Visual spending analytics
- Budget alerts and warnings

### 📦 Packing Lists
- Smart packing checklists
- Category-based organization
- Progress tracking
- Mark items as packed/unpacked

### 🌆 Destination Discovery
- Explore cities worldwide
- Search and filter destinations
- Activity recommendations
- Beautiful destination cards

### 🔐 User Authentication
- Secure JWT-based authentication
- User profiles with avatars
- Password reset functionality
- Role-based access control

### 🎨 Premium Design
- Professional white/light theme
- Glassmorphism effects
- Smooth Framer Motion animations
- Fully responsive design
- Mobile-friendly interface

## 🚀 Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Recharts** - Data visualization
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Clone Repository
```bash
git clone https://github.com/preetpate/Traveloop.git
cd Traveloop
```

### Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# JWT_EXPIRES_IN=7d
# PORT=5000
# FRONTEND_URL=http://localhost:5173

# Start backend server
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env
echo "USE_MOCK_API=true" >> .env

# Start frontend dev server
npm run dev
```

## 🎯 Quick Start (Mock API Mode)

For quick testing without MongoDB:

1. **Frontend only:**
```bash
cd frontend
npm install
npm run dev
```

2. Open browser: `http://localhost:5173`

3. **Demo Credentials:**
   - Email: `demo@traveloop.com`
   - Password: `anything` (any password works in mock mode)

The app will use localStorage with pre-loaded sample data!

## 📱 Usage

### Creating Your First Trip
1. Sign up or log in
2. Click "Create New Trip" on dashboard
3. Fill in trip details (title, dates, description)
4. Add stops/cities to your trip
5. Add activities to each stop
6. Track your budget and packing list

### Exploring Destinations
1. Navigate to "Explore Cities"
2. Search for destinations
3. Filter by country or tags
4. Add cities to your trips

### Managing Budget
1. Open any trip
2. Go to Budget section
3. Set total budget
4. Add expense categories
5. Track spending in real-time

## 🎨 Design System

The app features a professional white/light theme with:
- **Background:** #F8FAFC (Light gray-blue)
- **Cards:** #FFFFFF (White with glassmorphism)
- **Primary:** #2563EB (Blue)
- **Accent:** #8B5CF6 (Purple)
- **Success:** #10B981 (Green)
- **Danger:** #EF4444 (Red)

All components include:
- Smooth animations (150-200ms)
- Glassmorphism effects
- Accessibility features (ARIA labels, keyboard navigation)
- Responsive design

## 📂 Project Structure

```
Traveloop/
├── backend/
│   ├── src/
│   │   ├── config/         # Database & environment config
│   │   ├── middleware/     # Auth, rate limiting, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   └── server.js       # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API & mock services
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   └── package.json
│
└── README.md
```

## 🔧 Available Scripts

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🌟 Key Features Showcase

### Dashboard
- Animated stat cards
- Recent trips timeline
- Quick actions
- Trending destinations

### Trip Management
- Create/edit/delete trips
- Cover image support
- Date range validation
- Stop reordering

### Itinerary Builder
- Day-by-day timeline
- Activity categories
- Time and duration tracking
- Cost estimation

### Budget Tracker
- Category-based budgeting
- Visual charts
- Spending alerts
- Remaining budget calculation

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting on auth routes
- MongoDB injection prevention
- CORS configuration
- Input validation and sanitization

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Render/Railway)
```bash
cd backend
# Set environment variables on hosting platform
# Deploy with start command: node src/server.js
```

## 📝 Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/traveloop
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
USE_MOCK_API=false
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Preet Patel**
- GitHub: [@preetpate](https://github.com/preetpate)

## 🙏 Acknowledgments

- Design inspiration from Airbnb and Notion
- Icons by Lucide React
- UI components built with Tailwind CSS
- Animations powered by Framer Motion

## 📞 Support

For support, email preetpate@users.noreply.github.com or open an issue on GitHub.

---

Made with ❤️ by Preet Patel
